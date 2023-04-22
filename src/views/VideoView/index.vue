<template>
  <div class="main">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <!-- video -->
      <el-tab-pane label="推荐视频" name="1">
        <!-- video标签 -->
        <div class="label">
          <div class="label-all" @mouseenter="flag = true" @mouseleave="flag = false">
            <p class="allLabel">全部标签</p>
            <div class="card-box" v-show="flag">
              <!-- 索引4，'万有引力'没有数据一直报错，所以直接把他隐藏了不展示 -->
              <template v-for="(item, i) in categoryList.data" :key="i">
                <div v-if="i !== 4" @click="handleLabel(i, item.id)">
                  {{ item.name }}
                </div>
              </template>
            </div>
          </div>
          <div class="label-item">
            <template v-for="(item, i) in categoryList.data.slice(0, 8)" :key="i">
              <p v-if="i !== 4" @click="handleLabel(i)" :class="i === index ? 'label-active' : ''">{{ item.name }}</p>
            </template>
          </div>
        </div>
        <!-- video列表 -->
        <div class="videoList" v-loading="loading" element-loading-text="Loading...">
          <ul>
            <li @click="videoPlay(item.data.vid)" v-for="(item, index) in videoList.data" :key="index">
              <div class="videoBox">
                <!-- 视频展示图片 -->
                <img class="videoImg" :src="item.data.coverUrl">
                <!-- 播放图标 -->
                <div class="play">
                  <span class="iconfont icon-bofang"></span>
                </div>
                <!-- 播放次数 -->
                <div class="playTime">
                  <p class="iconfont icon-video" style="margin-right:2px;"></p>
                  <p>{{ item.data.playTime }}</p>
                </div>
                <!-- 评论个数 -->
                <div class="commentCount">
                  <p class="iconfont icon-xinxi"></p>
                  <p>{{ item.data.commentCount }}</p>
                </div>
                <!-- 播放时长 -->
                <div class="durationms">{{ item.data.durationms }}</div>
              </div>
              <p class="videoTitle">{{ item.data.title }}</p>
              <p class="videoAuthor">{{ item.data.creator.nickname }}</p>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <!-- mv -->
      <el-tab-pane label="Mv" name="2" v-loading="loading" element-loading-text="Loading...">
        <div class="mv-container">
          <!-- 分类选择 -->
          <div class="classify">
            <!-- 地区 -->
            <div class="area">
              <p>地区：</p>
              <ul>
                <li :class="item.active ? 'active-mv' : ''" v-for="item in areaList" :key="item.id"
                  @click="getKeyword(item.type, item.keyword)">{{ item.keyword }}
                </li>
              </ul>
            </div>
            <!-- 类型 -->
            <div class="type">
              <p>类型：</p>
              <ul>
                <li :class="item.active ? 'active-mv' : ''" v-for="item in typeList" :key="item.id"
                  @click="getKeyword(item.type, item.keyword)">{{ item.keyword }}
                </li>
              </ul>
            </div>
            <!-- 排序 -->
            <div class="order">
              <p>排序：</p>
              <ul>
                <li :class="item.active ? 'active-mv' : ''" v-for="item in orderList" :key="item.id"
                  @click="getKeyword(item.type, item.keyword)">{{ item.keyword }}
                </li>
              </ul>
            </div>
          </div>
          <div class="mv-content" v-loading="loading">
            <div class="videoList" v-loading="loading" element-loading-text="Loading...">
              <ul>
                <li @click="mvPlay(item.id)" v-for="(item, index) in mvList.data" :key="index">
                  <div class="videoBox">
                    <!-- 视频展示图片 -->
                    <img class="videoImg" :src="item.cover">
                    <!-- 播放图标 -->
                    <div class="play">
                      <span class="iconfont icon-bofang"></span>
                    </div>
                    <!-- 播放次数 -->
                    <div class="playTime">
                      <p class="iconfont icon-video" style="margin-right:2px;"></p>
                      <p>{{ item.playCount }}</p>
                    </div>
                    <!-- 评论个数 -->
                    <div class="commentCount">
                      <p class="iconfont icon-xinxi"></p>
                      <p>{{ item.playCount }}</p>
                    </div>
                    <!-- 播放时长 -->
                    <div class="durationms">{{ item.duration }}</div>
                  </div>
                  <p class="videoTitle">{{ item.name }}</p>
                  <p class="videoAuthor">{{ item.name }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { videoCategoryList, videoGroup, videoGroupList, allMv, mvUrl } from '@/api/video'

const router = useRouter()
let loading = ref(true)

// tab栏哪一项被激活
const activeName = ref('1')

const handleClick = (tab, event) => {
  // console.log(tab, event)
}

// 获取视频分类列表
let categoryList = reactive({
  data: []
})
let videoList = reactive({
  data: []
})
// 标签索引
let index = ref(0)
onMounted(async () => {
  categoryApp(index.value)
})

async function categoryApp(indexs) {
  // 获取视频分类列表
  const { data } = await videoGroupList()

  categoryList.data = data.data

  // 初始化循环数据
  let cycleData = []
  for (let i = 0; i < 5; i++) {
    // 拿到循环数据
    let app = await videoGroup(data.data[indexs].id, i)
    // 将想要的结果提取出来
    let result = app.data.datas
    // 再将数据push到循环数据中
    cycleData.push(result)
  }

  // 对循环后的数据进行处理一下
  cycleData.map((item, index, array) => {
    item.map((item2, index2, array2) => {
      // push给视频列表
      videoList.data.push(item[index2])
      loading.value = false
    })
  })
}

// 点击跳转到对应视频的详情页
const videoPlay = (id) => {
  router.push({
    name: 'videodetail',
    params: {
      id
    }
  })
}

let flag = ref(false)
// 根据index获取对应类型的视频
const handleLabel = (indexs, id) => {
  ElMessage.success('加载成功！')
  loading.value = true
  index.value = indexs
  categoryList.data = []
  videoList.data = []
  categoryApp(indexs)
}


// mv相关code*************************************************************************************************************************
// 地区列表
const areaList = reactive([
  {
    id: 1,
    type: 'area',
    keyword: '全部',
    active: true
  },
  {
    id: 2,
    type: 'area',
    keyword: '内地',
    active: false
  },
  {
    id: 3,
    type: 'area',
    keyword: '港台',
    active: false
  },
  {
    id: 4,
    type: 'area',
    keyword: '欧美',
    active: false
  },
  {
    id: 5,
    type: 'area',
    keyword: '日本',
    active: false
  },
  {
    id: 6,
    type: 'area',
    keyword: '韩国',
    active: false
  }
])
// 类型列表
const typeList = reactive([
  {
    id: 1,
    type: 'type',
    keyword: '全部',
    active: true
  },
  {
    id: 2,
    type: 'type',
    keyword: '官方版',
    active: false
  },
  {
    id: 4,
    type: 'type',
    keyword: '现场版',
    active: false
  },
  {
    id: 5,
    type: 'type',
    keyword: '网易出品',
    active: false
  },
])
// 排序列表
const orderList = reactive([
  {
    id: 1,
    type: 'order',
    keyword: '上升最快',
    active: true
  },
  {
    id: 2,
    type: 'order',
    keyword: '最热',
    active: false
  },
  {
    id: 3,
    type: 'order',
    keyword: '最新',
    active: false
  }
])
// 拿到分类的关键字
let area = ref('全部')
let type = ref('全部')
let order = ref('上升最快')
let limit = ref(30)
let offset = ref(0)
// mv列表
let mvList = reactive({
  data: []
})
// 初始化获取数据，并渲染页面
onMounted(async () => {
  mvApp(area.value, type.value, order.value, limit.value, offset.value)
})
// 封装成函数
async function mvApp(area, type, order, limit, offset) {
  const { data } = await allMv(area, type, order, limit, offset)
  mvList.data = data.data
}
// 获取点击的关键字，并发请求,拿数据
const getKeyword = (classify, key) => {
  ElMessage.success('加载成功！')
  if (classify === 'area') {
    area.value = key
    thisActive(areaList, key)
  } else if (classify === 'type') {
    type.value = key
    thisActive(typeList, key)
  } else if (classify === 'order') {
    order.value = key
    thisActive(orderList, key)
  }
  mvApp(area.value, type.value, order.value, limit.value, offset.value)
}
// 封装当前点击的高亮（active：true高亮）
function thisActive(arr, key) {
  arr.map((item, index, array) => {
    item.active = false
    if (key == item.keyword) {
      array[index].active = true
    }
  })
}
// 跳转到mv详情页
const mvPlay = (id) => {
  router.push({
    name: 'mvdetail',
    params: {
      id
    }
  })
}
</script>
<script>
export default {
  name: 'VideoView'
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  margin-bottom: 80px;

  .label {
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .label-all {
      width: 100px;
      height: 30px;
      color: var(--c);
      cursor: pointer;
      border: 1px solid var(--c);
      border-radius: 10px;
      position: relative;

      .allLabel {
        line-height: 25px;
        text-align: center;
      }

      .card-box {
        width: 37vw;
        height: 40vh;
        background-color: var(--bgc);
        border: 1px solid #fff;
        box-shadow: 0 0 20px 5px #a1a1a1;
        position: absolute;
        top: 30px;
        left: -3px;
        z-index: 100;
        border-radius: 10px;
        padding: 5px;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;

        div {
          margin: 0 20px;
          width: 80px;
          margin: 5px;
          text-align: center;
          margin-top: 20px;

          &:hover {
            color: var(--ele-tabs-border);
          }
        }
      }
    }

    .label-item {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;

      p {
        font-size: 18px;
        margin: 5px 20px;
        color: var(--c);
        cursor: pointer;
        margin-left: 30px;
        padding: 2px;
      }

      // 标签激活样式
      .label-active {
        color: red;
        border: 1px solid red;
        border-radius: 30px;
      }
    }


  }

  .videoList {
    width: 100%;
    // border: 1px solid red;
    margin-top: 50px;

    ul {
      height: auto;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      li {
        width: 300px;
        // height: 200px;
        color: var(--c);
        margin-bottom: 40px;

        .videoBox {
          width: 100%;
          height: 200px;
          position: relative;
          cursor: pointer;
          border-radius: 20px;
          overflow: hidden;
          max-height: 169px;


          &:hover {
            .videoImg {
              transform: translate(-50px, 20px) scale(1.3);
            }

            .play {
              span {
                color: var(--tc);
              }
            }
          }

          .videoImg {
            width: 100%;
            height: 110%;
            object-fit: cover;
            transition: all .5s ease;
          }

          .play {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            span {
              font-size: 30px;
              transition: all .5s;
              color: #fff;
            }
          }

          .playTime,
          .commentCount,
          .durationms {
            color: #fff;
            position: absolute;
            font-family: '';
            display: flex;
          }

          .playTime,
          .commentCount,
          .durationms {
            p:first-child {
              font-size: 18px;
              margin-right: 5px;
            }
          }

          .playTime {
            top: 5px;
            right: 5px;
            font-weight: 700;
          }

          .commentCount {
            left: 5px;
            bottom: 5px;
            font-weight: 700;
          }

          .durationms {
            right: 5px;
            bottom: 5px;
            font-weight: 700;
          }

        }

        .videoTitle {
          font-size: 17px;
          font-weight: 900;
          color: var(--c);
        }

        .videoAuthor {
          font-size: 16px;
          color: var(--c);
        }
      }
    }
  }

  // mv
  .mv-container {
    width: 100%;

    .classify {
      width: 100%;

      div {
        color: var(--c);
        font-size: 20px;
        display: flex;

        p {
          margin-right: 10px;
        }

        ul {
          display: flex;
          margin-bottom: 15px;

          li {
            width: 80px;
            margin-right: 40px;
            cursor: pointer;
          }

          .active-mv {
            color: var(--tc);
            font-weight: 700;
          }

        }
      }
    }

    // .area {
    //   display: flex;
    // }
  }

  .mv-content {}
}
</style>
