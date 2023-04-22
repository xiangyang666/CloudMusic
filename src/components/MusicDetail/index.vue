<template>
  <div class="main">
    <!-- 详细信息 -->
    <div class="music-info">
      <!-- 左 -->
      <div class="left">
        <img width="200" :src="detailData.data.coverImgUrl" alt="">
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="title">
          <span>歌单</span>
          <h1 style="color: var(--c);">{{ detailData.data.name }}</h1>
        </div>
        <!-- 创造者中心 -->
        <div class="creator-info">
          <img @click="router.push({ name: 'personal', params: { id: detailData.data.creator.userId } })" width="30"
            :src="detailData.data.creator?.avatarUrl" alt="">
          <span @click="router.push({ name: 'personal', params: { id: detailData.data.creator.userId } })"
            class="title">{{ detailData.data.creator?.nickname }}</span>
          <span style="color: var(--c);" class="create-time">{{ getDay(detailData.data?.createTime) }}</span>
        </div>
        <div class="set">
          <el-button type="danger" round @click="playMusicDetailList($event, detailData.data?.tracks)">
            <span class="iconfont icon-sousuo"></span>
            播放全部
          </el-button>
          <el-button round>收藏</el-button>
          <el-button round>分享</el-button>
        </div>
        <div class="label">
          <p style="color: var(--c);">标签：</p>
          <p v-if="detailData.data.tags">
            <span v-for="(item, index) in detailData.data?.tags" :key="index">{{ item }}&nbsp;</span>
          </p>
          <p v-if="detailData.data.tags?.length === 0">暂无标签</p>
        </div>
        <div class="musics-info" style="color: var(--c);">
          <p>歌曲：<span>{{ detailData.data.trackCount }}</span></p>
          <span>&nbsp;&nbsp;</span>
          <p>播放：<span>{{ handleNum(detailData.data.playCount) }}</span></p>
        </div>
        <!-- <div class="say">
          <span class="text">说说：{{ detailData.data.creator?.signature }}</span>
        </div> -->
        <!-- 简介 -->
        <div class="synopsis">
          <p v-if="detailData.data?.description">简介：{{ detailData.data?.description }}</p>
          <p v-else>简介：暂无简介</p>
        </div>
      </div>
    </div>
    <!-- 歌单列表/评论/收藏者 -->
    <div class="comment">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabHandleClick">
        <el-tab-pane label="歌单列表" name="1">
          <div class="music-list">
            <!-- 表格 -->
            <!-- 加上stripe属性表格就会出现斑马线条纹了 -->
            <!-- row-click：点击某一行 -->

            <MusicList :musicApp="detailData.data?.tracks" :musicList="detailData.data?.tracks" />
            <!-- <div v-for="item in detailData.data?.tracks" :key="item.id">{{ item.name }}</div> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="评论" name="2">
          <template v-if="commentList.data">
            <div class="commentBox" v-if="commentList.data">
              <h1 class="txt">精彩评论</h1>
              <CommentList v-if="commentList.data" :commentList="commentList.data"></CommentList>
            </div>
            <!-- 评论分页器 -->
            <div class="comment-pagination">
              <el-pagination @current-change="currentChange" @prev-click="prevClick" @next-click="nextClick"
                :page-count="commentList.data.length" small background layout="prev, pager, next"
                :total="commentList.data.length" class="mt-4" />
            </div>
          </template>
          <NoData v-if="Object.keys(commentList.data).length == 0" />
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="3">
          <div class="music-list">
            <!-- 收藏者 -->
            <div class="collector-container">
              <div class="collector-item" v-for="(item, index) in collectorList.data" :key="index" @click="router.push({
                name: 'personal',
                params: {
                  id: item.userId
                }
              })">
                <img :src="item?.avatarUrl" alt="">
                <div class="collector-info">
                  <p>{{ item?.nickname }}</p>
                  <p>{{ item?.signature }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAudioStore } from '@/store/audio'
import { musicDetail, getMusicCommentList, getMusicCollector } from '@/api/home'
import { getSongAllMusic } from '@/api/user'
import { musicUrl } from '@/api/audio'
import MusicList from '@/components/MusicList'
import CommentList from '@/components/CommentList'
import { getDay } from '@/utils/day'
import { handleNum } from '@/utils/toolFunction'
import playMusicDetailList from '@/hooks/playMusicDetailList'
import NoData from '@/components/NoData'

const router = useRouter()
const route = useRoute()
const store = useAudioStore()

// 点击首页推荐歌单的id（不同歌单id不同）（根据不同id获取对应的数据）
const id = route.params.id


// 本来是不需要再每次路由参数中的id变化而更新数据，因为添加了个我的喜欢（我的喜欢内容用的也是当前组件）
watch(() => route.params.id, () => {
  createApp()
  getComment()

  // 当去我的喜欢的页面时，.e-main距离头部为0（否则就是虽然数据变了，但页面状态还没变）
  document.querySelector('.el-main').scrollTop = 0

  activeName.value = '1'
})

// 哪个tab栏显示，默认firsr显示，第一个
const activeName = ref('1')

// 歌曲页面相关数据
let detailData = reactive({
  data: []
})

let musicListObj = reactive({
  data: {}
})

const createApp = async () => {
  // 获取推荐歌单的详情数据
  const res = await getSongAllMusic(route.params.id)

  detailData.data = res.data.playlist

  // 根据id来查找对应音乐信息
  const data = res.data.playlist?.tracks

  let oneMusic = []
  for (let i = 0; i <= data?.length; i++) {
    // oneMusic = await musicUrl(data[i])
    // console.log('你好！！！')
  }
  data?.map((item) => {
    oneMusic.id = item.id
  })
  // console.log(data)

  musicListObj.data = data?.map(async (item, index) => {

    return {
      id: item.id,
      // 歌曲名
      musicName: item.name,
      // 歌曲音乐人
      musicSinger: item.ar[0].name,
      // 歌曲logo
      logo: item.al.picUrl,
      // 歌曲url
      // url: oneMusic.data.data[0].url,
      // // 歌曲时长
      // time: oneMusic.data.data[0].time,
      // // 歌曲的大小
      // size: oneMusic.data.data[0].size
    }
  })
  // console.log(musicListObj.data.musicName)

}
// 发请求
onMounted(async () => {
  createApp()
})


// 评论列表
let commentList = reactive({
  data: []
})
// 收藏者
let collectorList = reactive({
  data: []
})

// 封装获取评论函数
const getComment = async (offset) => {
  const { data } = await getMusicCommentList(detailData.data.id, commentLimit.value, offset)
  // console.log(data)
  commentList.data = data.comments
}

// tab栏点击事件
const tabHandleClick = async (tabs) => {
  // 点击哪个tab的label名字，进行判断
  const name = tabs.props.label

  if (name === '评论') {
    // 获取歌单评论数据
    getComment()
  } else if (name === '收藏者') {
    const { data } = await getMusicCollector(detailData.data.id)
    console.log(data)

    collectorList.data = data.subscribers
  } else {
    console.log('歌单列表')
  }
}
// 获取评论个数限制
const commentLimit = ref(50)

// 评论总页数
const pageCount = computed(() => {
  return
})

// num实参就是当前是哪一页
const currentChange = (num) => {
  // 之所以需要当前页码减去1，是因为接口的数据是从0开始的，0就是第一页
  getComment(num - 1)
}
const prevClick = (num) => {
  getComment(num - 1)
}
const nextClick = (num) => {
  getComment(num - 1)
}

// 去评论用户的详情页面
const goCommentUserPage = (id) => {
  router.push({
    name: 'personal',
    params: {
      id
    }
  })
}
</script>

<script>
export default {
  name: 'MusicDetail'
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  display: flex;
  flex-direction: column;

  .music-info {
    min-width: 1024px;
    width: 100%;
    height: 200px;
    display: flex;

    .left {
      margin-right: 20px;

      img {
        border-radius: 10px;
      }
    }

    .right {

      // 题目
      .title {
        span {
          background-color: rgb(237, 90, 90);
          border-radius: 5px;
          padding: 5px 8px;
          color: #fff;
        }

        h1 {
          margin-left: 10px;
        }
      }

      // 创造者信息
      .creator-info {
        margin-bottom: 10px;
        margin-top: 10px;

        img {
          margin-right: 10px;
          border-radius: 50%;
          cursor: pointer;
        }

        span {
          margin-right: 10px;
        }

        .title {
          color: #0084ff;
          font-size: 18px;
          cursor: pointer;
        }

      }

      // 播放全部、收藏、分享
      .set {
        margin-top: 5px;

        .el-button {
          font-size: 18px;
        }
      }

      // 标签信息
      .label {
        margin-top: 20px;

        p:last-child {
          color: #26a8f7;
        }
      }

      // 歌曲信息
      .musics-info {
        margin-top: 10px;
      }

      // 说说
      .say {
        margin-top: 5px;

        .text {
          color: #000 !important;
        }
      }

      // 简介
      .synopsis {
        margin-top: 7px;
      }

      div {
        display: flex;
        align-items: center;
      }

      div:last-child,
      .say>.text {
        color: red;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }

  // 评论盒子
  .commentBox {
    .txt {
      font-size: 30px;
      color: var(--c);
    }

  }

  .music-list {
    width: 100%;
    margin-top: 20px;

    // 评论
    .splendid-comment {
      font-size: 30px;
      margin-bottom: 30px;
    }

    .comment-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;

      .left {
        display: flex;
        margin-bottom: 30px;

        .user-logo {
          img {
            border-radius: 50%;
            cursor: pointer;
          }
        }

        .user-comment-info {
          width: 700px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 30px;

          .user-name {
            span:first-child {
              color: red;
              font-size: 20px;
              cursor: pointer;
            }

            span:last-child {
              font-family: '';
              line-height: 25px;
            }
          }

          .create-time {

            span {
              color: #000;
              font-size: 20px;
              margin-right: 20px;
            }
          }
        }
      }
    }

    // 收藏者
    .collector-container {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;

      .collector-item {
        height: 100px;
        width: 400px;
        margin-top: 50px;
        border-radius: 10px;
        display: flex;
        // margin-left:50px;
        padding: 10px 20px;

        &:hover {
          background-color: var(--collector-hover);
          cursor: pointer;
        }

        img {
          // width: 100px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .collector-info {
          p:first-child {
            font-size: 25px;
            color: var(--c);
          }

          p:last-child {
            font-family: '';
            font-size: 16px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            margin-top: 10px;
            color: #9c9c9c;
          }
        }
      }
    }

  }

  .comment {
    min-width: 1080px;
    width: 100%;
    margin-bottom: 42px;
    padding-bottom: 40px;

    // 评论分页器
    ::v-deep .comment-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 30px 0px;

      div {

        button {
          width: 40px;
          height: 40px;

        }

        ul {
          li {
            width: 40px;
            height: 40px;
            font-size: 20px;

          }

          .is-active {
            background-color: #ed5050;
          }
        }
      }
    }

    // element-plus   tabs栏的样式
    ::v-deep .el-tabs {
      .el-tabs__header {
        .el-tabs__nav-wrap {
          .el-tabs__nav-scroll {
            .el-tabs__nav {
              margin-bottom: 15px;

              // 下划线
              .el-tabs__active-bar {
                width: 100%;
                height: 3.5px;
                background-color: red;
                margin-top: 10px;
              }

              // 文字
              .el-tabs__item {
                color: #000;
                font-size: 25px;
                font-weight: 900;
              }
            }
          }
        }
      }

      .el-tabs__content {
        margin-bottom: 40px;
      }

      // 删除tab栏默认下划线
      .el-tabs__nav-wrap::after {
        position: relative;
      }
    }


  }
}

// tab栏样式
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-weight: 600;
}

::v-deep .demo-tabs {
  margin-top: 20px;

  .el-tabs__header {
    .el-tabs__nav-wrap {
      .el-tabs__item {
        font-size: 28px;
        color: var(--c) !important;
      }

      .el-tabs__nav-scroll {
        margin-top: 10px;
      }
    }
  }
}
</style>