<template>
  <div class="main">
    <div class="video-container">
      <ul :v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-immediate="false">
        <li @click="mvDetailPage(item.id)" v-for="(item, index) in mvList.data" :key="index">
          <div class="video-box">
            <img :src="item.imgurl">
            <p class="mv-publishTime">2022-09-09</p>
            <p class="play-volume">{{ item.playCount }}</p>
            <p class="play-time">{{ item.duration }}</p>
          </div>
          <div class="mv-name">{{ item.name }}</div>
        </li>
        <p v-if="loading">Loading...</p>
      </ul>
    </div>
  </div>
</template>

<!-- 该组件运用了无限滚动组件，加载更多数据 -->
<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { singerMv } from '@/api/singer'

const route = useRoute()
const router = useRouter()

// 加载信息
const loading = ref(false)
// 是否显示
const disabled = computed(() => loading.value)
const load = async () => {
  console.log('加载数据')
  // 调用获取歌手mv数据
  app(route.params.id)
}

// 歌手mv数据
const mvList = reactive({
  data: []
})

onMounted(async () => {
  const { data } = await singerMv(route.params.id, dataNumber.value)
  mvList.data.push(...data.mvs)
})

let flag = true
// 获取多少条数据（初次为20条）
let dataNumber = ref(20)
// 封装获取歌手mv数据
async function app(id) {
  // 每次增加20
  dataNumber.value += 20;

  const { data } = await singerMv(id, dataNumber.value)
  // 如果hasMore为false代表没有数据了
  if (!data.hasMore) {
    // console.log('没有数据了')
  } else {
    // 获取到数据后赋值给mvList
    mvList.data.push(...data.mvs)
  }

  // console.log(data.hasMore, 'jjjjjjjj')
}

// 去mv详情页面
const mvDetailPage = (id) => {
  console.log(id)

  router.push({
    name: 'mvdetail',
    params: {
      id
    }
  })
}

</script>
<script>
export default {
  name: 'SingerMv'
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin-bottom: 30px;

  .video-container {
    width: 100%;

    ul {
      // height: 200px;
      // min-height: 50vh;
      width: 100%;
      overflow-y: scroll;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 21%;
        margin: 0 2% 30px 2%;

        .mv-name {
          color: var(--c);
          font-size: 20px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .video-box {
          min-height: 107px;
          height: 9.28vw;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          cursor: pointer;


          &:hover {
            img {
              transform: scale(1.3);
            }
          }

          img {
            width: 18.3vw;
            min-width: 210px;
            object-fit: cover;
            transition: transform .4s;
            border-radius: 20px;
          }

          p {
            color: #fff;
            position: absolute;
          }

          .play-volume {

            right: 10px;
            top: 5px
          }

          .play-time {

            bottom: 5px;
            right: 10px;
          }

          .mv-publishTime {

            left: 2px;
            bottom: 5px;
          }
        }
      }
    }


  }
}

.infinite-list-wrapper {
  height: 300px;
  text-align: center;
}

.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.infinite-list-wrapper .list-item+.list-item {
  margin-top: 10px;
}
</style>