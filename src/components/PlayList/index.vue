<template>
  <div class="main">
    <div class="title-content">
      <div class="left">
        <img :src="titleContent.bgImg" alt="">
      </div>
      <div class="right">
        <!-- 跳转到每个类型（标签）的第一个数据 -->
        <div @click="playListDetail(PlayListData.data[0].id)"><span class="iconfont icon-faxian"></span>精品歌单</div>
        <div>{{ titleContent.text }}</div>
      </div>
    </div>
    <div class="navbar">
      <div class="left" @click="handleLabelList" v-click-outside="close">
        <p @click="isShow">{{ musicLabel }}></p>
        <div class="mark" v-show="show">
          <div :class="musicLabel == item.name ? 'active' : ''" @click="updataMusicListLabel(item.name)"
            v-for="(item, index) in labelList.data" :key="index">{{ item.name
            }}</div>
        </div>
      </div>
      <div class="right">
        <div :class="musicLabel == item.name ? 'active' : ''" @click="updataMusicListLabel(item.name)"
          v-for="(item, index) in hotCategory.data" :key="index">{{ item.name
          }}</div>
      </div>
    </div>
    <div class="music-list">
      <ul>
        <li @click="playListDetail(item.id)" v-for="(item, index) in PlayListData.data" :key="index">
          <img :src="item.coverImgUrl" alt="">
          <h3>{{ item.name }}</h3>
        </li>
      </ul>
    </div>
    <el-pagination @current-change="currentChange" @prev-click="prevClick" @next-click="nextClick" background
      layout="prev, pager, next" :page-size="50" :total="PlayListData.total" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { categoryList, hotMusicCategory, playList, highqualityPlaylist } from '@/api/playlist'
import { useRouter, useRoute } from 'vue-router'
// 指令名称以v开头
import vClickOutside from '@/directives/clickOutSide';

function close() {
  console.log('盒子以外')
}

const router = useRouter()
// 控制mark显示与隐藏
let show = ref(false)

// let titleContent = reactive({
//   text: '可爱摇滚｜一剂抵挡春困的上好良药',
//   bgImg: 'http://p2.music.126.net/SA6bW1UlPP04rFB2pj-FvQ==/109951165813403264.jpg'
// })
// 精品歌单数据
let titleContent = reactive({})


// 组件挂载完成后执行
onMounted(async () => {
  getHotMusicCategory()
  getPlayList(musicLabel.value, 0)
})

// 热歌歌单分类数据
const hotCategory = reactive({
  data: []
})
// 获取热门歌单分类
const getHotMusicCategory = async () => {
  const { data } = await hotMusicCategory()
  hotCategory.data = data.tags

  // 获取精品歌单的文案（第一条数据）每次随机一个标题
  const res = await highqualityPlaylist()
  titleContent.text = res.data.playlists[0].name
  titleContent.bgImg = res.data.playlists[0].coverImgUrl
}

const labelList = reactive({
  data: []
})
// 标签列表
const handleLabelList = async () => {
  const { data } = await categoryList()
  labelList.data = data.sub
}

// 当前的歌单标签
let musicLabel = ref('华语')
// 歌单列表的数据
let PlayListData = reactive({
  // 歌单数据
  data: [],
  // 总共多少条数据
  total: 0
})
// 歌单 ( 网友精选碟 )
const getPlayList = async (label, offset) => {
  const { data } = await playList(label, offset)

  PlayListData.data = data.playlists
  PlayListData.total = data.total

  musicLabel.value = label

  // console.log(PlayListData)
}

// 点击音乐标题切换不同歌单
const updataMusicListLabel = (label) => {
  console.log(label)
  getPlayList(label, 0)
}

// 去歌单详情页（传入当前点击的歌单id）
const playListDetail = (id) => {
  router.push({
    name: 'musicDetail',
    params: {
      id
    }
  })
}

// mark显示与隐藏
const isShow = () => {
  show.value = !show.value
}

// 本身是可以写一个函数的（函数体代码都一样），这里为了小白理解明白就每个都写了
const currentChange = (num) => {
  getPlayList(musicLabel.value, (num - 1) * 50) // 参数1：标签名，参数2：当前页（当前页 - 1）* 50
}
const prevClick = (num) => {
  getPlayList(musicLabel.value, (num - 1) * 50)
}
const nextClick = (num) => {
  getPlayList(musicLabel.value, (num - 1) * 50)
}
</script>
<script>
export default {
  name: 'PlayList'
}
</script>
<style lang="scss" scoped>
.main {
  max-width: 1280px;
  min-width: 980px;
  margin: 0 auto;

  .title-content {
    min-width: 100%;
    height: 200px;
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    background-color: #898989;
    position: relative;


    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      min-width: 90%;
      height: 200px;
      background-image: url(http://p1.music.126.net/SA6bW1UlPP04rFB2pj-FvQ==/109951165813403264.jpg);
      background-size: 100%;
      filter: blur(50px);
      z-index: 1;
    }

    .left {
      width: 170px;
      height: 170px;
      margin: 15px 10px;
      border-radius: 20px;
      overflow: hidden;
      z-index: 2;

      img {
        width: 100%;
      }
    }

    .right {
      z-index: 2;

      div:first-child {
        width: 120px;
        height: 30px;
        padding: 5px 10px;
        text-align: center;
        border: 1px solid #fe8200;
        margin-top: 45px;
        border-radius: 20px;
        color: #fe8200;
        cursor: pointer;
      }

      div:last-child {
        margin-top: 20px;
        font-size: 26px;
        color: var(--bgc);
      }
    }
  }

  .navbar {
    width: 100%;
    display: flex;
    color: var(--c);
    padding: 10px 5px;
    align-items: center;
    margin-top: 10px;

    .left {
      width: 100%;
      position: relative;

      p {
        width: 115px;
        text-align: center;
        padding: 6px 10px;
        border-radius: 20px;
        border: 1px solid #ccc;
        font-size: 18px;
        cursor: pointer;
        font-weight: 900;

        &:hover {
          color: var(--tc);
        }
      }

      .mark {
        width: 575px;
        height: 300px;
        position: absolute;
        top: 40px;
        overflow-y: scroll;
        box-shadow: 0 0 12px 4px var(--collector-hover);
        background-color: var(--bgc);

        div {
          width: 90px;
          font-size: 17px;
          float: left;
          cursor: pointer;
          text-align: center;
          margin: 15px 10px;
          padding: 8px 0;

          &:hover {
            color: var(--tc);
          }
        }
      }
    }

    .right {
      display: flex;
      justify-content: flex-end;
      flex: 1;

      div {
        width: 85px;
        text-align: center;
        padding: 8px 2px;
        font-size: 18px;
        cursor: pointer;

        &:hover {
          color: var(--tc);
        }
      }
    }
  }

  .music-list {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;

    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin: 10px 0;

      li {
        margin: 0 1% 40px .6%;
        width: 18.4%;
        transition: all .5s;

        overflow: hidden;

        img {
          width: 100%;
          border-radius: 20px;
          cursor: pointer;
        }

        h3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: all .3s;
          cursor: pointer;
          color: var(--c);
        }

        &:hover h3 {
          color: var(--tc);
        }
      }
    }
  }
}

// 激活样式
.active {
  color: red;
  background-color: #fcebeb;
  border-radius: 30px;
  font-weight: 800;
}
</style>

