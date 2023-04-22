<template>
  <div>
    <div class="main">
      <!-- 当前播放的音乐相关信息容器 -->
      <div class="music-info">
        <!-- 歌曲图片 -->
        <div class="music-logo" @click="musicLyrics">
          <img :src="music?.logo ? music?.logo : 'http://www.codeman.ink/img/test.b66d0610.jpg'" alt="">
        </div>
        <!-- 歌名和歌手 -->
        <div class="name">
          <h1>{{ music?.musicName }}</h1>
          <p>{{ music?.musicSinger }}</p>
        </div>
        <!-- 下载音乐 -->
        <div v-if="music?.musicName" class="download-music" @click="download(music?.musicName, music?.url || '')">
          <p style="color: var(--c);" class="iconfont icon-xiazai1"></p>
        </div>
      </div>
      <!-- 控制音乐的一些容器 -->
      <div class="music-control">
        <!-- 控制音乐上一首下一首暂停播放 -->
        <div class="control">
          <!-- 音乐播放状态 -->
          <p style="color: var(--c);" :class="updataPlayStatus()" class="iconfont" @click="handleUpdataPlayMock"></p>
          <!-- 上一曲 -->
          <p class="iconfont icon-shangyishou" @click="prevSong"></p>
          <!-- 播放暂停 -->
          <p @click="play" class="iconfont" :class="store.isPlay ? 'icon-24gf-pause2' : 'icon-bofang'"></p>
          <!-- 下一曲 -->
          <p class="iconfont icon-next-fill" @click="nextSong"></p>
          <!-- 加入自己喜欢列表 -->
          <p @click="addUserLikeMusic" class="iconfont" :class="isLikeIcon"></p>
        </div>
        <!-- 音乐进度条滑块 -->
        <div class="silder-container">
          <!-- 开始时间 -->
          <p>{{ startTime ? startTime : '00:00' }}</p>
          <div class="slider-demo-block">
            <el-slider :disabled="musicCurrentTime ? false : true" @change="handleMusicCurrentTime"
              v-model="musicCurrentTime" />
          </div>
          <!-- 如果结束时间为undefined或NAN默认值为'00:00'，否则就是格式化后的值 -->
          <p>{{ endTime ? endTime : '00:00' }}</p>
        </div>
      </div>
      <!-- 控制音乐音量和版权信息容器 -->
      <div class="music-list">
        <div class="volume">
          <!-- mute：静音 -->
          <p @click="soundMute" :class="handleVolumeIcon()" class="iconfont"></p>
          <div class="slider-demo-block">
            <el-slider v-model="volume" :show-tooltip="false" @input="handleVolume" />
          </div>
          <p @click="musicListDrawer" class="iconfont icon-bofangliebiao"></p>
        </div>
        <div class="copyright">粤ICP备2021068014号</div>
      </div>
    </div>
    <!-- 
          store.musicListInfo[store.musicListInfo.length-1].url
          这里获取到的是每次点击后将音乐添加到音乐列表里的最后一个音乐对象
        -->
    <!-- 有时获取的url会出现403问题 -->
    <!-- 解决：https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e8%8e%b7%e5%8f%96%e9%9f%b3%e4%b9%90-url -->
    <!-- <audio ref="audio" autoplay :src="music?.url || ''" @ended="handleMusicEnded"></audio> -->
    <audio ref="audio" autoplay :src="musicSrc" @ended="handleMusicEnded"></audio>

    <!-- 音乐列表抽屉 -->
    <MusicListDrawer></MusicListDrawer>
    <!-- 音乐歌词抽屉 -->
    <!-- <MusicLyrics :drawer="drawer" @closeDrawer="closeDrawer"></MusicLyrics> -->
    <MusicLyrics></MusicLyrics>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useAudioStore } from '@/store/audio';
import { download } from '@/utils/downloadMusic'
import { time } from '@/utils/time'
// 导入音乐列表抽屉组件
import MusicListDrawer from '@/components/MusicListDrawer'
// 导入音乐歌词组件
import MusicLyrics from '@/components/MusicLyrics'
import { ElMessage } from 'element-plus';
import { getMusicLyrics, getMusicComment } from '@/api/audio'
import { random } from '@/utils/toolFunction';
import { userLikeMusic, likeMusicList } from '@/api/user.js'
import { useUserStore } from '@/store/user';
import { musicUrl } from '@/api/audio'


const store = useAudioStore()
const userStore = useUserStore()

// 解决url 403问题（问题出在当你点击一首的时候会把所有的url会获取到，等到要播放的一首歌时，之前获取的url(已过期)(个人猜想)），所以获取最新的音乐url即可
// 只要store中的id变化，就会执行获取最新的url
let musicSrc = ref('')
watch(() => store.id, async () => {
  // 获取音乐url
  const { data } = await musicUrl(store?.id)
  console.log('kkkk')
  // console.log(data.data[0].url, data)
  // 赋值给audio的src上
  musicSrc.value = data.data[0].url
})

// 对当前音乐数据格式化一下（单个音乐）
const music = computed(() => {
  return store.music
})

// 解决bug：歌曲明明是都播放了，但是播放和暂停icon确实，暂停icon，而不是播放icon（有时候有bug，有时候没有bug）
onMounted(() => {
  // 如果音乐播放
  if (audio.value.pause) {
    // console.log('暂停中...')
    store.updataIsPlay(false)
  } else {
    // console.log('播放中...')
    store.updataIsPlay(true)
  }
})

// audio元素
const audio = ref(null)
// 音乐进度条
let musicCurrentTime = ref(0)
// 音乐音量大小（初始化）
let volume = ref(50)
// 音乐的开始时间（这个是要每一秒变化一次）
let startTime = ref(0)
// 音乐的结束时间
let endTime = ref(0)


if (!audio.value?.paused) {
  setInterval(() => {
    // 获取音乐的进度时间
    let currentTime = audio.value?.currentTime

    // 如果开始时间（以秒为单位）和音乐结束时间（一毫秒为单位），所以开始时间要乘以1000
    // 时间一致了，所以播放icon要换成暂停icon
    if (currentTime * 1000 >= music.value?.time) {
      // console.log('时间一致了')
      store.updataIsPlay(false) // 修改音乐是否播放（音乐暂停）
    } else {
      // console.log('时间不一致！！！！！！！')
    }
    // 修改开始时间
    startTime.value = time('start', currentTime)
    // 修改结束时间
    endTime.value = time('end', store.music?.time)
    // 修改音乐进度条（这里的我是试出来的，哈哈，瞎蒙的）---之前我写过进度条所以我知道实现原理，跟这个差不多
    musicCurrentTime.value = parseInt(currentTime / (store.music?.time / 1000) * 100)
  }, 1000)
} else {
  console.log('数据库还没有id！')
}

let timer = null;
// 音乐播放就会修改store中的currentTime音乐的当前时间
const setCurrentTime = () => {
  timer = setInterval(() => {
    store.upDataCurrentTime(audio.value?.currentTime)
  }, 1000)
}

let flag = ref(false)
// 播放或暂停音乐
const play = () => {
  // 当前音乐是否播放
  // 播放
  // if (store.isPlay) {
  //   audio.value.pause()
  //   store.updataIsPlay(false)
  //   clearInterval(timer)
  // } else {
  //   // 如果音乐暂停着（这里是防止如果音乐暂停播放修改icon，要不然我就不写这个if else条件了）
  //   // 判断音乐此时是否暂停并且audio中src为undefined
  //   if (audio.value.paused && !audio.value.src) {
  //     ElMessage.error('当前未找到相应音乐！')
  //   } else {
  //     // 播放
  //     audio.value.play()
  //     store.updataIsPlay(true)
  //     setCurrentTime()
  //   }
  // }
  // 
  if (!store.id) {
    console.log('没有音乐可播放...')
  } else {
    // 如果音乐暂停
    if (audio.value.paused) {
      audio.value.play()
      store.updataIsPlay(true)
    } else {
      audio.value.pause()
      store.updataIsPlay(false)
      clearInterval(timer)
    }
  }
}

// 当前音乐的当前时间处理函数（使用鼠标拖曳时，只在松开鼠标后触发）
const handleMusicCurrentTime = (val) => {
  // val是进度条的的位置的(0~100) / 总时长 再除 100000
  audio.value.currentTime = parseInt((val * (store.music.time / 1000)) / 100) // 因为总长时是（每秒1000毫秒为单位的），再除以100
}

// 播放音乐列表的状态（单曲循环、顺序播放、随机播放）
// 单曲循环：0
// 顺序播放：1
// 随机播放：2
let playMock = computed(() => {
  return store.playMock
})
let updataPlayStatus = () => {
  // 单曲博凡：icon-24gl-repeatOnce2
  // 顺序播放：icon-24gl-repeat2
  // 随机播放：icon-suiji
  // icon图标
  let icon = ''
  if (playMock.value === 0) {
    icon = 'icon-24gl-repeatOnce2'
  } else if (playMock.value === 1) {
    icon = 'icon-24gl-repeat2'
  } else if (playMock.value === 2) {
    icon = 'icon-suiji'
  }
  return icon
}

// 点击播放音乐顺序状态的按钮图标
const handleUpdataPlayMock = () => {
  // console.log(store.playMock)
  store.upDataPlayMock()
  if (playMock.value >= 3) {
    store.upDataPlayMock(0)
  }
  // console.log(playMock.value)  // 这里打印的是音乐播放的模式
}

// 初始化音乐声音
nextTick(() => {
  // silder滑块是1~100,audio音量是0~1，所以这里需要通过拿100来转换以下
  audio.value.volume = 0.5
})
// 监听滑块，对音乐音量大小时时调整
const handleVolume = (val) => {
  let muiscVolume = val / 100
  audio.value.volume = muiscVolume

  // 根据音量大小动态修改音量图标
  handleVolumeIcon()
}

// 音量图标处理函数
let handleVolumeIcon = () => {
  //  静音：icon-shengyinjingyin
  //  低音：icon-soound-min
  //  中音：icon-shengyinkai
  //  高音：icon-sound-max
  let icon = ''

  // 如果音量滑块大于85
  if (volume.value > 80) {
    icon = 'icon-sound-max'
  } else if (volume.value < 80 && volume.value > 25) {
    icon = 'icon-shengyinkai'
  } else if (volume.value < 45 && volume.value > 0) {
    icon = 'icon-soound-min'
  } else if (volume.value <= 0) {
    icon = 'icon-shengyinjingyin'
  }

  return icon
}


// 声音静音和最大切换
const soundMute = () => {
  // 如果声音大于0，说明下次按下按钮要静音，反之
  if (volume.value > 0) {
    // 修改音量滑块的值
    volume.value = 0
    // 修改音乐的音量
    audio.value.volume = 0
  } else {
    volume.value = 100
    audio.value.volume = 1
  }
}

// 音乐列表的抽屉
const musicListDrawer = () => {
  store.updataDrawer(true)
}

// 音乐歌词抽屉
const musicLyrics = async () => {
  store.updataLyrics(store.lyricsDrawer = !store.lyricsDrawer)
}

// const closeDrawer = (data) => {
//   console.log("子组件传过来的值：", data)
//   drawer.value = data
// }

// 只要音乐id变了，音乐也就变了，根据id然后获取相应数据，并且更新当前播放音乐的当前时间
watch(() => store.id, async (newVal, oldVal) => {
  // 获取歌词
  const name = await getMusicLyrics(newVal)
  const commentList = await getMusicComment(newVal, 30)
  store.upDataLyricsStr(name.data.lrc.lyric);
  store.upDataMusicComment(commentList.data.comments);
  setCurrentTime()
})

// 监听store中的index变化（当前播放哪一首音乐）
watch(() => store.index, () => {
  const song = store.musicListInfo.slice(0)[store.index]

  store.updataMusic(song)
})

// 音乐结束函数
const handleMusicEnded = () => {
  setTimeout(() => {
    // 调用自动播放音乐函数
    handleNextMusic()
  }, 0)
}
// 音乐结束后自动播放下一首
const handleNextMusic = () => {
  // 根据音乐播放模式判断
  if (!playMock.value) {    // playMock.value === 0 就可以写成 !playMock.value
    // console.log('单曲播放')
    audio.value.currentTime = 0
    audio.value.play()

  } else if (playMock.value === 1) {  // 顺序播放
    // console.log('顺序播放')
    audio.value.currentTime = 0
    audio.value.play()
    // 修改index，获取index下的音乐列表
    store.upDataIndex(true)

  } else if (playMock.value === 2) {
    // console.log('随机播放')
    // 首先你要满足音乐列表的长度减1大于1
    if ((store.musicListInfo.length - 1) > 1) {
      loopSongs()
    }
  }
}

// 上一曲
const prevSong = () => {
  store.upDataIndex(false)

  loopSongs()
}
// 下一曲
const nextSong = () => {
  store.upDataIndex(true)
  loopSongs()
}
// 循环歌曲（上一曲下一曲）
function loopSongs() {
  if (store.playMock === 2) {
    // 生成一个随机数
    const num = random(0, store.musicListInfo.length - 1)
    store.upDataIndex('random', num)

    // console.log('当前随机值为：', num)
  }
}

// 将喜欢的音乐添加到我的喜欢
const addUserLikeMusic = async () => {
  // 是否登录
  if (userStore.token) {
    // 是否有音乐播放
    if (store.id) {
      // 当前音乐是否喜欢
      if (likeStatus.value) {
        const data = await userLikeMusic(store.id, false)
        console.log(data)
        likeStatus.value = false
        ElMessage.success('以从我的喜欢中移除')
      } else {
        const data = await userLikeMusic(store.id, true)
        console.log(data)
        likeStatus.value = true
        ElMessage.success('已添加到我的喜欢')
      }
    } else {
      ElMessage.error('暂无音乐')
    }
  } else {
    ElMessage.error('请先登录')
  }

}

// 当前歌曲是否喜欢状态
let likeStatus = ref(false)

// 当单曲音乐数据改变时，id跟随一起改变
watch(() => store.music?.id, (newVal, oldVal) => {
  store.getId(newVal)

  updataLikeList()
})

// 只要id改变就会执行一次
const updataLikeList = async () => {
  // 当前音乐是否喜欢（改变icon图标）
  // 获取用户所有喜欢的歌曲id
  const data = await likeMusicList()

  // 找到id和store中的id相比较，如果找到了则返回true(代表这首歌是喜欢)，反之
  likeStatus.value = data.data.ids.some(id => id == store?.id)

  // console.log('当前音乐喜欢状态', likeStatus.value)
}

// 根据是否喜欢状态动态修改icon
const isLikeIcon = computed(() => {
  return likeStatus.value ? 'icon-aixin3' : 'icon-aixin'
})
</script>

<script>
export default {
  name: 'AudioView'
}
</script>

<style lang="scss" scoped>
::v-deep .el-slider {

  // 蓝色进度条线条背景的高度（蓝色进度条的父元素）
  .el-slider__runway {
    height: 5px;
    transition: all .3s linear;

    // 蓝色进度条的样式
    .el-slider__bar {
      height: 100%;
      background-color: red;
    }

    // 小圆圈父亲
    .el-slider__button-wrapper {

      // 小圆圈的样式
      .el-slider__button {
        height: 12px;
        width: 12px;
        background-color: rgb(255, 255, 255);
        border: 1px solid rgb(189, 189, 189);
      }
    }
  }
}

.slider-demo-block {
  width: 100%;
  display: flex;
  align-items: center;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

::v-deep .el-slider__button {
  width: 15px;
  height: 15px;
}

.main {
  display: flex;
  position: absolute;
  z-index: 10;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--bgc);
  color: var(--c);



  // left
  .music-info {
    display: flex;
    align-items: center;

    .music-logo {
      width: 50px;
      height: 50px;
      border-radius: 7px;
      overflow: hidden;
      cursor: pointer;

      img {
        width: 100%;
      }
    }

    .name {
      width: 150px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
      height: 60px;
      margin-left: 15px;

      h1 {
        width: 100%;
        font-size: 20px;
        // （文字长度超出限定宽度，则隐藏超出的内容）
        overflow: hidden;
        // （设置文字在一行显示，不能换行）
        white-space: nowrap;
        // （规定当文本溢出时，显示省略符号来代表被修剪的文本）
        text-overflow: ellipsis;
      }

      p {
        font-size: 13px;
      }
    }

    .download-music {
      // height: 50px;
      // display: flex;
      // align-items: flex-end;

      p {
        color: rgb(0, 0, 0);
        font-size: 20px;
      }
    }
  }

  // center
  .music-control {
    width: 450px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    .control {
      width: 70%;
      height: 50%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 12px;

      .icon-aixin,
      .icon-aixin3 {
        font-size: 24px;
      }

      .icon-aixin3 {
        color: var(--tc);
      }

      p:nth-child(1) {
        font-size: 23px;
        color: #000;
      }

      p:nth-child(2) {
        font-size: 24px;
      }

      p:nth-child(3) {
        font-size: 27px;
      }

      p:nth-child(4) {
        font-size: 18px;
      }

      // p:nth-child(5) {
      //   font-size: 24px;
      // }
    }

    .silder-container {
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;

      p:first-child {
        width: 73px;
        text-align: center;
        color: #8b8b8b;
      }

      p:last-child {
        width: 82px;
        margin-left: 15px;
        color: #8b8b8b;
      }
    }
  }

  // right
  .music-list {
    width: 130px;

    .volume {
      display: flex;
      align-items: center;

      p:first-child {
        font-size: 23px;
      }

      p:last-child {
        margin-left: 10px;
        font-size: 25px;
      }
    }

    .copyright {
      font-size: 10px;
    }
  }
}
</style>