<template>
  <div class="main">
    <!-- 热门50首 -->
    <div class="hot-music">
      <div class="left-box">
        <img width="200" src="http://www.codeman.ink/img/topSongsLogo.3c321631.png" alt="">
      </div>
      <div class="right-box">
        <h1>热门50首</h1>
        <div class="music-list">
          <div @click="playMusic(item.id)" class="item" v-for="(item, index) in songs.data.slice(0, sliceNum)"
            :key="index">
            <div class="left">
              <span>{{ index + 1 }}</span>
              <p>{{ item.name }}</p>
            </div>
            <span class="right">{{ item.ar[0].name }}</span>
          </div>
        </div>
        <div class="get-more" @click="getMoreMusic">{{ sliceText }}</div>
      </div>
    </div>
    <!-- 歌手专辑 -->
    <div class="hot-music box" v-for="(item, index) in singerAlbum.data.slice(1)" :key="index">
      <div class="left-box">
        <img :src="item.album.blurPicUrl">
      </div>
      <div class="right-box">
        <h1>{{ item.album.name }}</h1>
        <!-- 循环songs数组 -->
        <template v-for="(item2, index2) in item.songs" :key="index2">
          <div class="music-list">
            <div class="item" @click="playMusic(item2.id)">
              <div class="left">
                <span>{{ index2 + 1 }}</span>
                <p>{{ item2.name }}</p>
              </div>
              <span class="right">{{ item2.ar[0].name }}</span>
            </div>
          </div>
        </template>
        <div class="get-more" @click="goAlbumPage(item.album.id)">查看更多</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { singerDetail, singerHotMusic, singerAllAlbum, getAlbumData } from '@/api/singer'
import { musicDetailInfo, musicUrl } from '@/api/audio'
import { musicDetail } from '@/api/home'
import { useAudioStore } from '@/store/audio';

const route = useRoute()
const router = useRouter()
const audioStore = useAudioStore()

// 热门50首
const songs = reactive({
  data: []
})
// 歌手专辑
const singerAlbum = reactive({
  data: []
})
onMounted(async () => {
  // 歌手热门50首歌曲
  const { data } = await singerHotMusic(route.params.id)

  console.log('50', data)
  songs.data = data.songs

  // 歌手专辑（需要里面的id）
  const res = await singerAllAlbum(route.params.id)

  // 返回出每个数组的id
  const id = res.data.hotAlbums.map((item, index) => {
    return item.id
  })

  // 根据id获取专辑内容

  for (let i = 0; i < id.length; i++) {
    const result = await getAlbumData(id[i])
    singerAlbum.data.push(result.data)
  }
})

// 是否展开
const flag = ref(false)
// 截取数组前几项
const sliceNum = ref(7)
const sliceText = ref('查看更多>')
// 加载更多歌曲
const getMoreMusic = async () => {

  if (flag.value) {
    sliceNum.value = 7
    sliceText.value = '查看更多>'

    flag.value = false
  } else {
    sliceNum.value = songs.data.length
    sliceText.value = '收起>'

    flag.value = true
  }
}

// 去专辑页面
const goAlbumPage = (id) => {
  router.push({
    name: 'album',
    params: {
      id
    }
  })
}

// 播放音乐
const playMusic = async (id) => {
  console.log(id)
  // 歌曲详细信息
  const { data } = await musicDetailInfo(id)
  // 歌曲url
  const url = await musicUrl(data.songs[0].id)

  let oneMusicInfo = {
    // 音乐ID
    id: data.songs[0].id,
    // 歌曲名
    musicName: data.songs[0].name,
    // 歌曲音乐人
    musicSinger: data.songs[0].ar[0].name,
    // 歌曲logo
    logo: data.songs[0].al.picUrl,
    // 歌曲url
    url: url.data.data[0].url,
    // 歌曲时长
    time: url.data.data[0].time,
    // 歌曲的大小
    size: url.data.data[0].size
  }

  // 存储当前点击的音乐id
  audioStore.getId(data.songs[0].id)

  // 更新数据
  audioStore.updataMusic(oneMusicInfo)

  // 把歌曲url存到批念中前要判断（如果存的跟以前pinia中的url一样就不需要在存一份）
  audioStore.updataMusicInfo(oneMusicInfo)

  // 播放icon为播放状态
  // 每点一首歌修改是否暂停（因为每点一次音乐肯定是播放的，所以应该传true）
  audioStore.updataIsPlay(true)

  console.log(audioStore.index)
}

</script>
<script>
export default {
  name: 'SingerAlbum'
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin-bottom: 60px;

  .hot-music {
    display: flex;

    .left-box {
      width: 240px;
      height: 200px;
      margin-right: 15px;
      overflow: hidden;
      border-radius: 20px;
      // border:1px solid red;

      img {
        width: 105%;
        border-radius: 20px;
        position: relative;
        left: -1px;
        bottom: -3px;
      }
    }

    .right-box {
      width: 100%;
      color: var(--c);


      h1 {
        font-size: 27px;
        margin-left: 10px;
      }

      .music-list {
        margin-top: 10px;
        margin-left: 20px;

        .item {
          display: flex;
          justify-content: space-between;
          font-size: 17px;
          height: 35px;
          line-height: 35px;
          padding: 0 10px;
          cursor: pointer;

          .left {
            display: flex;

            span {
              margin-right: 10px;
            }

            p {
              overflow: hidden;
            }
          }

          &:hover {
            background-color: var(--album-hover-color) !important;
          }
        }

        .item:nth-child(odd) {
          background-color: var(--album-tabel-color);
        }
      }
    }

    .get-more {
      color: silver;
      cursor: pointer;

      &:hover {
        color: var(--tc);
      }
    }
  }

  .box {
    margin-top: 50px;
  }
}
</style>