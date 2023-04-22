<template>
  <div class="main">
    <!-- 歌手信息 -->
    <div class="singer-info">
      <div class="left">
        <img :src="singerInfo.data.artist?.cover" />
      </div>
      <div class="right">
        <h1>{{ singerInfo.data.artist?.name }}</h1>
        <div class="function">
          <el-button>收藏</el-button>
          <el-button>个人主页</el-button>
        </div>
        <div class="info">
          <p>单曲数：{{ singerInfo.data.artist?.musicSize }}</p>
          <p>专辑数：<span>{{ singerInfo.data.artist?.albumSize }}</span></p>
          <p>MV数：<span>{{ singerInfo.data.artist?.mvSize }}</span></p>
        </div>
      </div>
    </div>
    <div class="singer-container">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="专辑" name="1">
          <SingerAlbum v-if="activeName === '1'" />
        </el-tab-pane>
        <el-tab-pane label="MV" name="2">
          <SingerMv v-if="activeName === '2'" />
        </el-tab-pane>
        <el-tab-pane label="歌手详情" name="3">
          <SingerInfo v-if="activeName === '3'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SingerAlbum from '@/components/SingerAlbum'
import SingerMv from '@/components/SingerMv'
import SingerInfo from '@/components/SingerInfo'
import { singerDetail } from '@/api/singer'

const route = useRoute()
// 哪项tab栏激活
const activeName = ref('1')

// 歌手的简要信息
const singerInfo = reactive({
  data: {}
})
// 简化歌手的简要信息
const info = computed(() => {
  return singerInfo.data
})

onMounted(async () => {
  const { data } = await singerDetail(route.params.id)
  // console.log(data)
  singerInfo.data = data.data
})


// 切换tab栏
const handleClick = (tab, event) => {
  // console.log(tab, event)
}
</script>
<script>
export default {
  name: 'SingerDetail'
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;

  .singer-info {
    display: flex;

    .left {
      margin-right: 20px;
      width: 200px;
      height: 200px;
      overflow: hidden;
      border-radius: 20px;

      img {
        width: 123%;
        position: relative;
        left: -23px;
      }
    }

    .right {
      margin-top: 10px;
      color: var(--c);

      h1 {
        font-size: 27px;
      }

      .function {
        margin: 20px 0;
      }

      .info {
        display: flex;

        p {
          margin-right: 20px;
        }
      }
    }
  }

  .singer-container {
    margin-top: 30px;
  }
}
</style>