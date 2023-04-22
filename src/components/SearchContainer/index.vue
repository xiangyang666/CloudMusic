<template>
  <div class="main">
    <!-- 热搜榜 -->
    <div class="hot-container" v-show="!store.keyword">
      <h1 class="hot-title">热搜榜</h1>
      <div class="hot-item" @click="hotClick(item.searchWord)" v-for="(item, index) in props.hotSearchList" :key="index">
        <h2 class="index">{{ index + 1 }}</h2>
        <div class="item">
          <h2>{{ item.searchWord }}</h2>
          <p>{{ item.content }}</p>
        </div>
      </div>
    </div>
    <!-- 关键词搜索 -->
    <div class="keyword-container" v-show="store.keyword">
      <div class="text">搜索建议</div>
      <div v-if="searchAdviseData.data">
        <div class="single-song" v-if="searchAdviseData.data?.songs">
          <div>
            <span class="iconfont icon-yinle"></span>
            <span>单曲</span>
          </div>
          <p @click="updataMusic(item.id, item.name, item.artists[0].name, item)"
            v-for="(item, index) in searchAdviseData.data?.songs" :key="index">
            {{ item.name }} - {{ item.artists[0].name }}
          </p>
        </div>
        <div class="singer" v-if="searchAdviseData.data?.artists">
          <div>
            <span class="iconfont icon-huatong"></span>
            <span>歌手</span>
          </div>
          <p @click="handleSinger(item)" v-for="(item, index) in searchAdviseData.data?.artists" :key="index">
            {{ item.name }}
          </p>
        </div>
        <div class="special-album" v-if="searchAdviseData.data?.albums">
          <div>
            <span class="iconfont icon-zhuanji"></span>
            <span>专辑</span>
          </div>
          <p @click="handleAlbum(item)" v-for="(item, index) in searchAdviseData.data?.albums" :key="index">
            {{ item.name }} - {{ item.artist.name }}
          </p>
        </div>
        <div class="playlist" v-if="searchAdviseData.data?.playlists">
          <div>
            <span class="iconfont icon-yinleliebiao"></span>
            <span>歌单</span>
          </div>
          <p @click="handleMusicList(item)" v-for="(item, index) in searchAdviseData.data?.playlists" :key="index">
            {{ item.name }}
          </p>
        </div>
      </div>
      <NoData :text='`很抱歉，未能找到相关的数据`' v-if="JSON.stringify(searchAdviseData.data) == '{}'" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, reactive, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSearchStore } from '@/store/search';
import { keywordsSearch, searchAdvise } from '@/api/search'
import { musicUrl, musicDetailInfo } from '@/api/audio'
// import debounce from '@/utils/debounce.js';
import { debounce } from 'lodash';
import { useAudioStore } from '@/store/audio'
import NoData from '@/components/NoData'

const route = useRoute()
const router = useRouter()
const store = useSearchStore()
const audioStore = useAudioStore()

// 搜索建议数据
let searchAdviseData = reactive({
  data: []
})

// 拿到store/search中的搜索关键词
// 监听关键词的变化进行数据的获取(获取的是搜索建议)
let timer = null;
watch(() => store.keyword, async (newVal, oldVal) => {
  // 如果关键词是空的就没必要发请求了
  if (!store.keyword) {
    // console.log('请输入关键词!!!')
    return true // 后面的代码都不执行了
  }
  if (timer) {
    clearTimeout(timer)
  }

  const { data } = await searchAdvise(store.keyword)
  searchAdviseData.data = data.result

}, {
  immediate: true,
  deep: true
})


const props = defineProps({
  // 父组件传来的搜索框关键字
  hotSearchList: Array
})

const hotClick = async (keyword) => {
  router.push({
    name: 'search',
    params: {
      keyword
    }
  })


  // 修改搜索框的文本
  store.updataKeyword(keyword)

  // 根据关键词，发请求,搜索音乐列表
  const res = await keywordsSearch(keyword)
  const musicListData = res.data.result
  store.updataMusicList(musicListData)



  // 更新曲目条数
  store.updataSongCount(res.data.result.songCount)

  // 关闭❎搜索建议组件
  store.updataIsShow(false)
}

// 根据每一行的id获取对应的数据
const updataMusic = async (id, musicName, musicSinger, item) => {
  // 整理歌曲信息
  let song = {
    id,
    musicName,
    musicSinger,
    logo: '',
    url: '',
    time: '',
    size: '',
  }
  // 获取歌曲url
  const music = await musicUrl(id)
  song.url = music.data.data[0].url
  song.size = music.data.data[0].size
  song.time = music.data.data[0].time
  // 获取歌曲详细信息（这里面没有歌曲url）
  const { data } = await musicDetailInfo(id)
  song.logo = data.songs[0].al.picUrl
  // console.log(data)
  // console.log(id, musicName, musicSinger)
  // console.log('当前音乐的数据',song)
  audioStore.updataIsPlay(true)
  audioStore.updataMusic(song)
  audioStore.updataMusicInfo(song)
}

// 歌手
const handleSinger = ({ id }) => {
  router.push({
    name: 'singerdetail',
    params: {
      id
    }
  })
}

// 专辑
const handleAlbum = ({ id }) => {
  router.push({
    name: 'album',
    params: {
      id
    }
  })
}

// 歌曲
const handleMusicList = ({ id }) => {
  router.push({
    name: 'musicdetail',
    params: {
      id
    }
  })
}

</script>

<script>
export default {
  name: 'SearchContainer'
}
</script>

<style lang="scss" scoped>
// 显示
.show {
  display: block;
}

// 隐藏
.hide {
  display: none;
}

.main {
  width: 500px;
  height: 470px;
  position: absolute;
  background-color: rgb(255, 255, 255);
  z-index: 1000;
  top: 44px;
  left: -88px;
  border-radius: 5px;
  box-shadow: 0px 10px 25px 10px #cfcfcf;
  overflow: scroll;

  // 热搜榜
  .hot-container {

    .hot-title {
      margin-top: 20px;
      margin-left: 30px;
      margin-bottom: 30px;
    }

    .hot-item {
      height: 70px;
      width: 100%;
      display: flex;
      align-items: center;
      // margin-bottom: 20px;

      .index {
        margin-right: 20px;
        margin-left: 25px;
        color: #a1a1a1;
      }

      .item {
        height: 45px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        p {
          font-size: 13px;
        }
      }

      &:hover {
        background-color: #f5f5f5;
      }

    }

    // 修改 前三个item .index的元素的样式
    .hot-item:nth-child(-n+4) .index {
      color: #ed5050;
    }
  }

  // 关键词搜索
  .keyword-container {
    .text {
      padding: 15px 20px;
    }

    .single-song,
    .singer,
    .special-album,
    .playlist {
      div {
        background-color: #f9f9f9;
        padding: 10px 20px;
        line-height: 10px;

        span:first-child {
          margin-right: 10px;
        }
      }

      p {
        padding-left: 50px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 5px;

        &:hover {
          background-color: #ffecec;
        }
      }


    }
  }
}
</style>