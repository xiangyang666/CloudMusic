<template>
  <div class="main">
    <h1 class="title">官方榜</h1>
    <!-- 官方榜 -->
    <div class="rank" v-for="(item, index) in theList.data.slice(0, 4)" :key="index">
      <!-- 左 -->
      <div class="left">
        <img :src="item.coverImgUrl">
      </div>
      <!-- 右 -->
      <div class="right">
        <ul v-loading="loading" element-loading-text="loading...">
          <li @click="getMore(item.id)" v-for="(item2, index2) in musicList.data[index]?.tracks.slice(0, count + 1)"
            :key="index2">
            <div class="singerName">
              <p>{{ index2 + 1 }}</p>
              <p>{{ item2.name }}</p>
            </div>
            <div class="name">{{ item2.ar[0].name }}</div>
          </li>
        </ul>
        <p @click="getMore(item.id)" class="get-more">查看全部></p>
      </div>
    </div>
    <!-- 全球榜 -->
    <h1 class="title">全球榜</h1>
    <div class="world">
      <ul>
        <li @click="getMore(item.id)" v-for="(item, index) in theList.data.slice(4)" :key="index">
          <div class="cover-img">
            <img :src="item.coverImgUrl" alt="">
          </div>
          <h1>{{ item.name }}</h1>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { allTheList } from '@/api/rankList'
import { getAlbumData } from '@/api/singer'
import { musicDetail } from '@/api/home'
import { useRouter } from 'vue-router';

const router = useRouter()

const loading = ref(true)

// 所有榜单数据
const theList = reactive({
  data: []
})
// 榜单里的歌单列表
const musicList = reactive({
  data: []
})
// 拿到前几个榜单数据
const count = ref(4)
onMounted(async () => {
  // 获取所有的官方榜单
  const { data } = await allTheList()
  theList.data = data.list

  for (let i = 0; i < count.value; i++) {
    const result = await musicDetail(data.list[i].id)
    musicList.data.push(result.data.playlist)
  }

  loading.value = false
})

// 加载更多
const getMore = async (id) => {
  router.push({
    name: 'musicDetail',
    params: {
      id
    }
  })
}
</script>

<script>
export default {
  name: ''
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  // max-width: 1280px;
  margin: 0 auto;

  .rank {
    width: 100%;
    display: flex;
    margin-bottom: 70px;

    .left {
      width: 250px;
      overflow: hidden;

      img {
        width: 100%;
        border-radius: 10px;
      }
    }

    .right {
      width: 100%;
      margin-left: 15px;

      ul {
        width: 100%;

        li {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 10px;
          color: var(--c);
          cursor: pointer;

          .singerName {
            display: flex;

            p:first-child {}

            p:last-child {}
          }

          &:nth-child(odd) {
            background-color: var(--album-tabel-color);
          }

          &:hover {
            background-color: var(--album-hover-color) !important;
          }
        }
      }

      .get-more {

        color: rgb(170, 169, 169);
        cursor: pointer;
        margin-top: 5px;

        &:hover {
          color: var(--tc);
        }
      }
    }
  }

  .world {
    width: 100%;

    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 18%;
        margin: 20px 1%;
        cursor: pointer;

        .cover-img {
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 7px;

          // width: 100%;
          img {
            width: 100%;
          }
        }

        &:hover {
          h1 {
            color: var(--tc);
          }
        }

        h1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          color: var(--c);
        }
      }
    }
  }

  .title {
    font-size: 30px;
    color: var(--c);
    font-family: '';
    margin-bottom: 20px;
  }
}


::v-deep .el-loading-mask {
  color: red;

  .el-loading-spinner {
    margin-top: 40px;
  }
}
</style>