<template>
  <div class="main">
    <!-- 推荐信息 -->
    <div class="recommendInfo">
      <!-- 左 -->
      <div class="left">
        <h1>{{ day }}</h1>
      </div>
      <!-- 右 -->
      <div class="right">
        <h1>每日歌曲推荐</h1>
        <p>根据你的音乐口味生成，每天6：00更新</p>
      </div>
    </div>
    <div class="btn">
      <el-button @click="playMusicDetailList($event, recommendList.data)" size="large" round type="danger"><span
          class="iconfont icon-bofang"></span>播放全部</el-button>
      <el-button size="large" round type="warning"><span class="iconfont icon-aixin"></span>收藏全部</el-button>
    </div>
    <div class="musicList">
      <MusicList :musicApp="recommendList.data" :musicList="recommendList.data" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { dayRecommend } from '@/api/home'
import MusicList from '@/components/MusicList'
import dayjs from 'dayjs';
import playMusicDetailList from '@/hooks/playMusicDetailList';

// 存放推荐歌曲
let recommendList = reactive({
  data: []
})

onMounted(async () => {
  // 获取每日推荐歌曲
  const { data } = await dayRecommend()
  recommendList.data = data.data.dailySongs

  day.value = dayjs().$D
})

// 今天几号
const day = ref('')

</script>
<script>
export default {
  name: 'DayRecommend'
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  padding-bottom: 65px;

  .recommendInfo {
    display: flex;
    padding: 10px 50px;
    // border: 1px solid red;

    .left {
      width: 95px;
      height: 95px;
      background-image: url(@/assets/images/date.png);
      background-size: contain;
      position: relative;
      background-repeat: no-repeat;

      h1 {
        font-size: 50px;
        position: absolute;
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--tc);
      }
    }

    .right {
      margin-top: 15px;
      margin-left: 20px;
      color: var(--c);

      h1 {
        font-size: 33px;
      }

      p {
        font-size: 18px;
        margin-top: 5px;
      }
    }
  }

  .btn {
    margin-left: 50px;
    margin-bottom: 20px;
  }
}
</style>
