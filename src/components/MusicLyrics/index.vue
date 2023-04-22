<template>
  <div>
    <el-drawer size="100%" :z-index="1" v-model="audioStore.lyricsDrawer" :direction="direction" :with-header="false"
      class="mask">
      <!-- 组件的背景图片（进行了模糊处理） -->
      <div class="background" :style="{ backgroundImage: 'url(' + background + ')' }"></div>
      <!-- 关闭抽屉图标 -->
      <div @click="handleClose" class="close-drawer">
        <i class="iconfont icon-xiajiantou"></i>
      </div>
      <!-- 容器 -->
      <div v-if="audioStore.id" class="container">
        <div class="box">
          <!-- 歌词 -->
          <div class="lyrics">
            <div class="player">
              <div :class="audioStore.isPlay ? 'needle-animation' : 'needle2-animation'" class="needle">
                <img src="./image/needle-ab.png" alt="">
              </div>
              <div :class="audioStore.isPlay ? 'cd-animation' : 'cd-animation2'" class="box01">
                <img class="cd" src="http://www.codeman.ink/img/disc.a42bb8f4.png" alt="">
                <img class="bg" :src="audioStore.music.logo" alt="">
              </div>
            </div>
            <div class="musicLyrics">
              <div class="musicName">
                <h1>{{ audioStore.music.musicName }}</h1>
                <p>{{ audioStore.music.musicSinger }}</p>
              </div>
              <div class="lyricsList">
                <p :class="{ lyricPlay: (audioStore.currentTime * 1000) > item.time && (audioStore.currentTime * 1000) < item.nextTime }"
                  v-for="(item, index) in lyrics">{{ item.lyr }}</p>
              </div>
            </div>
          </div>
          <!-- 评论 -->
          <div class="comment">
            <h1>热门评论</h1>
            <commentList :commentList="comment"></commentList>
            <!-- <div class="commentList" v-for="(item, index) in comment" :key="index">
                                            <div class="left">
                                              <img
                                                :src="item.user.avatarUrl ? item.user.avatarUrl : 'http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg?param=200y200'"
                                                alt="">
                                            </div>
                                            <div class="right">
                                              <div class="text">
                                                <span class="name">{{ item.user.nickname }}：</span>
                                                <span class="content">{{ item.content }}</span>
                                              </div>
                                              <div class="bottom">
                                                <div class="time"> {{ item.time }} </div>
                                                <div class="handle">
                                                  <div>1</div>
                                                  <div>2</div>
                                                  <div>3</div>
                                                </div>
                                              </div>
                                            </div>
                                          </div> -->
          </div>
          <div class="comment-pagination">
            <el-pagination @current-change="currentChange" @prev-click="prevClick" @next-click="nextClick"
              :page-count="audioStore.lyricsData.commentList.length - 1" background layout="prev, pager, next"
              :total="audioStore.lyricsData.commentList.length - 1" class="mt-4" />
          </div>
        </div>
      </div>
      <div v-else class="noData">
        <h1>暂无播放音乐</h1>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { useAudioStore } from '@/store/audio';
import BackTop from '@/components/BackTop'
// import { musicLyrics } from '@/api/audio'
import bg from './image/defaultBackground.png'
import commentList from '@/components/CommentList'
import { getMusicComment } from '@/api/audio'
import { useUserStore } from '@/store/user';

const audioStore = useAudioStore()
const userStore = useUserStore()

// 抽屉方向
const direction = ref('btt')

// 关闭抽屉
const handleClose = () => {
  audioStore.updataLyrics(false)
}

// 歌曲歌词
const lyrics = computed(() => {
  // 初始化歌词列表
  let lyricList = []
  lyricList = audioStore.lyricsData.str.split(/[\r\n]/).map((item, index) => {

    // 每个数组都是  [ [00:00.000] 作词 : 张希/曹方 ]，下面进行拆分
    // 分钟
    let minute = item.slice(1, 3)
    // 秒钟
    let second = item.slice(4, 6)
    // 毫秒
    let millisecond = item.slice(7, 10)
    // 歌词
    let lyric = item.slice(11)
    // 当前播放音乐的时间
    let time = parseInt(minute * 60 * 1000) + parseInt(second * 1000) + parseInt(millisecond)

    // 这里需要判断一下
    if (isNaN(Number(millisecond))) {
      millisecond = item.slice(7, 9)
      lyric = item.slice(10)
    }

    return {
      min: minute,
      sec: second,
      mill: millisecond,
      lyr: lyric,
      time
    }
  })

  lyricList.forEach((item, index, array) => {
    if (index === array.length - 1) {
      item.nextTime = 0
    } else {
      item.nextTime = lyricList[index + 1].time
    }
  })


  return lyricList
})

// 歌曲评论
const comment = computed(() => {
  return audioStore.lyricsData.commentList
})

// 处理歌词
// function format(lyricsStr) {
//   // 可以看一下network观察歌词数据是一个大字符串，进行匹配
//   const reg = /\[.+?\]/g
//   const timeArr = lyricsStr.match(reg)

//   console.log(timeArr)

// }

onMounted(() => {
  // console.log(audioStore.lyricsData.str)
  // 只要音乐的currentTime一改变，就会执行里面代码，永远保持高亮歌词在最中间
})
watch(() => audioStore.currentTime, (newVal, oldVal) => {
  // 歌词带有样式的那一个
  let p = document.querySelector('.lyricsList .lyricPlay')

  // 外面这一层if语句（不加这层判断的话会报错）的意思是：因为首次页面加载时该组件是隐藏状态，不能获取到歌词容器和带有样式那个歌词p标签，所以只要歌词组件抽屉打开（页面就会显示，就能安全的获取到元素）
  // 控制要报错信息：Uncaught (in promise) TypeError: Cannot set properties of null (setting 'scrollTop')
  if (audioStore.lyricsDrawer) {
    // console.log('进入了歌词抽屉组件')
    // 如果带有样式的那个p标签offsetTop值大于300，父元素lyricsList的滚动条距离top为带有样式的那个p标签offsetTop - 300
    if (p?.offsetTop >= 270) {
      document.querySelector('.lyricsList').scrollTop = p?.offsetTop - 260
    } else {
      document.querySelector('.lyricsList').scrollTop = 0
    }
  } else {
    // console.log('还没有进入歌词抽屉组件')
  }
})



// 歌词背景图图片
const background = computed(() => {
  if (audioStore.id) {
    return audioStore.music.logo
  }
  return bg
})

// 传入对应页数获取数据
const getComment = async (num) => {
  // 歌曲id
  const id = audioStore.id
  // 每页多少条数据
  const limit = 30
  // 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
  const offset = (num - 1) * limit

  const { data } = await getMusicComment(id, limit, offset)

  audioStore.upDataMusicComment(data.comments)
}

// 分页器
// 上一页
const prevClick = async (num) => {
  getComment(num)
}
// 下一页
const nextClick = (num) => {
  getComment(num)
}
// 当前数字页
const currentChange = (num) => {
  getComment(num)
}



</script>
<script>
export default {
  name: 'MusicLyrics'
}
</script>
<style lang="scss" scoped>
// 遮罩层的样式
::v-deep .mask {
  background-color: #e9e9e9;
  position: relative;

  // .el-drawer__body {
  //   margin-bottom: 80px;
  // }
}

.background {
  width: 100%;
  height: 100%;
  // background-image: linear-gradient(red, #fff);

  background-size: cover;
  filter: blur(300px);
  position: absolute;
  // z-index: 10;
}

.close-drawer {
  height: 30px;
  width: 30px;
  position: fixed;
  top: 25px;
  left: 45px;
  z-index: 99999;
  transition: all .3s ease;

  i {
    font-size: 30px;
    color: #848181;
  }

  &:hover {
    transform: scale(1.5);


    i {
      color: #000;
    }
  }
}

.container {
  width: 100%;
  height: auto;
  margin: 0 auto;
  position: relative;
  z-index: 10;

  .box {
    width: 1080px;
    height: 100%;
    margin: 0 auto;
    padding-bottom: 100px;

    // 歌词容器
    .lyrics {
      width: 100%;
      height: 500px;
      display: flex;

      .player {
        width: 50%;
        position: relative;

        .needle {
          width: 150px;
          height: auto;
          position: absolute;
          top: 80px;
          right: 70px;
          z-index: 100;
          transform: rotate(0deg);
          transform-origin: left top;

          img {
            width: 100%;
          }
        }

        // 光盘盒子
        .box01 {
          width: 300px;
          height: 300px;
          position: absolute;
          top: 140px;
          right: 60px;
          border-radius: 100%;
          overflow: hidden;

          .cd {
            width: 100%;
            position: absolute;
            z-index: 10;
          }

          .bg {
            width: 203px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;

          }


        }
      }

      .musicLyrics {
        width: 40%;
        display: flex;
        text-align: center;
        flex-direction: column;


        .musicName {
          height: auto;
          padding: 20px 0;

          h1 {
            font-size: 30px;

          }

          p {
            margin-top: 10px;
            color: #000;
          }
        }

        .lyricsList {
          height: 100%;
          width: 100%;
          transition: all .7s;
          cursor: pointer;
          overflow-y: scroll;

          p {
            width: 80%;
            margin-top: 30px;
            transition: all .5s ease;
            font-family: 'myfont';
            color: #000000;
            padding-left: 20%;
          }

          // 当前播放音乐的那一句的样式
          .lyricPlay {
            width: 100%;
            padding-left: 0;
            color: rgb(248, 77, 77);
            font-size: 30px;
            font-weight: 700;
          }
        }

        // 隐藏某个元素的滚动条但是内容依旧可以滚动
        .lyricsList::-webkit-scrollbar {
          width: 0 !important;
        }
      }
    }

    // 评论
    .comment {
      width: 100%;

      .commentList {
        height: 50px;
        width: 100%;
        display: flex;
        padding: 0px 30px;
        margin-top: 60px;

        .left {
          width: 50px;
          height: 50px;

          img {
            width: 100%;
            border-radius: 100%;
          }
        }

        .right {
          display: flex;
          height: 50px;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          padding: 0px 10px;

          .text {
            display: flex;
            height: 100px;
            margin-bottom: 25px;

            .name {
              color: #087cd8;
              font-family: 'myfont';
              font-weight: 900;
            }

            .content {
              width: 80%;
              line-height: 20px;
            }


          }

          .bottom {
            display: flex;
            justify-content: space-between;

            .handle {
              display: flex;
            }
          }
        }
      }
    }

  }


}

// 没有数据时展示
.noData {
  h1 {
    font-size: 50px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
