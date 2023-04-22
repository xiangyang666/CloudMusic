<template>
  <div class="main">
    <!-- 视频详情 -->
    <div class="video-detail">
      <h1 class="title">{{ mv.data.videoName }}</h1>
      <div class="playInfo">
        <div class="play-count"><span class="iconfont icon-video"></span>{{ handleNum(mv.data.durationms) }}播放</div>
        <div class="comment"><span class="iconfont icon-wenben"></span>{{ mv.data.commentCount }}评论</div>
        <div class="create-time"><span class="iconfont icon-shijian-xianxing"></span>{{ mv.data.publishTime }}</div>
        <div class="ban">
          <span class="iconfont icon-jinzhi"></span>
          <p class="ban-text">未经作者授权，禁止转载</p>
        </div>
      </div>
      <div class="video-container">
        <video autoplay :src="mv.data.url" controls></video>
      </div>
      <div class="video-logo">
        <img width="70" height="70" :src="mv.data.userLogo" alt="">
        <p>{{ mv.data.userName }}</p>
      </div>
      <div class="click-love">
        <el-button type="danger" round size="large">
          <span class="iconfont icon-dianzan"></span>
          <span>赞</span>
        </el-button>
        <el-button type="warning" round size="large">
          <span class="iconfont icon-shoucang"></span>
          <span>收藏</span>
        </el-button>
        <el-button type="primary" round size="large">
          <span class="iconfont icon-zhuanfa"></span>
          <span>分享</span>
        </el-button>
      </div>
      <!-- 评论 -->
      <h1 class="comment-text">评论（{{ mv.data.commentCount }}）</h1>
      <div class="comment-container">
        <textarea placeholder="发一条友善的评论"></textarea>
        <el-button type="primary">发布</el-button>
        <p class="limit">0/140</p>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs tabs" @tab-click="handleClick">
        <el-tab-pane label="热门评论" name="1">
          <CommentList v-if="commentList.hotComments" :commentList="commentList.hotComments" />
          <div v-else>
            <NoData />
          </div>
        </el-tab-pane>
        <el-tab-pane label="最新评论" name="2">
          <CommentList :commentList="commentList.comments" />
          <el-pagination hide-on-single-page @prev-click="prevClick" @next-click="nextClick"
            @current-change="currentChange" background layout="prev, pager, next" :total="mv.data.commentCount"
            :page-size="30" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 视频的相关推荐 -->
    <div class="recommend">
      <h1 class="about">相关推荐</h1>
      <ul>
        <li @click="handleAboutVideo(item.id)" class="about-item" v-for="(item, index) in aboutVideo.data" :key="index">
          <!-- 视频 -->
          <div class="left">
            <img :src="item.cover">
            <p class="about-time">{{ item.duration }}</p>
            <p class="about-play-count">{{ item.playCount }}</p>
          </div>
          <!-- 视频信息 -->
          <div class="right">
            <p class="title">{{ item.name }}</p>
            <p class="auther-name">{{ item.artistName }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<!-- 分页器 
  total：总共多少条
  page-size：每页显示多少条
-->
<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { videoDetail, videoUrl, aboutAllVideo, videoComment, mvDetailData, mvUrl, similarMv, mvInfo, mvComment } from '@/api/video'
import CommentList from '@/components/CommentList'
import NoData from '@/components/NoData'
import { handleNum } from '@/utils/toolFunction';

const route = useRoute()
const router = useRouter()

const activeName = ref('1')

// 路由传递过来的视频id
const id = route.params.id

// 存储mv相关数据
const mv = reactive({
  data: {}
})
// 视频的相关视频数据
const aboutVideo = reactive({
  data: {}
})
// 评论
const commentList = reactive({
  // 热门评论
  hotComments: [],
  // 最新评论
  comments: [],
  // 评论总数
  commentCount: 0
})
watch(route, async () => {
  // mv
  mvApp()
  // 评论
  comment(1, 30)
}, {
  immediate: true,
  deep: true
})
// 获取视频数据处理函数
async function mvApp() {
  // 视频页详情
  const { data } = await mvDetailData(route.params.id)
  // 视频url
  const res = await mvUrl(route.params.id)
  // 视频的相关视频
  const aboutAllVideoList = await similarMv(route.params.id)
  // 获取 mv 点赞转发评论数数据
  const mvDataInfo = await mvInfo(route.params.id)

  let mvData = {
    // 作者id
    userId: data.data.artists[0].id,
    // 作者名字
    userName: data.data.artists[0].name,
    // 作者logo
    userLogo: data.data.artists[0].img1v1Url,
    // 视频标题
    videoName: data.data.name,
    // 视频url地址
    url: res.data.data.url,
    // 视频描述
    description: data.data.description,
    // 评论数量
    commentCount: mvDataInfo.data.commentCount,
    // 播放时长
    playTime: data.data.playCount,
    // 播放次数
    durationms: data.data.duration,
    // 点赞次数
    praisedCount: data.data.praisedCount,
    // 分享次数
    shareCount: data.data.shareCount,
    // 订阅次数
    subscribeCount: data.data.subCount,
    // 发布时间
    publishTime: data.data.publishTime,
    // 喜欢（这个mv）个数
    likedCount: mvDataInfo.data.likedCount,
    // 是否喜欢这款mv
    liked: mvDataInfo.data.liked,
    // 评论者的ip属地
    ip: '未知'
  }
  mv.data = mvData
  aboutVideo.data = aboutAllVideoList.data.mvs
}
// 获取评论
async function comment(pageNumber, limit = 30) {
  const { data } = await mvComment(route.params.id, limit, (pageNumber - 1) * limit)
  commentList.hotComments = data.hotComments
  commentList.comments = data.comments
  total.value = data.total
}

// 点击相关视频跳转
const handleAboutVideo = (id) => {
  router.push({
    name: 'mvdetail',
    params: {
      id
    }
  })
}

// 评论区tabs
const handleClick = () => {

}


// 分页器功能（这三个方法其实可以写成一个，这里方便理解我写了一个）
// 总条数
let total = ref(0)
// 上一页
const prevClick = async (pageNumber) => {
  comment(pageNumber)
}
// 下一页
const nextClick = (pageNumber) => {
  comment(pageNumber)
}
// 当前第几页
const currentChange = (pageNumber) => {
  comment(pageNumber)
}
</script>
<script>
export default {
  name: 'MvDetail'
}
</script>
<style lang="scss" scoped>
.main {
  max-width: 1469px;
  height: auto;
  display: flex;
  margin: 0 auto;

  .video-detail {
    width: 70%;
    // height: 2000px;
    padding-right: 30px;
    margin-bottom: 50px;

    .title {
      color: var(--c);
      font-size: 26px;
      font-weight: 900;
    }

    .playInfo {
      height: 30px;
      line-height: 30px;
      display: flex;
      color: var(--c);
      margin: 10px 0;

      div {
        margin-right: 15px;

        span {
          margin-right: 3px;
        }
      }

      .ban {
        display: flex;

        span {
          color: var(--tc);
        }
      }
    }

    .video-container {
      flex: 1;
      height: 460px;
      background-color: #000000;

      video {
        width: 100%;
        height: 100%;
      }
    }

    .video-logo {
      display: flex;
      align-items: center;
      margin-top: 10px;

      img {
        border-radius: 100%;
        margin: 5px;
      }

      p {
        color: var(--c);
        font-size: 20px;
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
      }
    }

    .click-love {
      margin-top: 15px;
      margin-left: 10px;

      .el-button {
        height: 30px;
        margin-right: 20px;
      }
    }

    // 评论
    .comment-text {
      font-size: 30px;
      color: var(--c);
      margin: 20px 0;
    }

    .comment-container {
      width: 100%;
      height: 100px;
      border: 1px solid var(--c-border);
      border-radius: 5px;
      display: flex;
      position: relative;
      overflow: hidden;


      textarea {
        width: 100%;
        height: 100%;
        resize: none;
        outline: none;
        border: none;
        font-size: 20px;
        padding: 5px;
        background-color: var(--c-bgc);
        color: var(--c-text);
      }

      textarea::-webkit-input-placeholder {
        color: var(--c-ph);
      }

      .el-button {
        width: 100px;
        height: 100px;
      }

      .limit {
        position: absolute;
        bottom: 3px;
        right: 110px;
        color: var(--c-c);
        font-family: '';
      }
    }

    .tabs {
      margin-top: 30px;
    }
  }

  // 推荐
  .recommend {
    flex: 1;
    // height: 2000px;

    .about {
      font-size: 27px;
      color: var(--c);
      // margin-bottom: 45px;
      margin-top: 25px;
      margin-bottom: 20px;
    }

    ul {
      width: 100%;

      .about-item {
        width: 100%;
        // height: 115px;
        display: flex;
        margin-bottom: 20px;
        cursor: pointer;

        &:hover {
          background-color: var(--table-color);
        }

        .left {
          width: 100%;
          position: relative;
          border-radius: 15px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }

          p {
            color: var(--about-color);
            background-color: var(--about-videotime);
          }

          .about-time {
            position: absolute;
            bottom: 0;
            right: 0;
          }

          .about-play-count {
            position: absolute;
            top: 0;
            right: 0;
          }

        }

        .right {
          width: 70%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          margin-left: 5px;

          p {
            margin-top: 30px;
            color: var(--c);
          }

          .title {
            font-size: 18px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: 900;
          }

          .auther-name {
            width: 110px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

  }
}
</style>
