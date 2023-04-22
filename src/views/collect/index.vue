<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="歌手" name="1">
      <div v-if="activeName == '1'">
        <h1>收藏的歌手（{{ singerList.data.count }}）</h1>
        <TemplateCode type="singerdetail" :list="singerList.data.data" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="视频" name="2">
      <h1>收藏的视频和MV（{{ videoList.data.count }}）</h1>
      <div v-if="activeName == '2'">
        <div class="videoList" element-loading-text="Loading...">
          <ul>
            <li @click="mvPlay(item.vid)" v-for="(item, index) in videoList.data.data" :key="index">
              <div class="videoBox">
                <!-- 视频展示图片 -->
                <img class="videoImg" :src="item.coverUrl">
                <!-- 播放图标 -->
                <div class="play">
                  <span class="iconfont icon-bofang"></span>
                </div>
                <!-- 播放次数 -->
                <div class="playTime">
                  <p class="iconfont icon-video" style="margin-right:2px;"></p>
                  <p>{{ item.playTime }}</p>
                </div>
                <!-- 评论个数 -->
                <!-- <div class="commentCount">
                  <p class="iconfont icon-xinxi"></p>
                  <p>{{ item.playCount }}</p>
                </div> -->
                <!-- 播放时长 -->
                <div class="durationms">{{ item.durationms }}</div>
              </div>
              <p class="videoTitle">{{ item.name }}</p>
              <p class="videoAuthor">{{ item.name }}</p>
            </li>
          </ul>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="专辑" name="3">
      <div v-if="activeName == '3'">
        <h1>收藏的专辑（{{ albumList.data.count }}）</h1>
        <TemplateCode type="album" :list="albumList.data.data" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { collectSingerList, collectVideoList, collectAlbumList } from '@/api/collect'
import TemplateCode from '@/components/SearchResultDetail/TemplateCode.vue';
import { useRouter } from 'vue-router';

// 当前哪一项tab栏高亮
const activeName = ref('1')
const router = useRouter()

// 收藏歌手列表数据
const singerList = reactive({
  data: {}
})
// 收藏视频列表数据
const videoList = reactive({
  data: {}
})
// 收藏专辑列表数据
const albumList = reactive({
  data: {}
})

// 因为打开收藏页面的时候，默认是歌手
onMounted(async () => {
  handleSinger()
})

const handleClick = ({ paneName }) => {
  if (paneName == '1') {
    // handleSinger()
  } else if (paneName == '2') {
    handleVideo()
  } else if (paneName == '3') {
    handleAlbum()
  }
}

// 歌手处理函数
async function handleSinger() {
  const { data } = await collectSingerList()
  // console.log(data)
  singerList.data = data
}


// 视频处理函数
async function handleVideo() {
  const { data } = await collectVideoList()
  // console.log(data)
  videoList.data = data
}
const mvPlay = (id) => {
  // id为字符串代表需要跳转到videodetail组件，如果为数字则需要跳转到mvdetail
  // 用isNaN判断
  // 示例：isNaN('李佳怡') // 返回true      isNaN(520) // false
  router.push({
    name: isNaN(id) ? 'videodetail' : 'mvdetail',
    params: {
      id
    }
  })
}


// 专辑处理函数
async function handleAlbum() {
  const { data } = await collectAlbumList()

  // console.log(data)
  albumList.data = data
}

</script>

<style lang="scss" scoped>
.videoList {
  width: 100%;
  // border: 1px solid red;
  margin-top: 50px;

  ul {
    height: auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;

    li {
      max-width: 270px;
      width: 20vw;
      // height: 200px;
      color: var(--c);
      margin: 0 1% 20px;

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
            transform: scale(1.3);
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
</style>