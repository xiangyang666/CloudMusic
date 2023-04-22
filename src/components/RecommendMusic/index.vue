<template>
  <div class="main">
    <span class="title">推荐歌单</span>
    <div class='musicList'>
      <ul>
        <li v-for="item in MusicList.data" :key="item.id" @click="handleMusic(item.id)">
          <img :src="item.picUrl" alt="">
          <h1>{{ item.name }}</h1>
        </li>
      </ul>
    </div>
    <!-- 自适应布局 -->
    <!-- <TemplateCode :list="MusicList.data" type="musicDetail" /> -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { recommendMusicList } from '@/api/home'
import TemplateCode from '@/components/SearchResultDetail/TemplateCode.vue';

const router = useRouter()

// 音乐列表数据
let MusicList = reactive({
  data: {}
})
// 限制多少条数据
let count = ref(1200)

// 页面一挂载就请求接口
onMounted(async () => {
  const { data } = await recommendMusicList(count.value)
  MusicList.data = data.result
})

// 去歌单详情
const handleMusic = async (id) => {
  router.push({
    path: `/layout/musicdetail/${id}`
  })
}
</script>

<script>
export default {
  name: 'RecommendMusic'
}
</script>

<style lang="scss" scoped>
.main {
  // max-width: 1280px;
  // margin: 0 auto;

  .title {
    font-size: 45px;
    font-weight: 900;
    margin: 30px 0px;
    background-image: var(--home-recommend);
    background-clip: text;
    color: transparent;
  }

  .musicList {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    padding-left: 10px;
    margin-top: 15px;

    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;

      li {
        width: 230px;
        height: 230px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        margin-right: 50px;
        margin-bottom: 70px;

        &:hover {
          h1 {
            color: var(--tc)
          }
        }

        /* 如果屏幕尺寸为 870px 或更小*/
        // @media only screen and (max-width: 870px) {
        //   & {
        //     width: 160px;
        //   }
        // }

        img {
          border-radius: 10px;
          object-fit: cover;
          margin-bottom: 5px;
        }

        h1 {
          color: var(--c);
          transition: all .4s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
        }
      }

      /* 如果屏幕尺寸为 1090px 或更小，执行对应样式*/
      // @media only screen and (max-width: 1090px) {
      //   & {
      //     width: 90%;
      //     justify-content: center;
      //     margin-left:30px;
      //   }
      // }

      // @media only screen and (max-width: 1378px) {
      //   & {
      //     width: 90%;
      //     justify-content: center;
      //     margin-left:30px;
      //   }
      // }

    }
  }
}
</style>