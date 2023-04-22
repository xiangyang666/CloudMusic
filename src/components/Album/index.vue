<template>
  <div class="main">
    <!-- 专辑信息 -->
    <div class="albumInfo">
      <div class="left">
        <img :src="albumData.data.album?.picUrl" alt="">
      </div>
      <div class="right">
        <div class="box">
          <div class="name">
            <el-tag size="large" type="danger">专辑</el-tag>
            <h1>{{ albumData.data.album?.name }}</h1>
          </div>
          <div>
            <el-button type="danger" @click="playMusicDetailList($event, albumData.data.songs)">播放全部</el-button>
            <el-button>收藏</el-button>
            <el-button>分享</el-button>
          </div>
          <div>歌手：{{ albumData.data.album?.artist.name }}</div>
          <div>时间：{{ albumData.data.album?.publishTime }}</div>
        </div>
      </div>
    </div>
    <!-- tabs栏效果 -->
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="歌曲列表" name="1">
        <MusicList :musicApp="albumData.data.songs" :musicList="albumData.data.songs" />
      </el-tab-pane>
      <el-tab-pane label="评论" name="2">
        <div class="comment-container">
          <h1 style="font-size:30px;color:var(--c);margin-top:10px;">热门评论</h1>
          <commentList :commentList="commentsList.data" />
          <el-pagination @prev-click="nextClick" @next-click="nextClick" @current-change="nextClick" background
            layout="prev, pager, next" :total="commentsList.data.length" :page-size="30" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="专辑详情" name="3">
        <div class="desc" v-if="albumData.data.album?.description">
          <div class="text">{{ albumData.data.album?.description }}</div>
        </div>
        <NoData v-else />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { getAlbumData } from '@/api/singer'
import { albumComment } from '@/api/singer'
import MusicList from '@/components/MusicList'
import commentList from '@/components/CommentList'
import NoData from '@/components/NoData'
import playMusicDetailList from '@/hooks/playMusicDetailList';

const route = useRoute()
// 当前tab栏选中状态
const activeName = ref('1')

// 专辑内容数据
const albumData = reactive({
  data: {}
})
// 歌单评论区数据
const commentsList = reactive({
  data: []
})
onMounted(async () => {
  // 获取专辑内容
  const { data } = await getAlbumData(route.params.id)
  albumData.data = data

  // 调用获取歌单评论方法
  getComment(route.params.id) // 首次加载数据，后面两个参数可是使用默认值（一共3个参数）
})
// 封装获取歌曲评论函数
async function getComment(id, limit, offset) {
  // 获取歌单评论
  const comments = await albumComment(id, limit, offset)

  commentsList.data = comments.data.comments
  commentsList.total = comments.data.total
}


// 下一页上一页当前页（获取评论）
const nextClick = (pageNumber) => {
  // 当前点击的页码（pageNumber）
  getComment(route.params.id, 50, (pageNumber - 1) * 50)  // offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
}
</script>
<script>
export default {
  name: 'Album'
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  margin-bottom: 30px;

  .albumInfo {
    display: flex;
    color: var(--c);

    .left {
      width: 200px;
      height: 200px;
      border-radius: 20px;
      overflow: hidden;
      margin-right: 20px;
      cursor: pointer;

      img {
        width: 100%;
        transition: all .5s;
      }

      &:hover {
        img {
          transform: scale(1.2) translate(-20px, -10px);
        }
      }
    }

    .right {
      .box {

        .name {
          align-items: center;

          h1 {
            margin-left: 10px;
          }
        }

        div {
          display: flex;
          margin-top: 15px;
        }
      }
    }
  }

  .comment-container {
    margin-bottom: 70px;
  }

  .desc {

    .text {
      line-height: 40px;
      font-size: 20px;
      color: var(--c);

      &::first-letter {
        color: var(--tc);
        font-size: 50px;
        font-weight: 900;
      }
    }
  }
}

.demo-tabs {
  margin-top: 30px;
}
</style>
