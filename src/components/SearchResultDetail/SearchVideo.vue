<template>
  <div class="main">
    <h1 class="title">共找到 <span class="total">{{ videoList.data.videoCount || 0 }}</span> 视频</h1>
    <div class="video_list">
      <!-- 每一个item video -->
      <div @click="handleVideoDetail(item.vid)" class="item" v-for="(item, index) in videoList.data.videos" :key="index">
        <div class="img_box">
          <img width="250" :src="item.coverUrl" :alt="item.coverUrl">
          <div class="playCount"><span class="iconfont icon-video"></span>{{ item.durationms }}</div>
          <div class="playTime"><span class="iconfont icon-shijian-xianxing"></span>{{ item.playTime }}</div>
        </div>
        <div class="video_title">{{ item.title }}</div>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination hide-on-single-page @current-change="currentChange" @prev-click="currentChange"
        @next-click="currentChange" :page-size="20" background layout="prev, pager, next" :total="totalCount" />
    </div>
  </div>
  <!-- 无数据 -->
  <NoData :text='text' v-if="JSON.stringify(videoList.data) == '{}'" />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useSearchStore } from '@/store/search';
import { keywordsSearch } from '@/api/search';
import { useRouter } from 'vue-router';
import NoData from '@/components/NoData'

// 无找到该歌手NoData text数据
const text = computed(() => {
  return `很抱歉，未能找到 ${store.keyword} 相关的视频`
})

const store = useSearchStore()
const router = useRouter()

const videoList = reactive({
  data: []
})

onMounted(() => {
  app(0)
})

const app = async (offset) => {
  const { keyword, getDataCount } = store
  const { data } = await keywordsSearch(keyword, getDataCount, offset, 1014)

  videoList.data = data.result
}

// 视频详情页处理函数
const handleVideoDetail = (vid) => {
  // console.log(vid, '李佳怡')
  // 如果 vid 是不是数字id则是视频，否则为mv

  // 示例：
  // id: 10934329（mv）
  // 加密代码：8A238E6619B1A9E67B07BB5A2C84B927（video）

  router.push({
    // 判断跳转到哪个组件，如果 vid为数字（代表需要跳转到mv，如果接受的是一串加密的字符串，则说明是需要跳转到视频组件）
    name: isNaN(vid) ? 'videodetail' : 'mvdetail',
    params: {
      id: vid
    }
  })
}

function currentChange(num) {
  app((num - 1) * store.getDataCount)
}

// 数据总条数
const totalCount = computed(() => {
  // 当0的时候分页器不显示
  return Number(videoList.data?.videoCount) || 0
})

</script>
<script>
export default {
  name: ''
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;

  .title {
    font-size: 30px;
    color: var(--c);

    .total {
      color: var(--tc);
    }
  }

  .video_list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;

    .item {
      width: 18.4%;
      margin: 0 1% 40px .6%;
      cursor: pointer;


      .img_box {
        width: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 10px;

        .playCount,
        .playTime {
          position: absolute;
          right: 3px;
          color: #fff;
        }

        .playCount {
          top: 3px;
        }

        .playTime {
          bottom: 3px;
        }

        img {
          width: 100%;
          object-fit: cover;
          transition: all .4s;
        }
      }

      .video_title {
        color: var(--c);
        margin-top: 10px;
      }

      &:hover {
        .video_title {
          color: var(--tc);
          transition: all .3s;
        }

        .img_box {
          img {
            transform: scale(1.2);
          }
        }
      }
    }
  }

  .pagination {
    margin-bottom: 100px;
  }
}

@media only screen and (max-width: 1480px) {
  .main {
    .video_list {

      .item {
        width: 23.4%;

      }
    }
  }

}
</style>
