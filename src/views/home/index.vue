<template>
  <Test></Test>
  <div class="home">
    <el-tabs v-model="activeName" class="demo-tabs">
      <!-- 个性推荐 -->
      <el-tab-pane label="个性推荐" name="1">
        <!-- 如果使用template不会渲染到页面，只是对多个组件进行包裹，实现一些操作 -->
        <!-- 如果当前跟要展示的activeName对应上就展示，否则就隐藏 -->
        <!-- 我这样做的原因是防止页面一加载进来别的tab栏数据也被加载，甚至消耗网络资源，损耗性能 -->
        <template v-if="activeName === '1'">
          <Banner />
          <recommendMusic />
        </template>
      </el-tab-pane>
      <!-- 歌单 -->
      <el-tab-pane label="歌单" name="2">
        <template v-if="activeName === '2'">
          <PlayList />
        </template>
      </el-tab-pane>
      <!-- 排行榜 -->
      <el-tab-pane label="排行榜" name="3">
        <template v-if="activeName === '3'">
          <RankingList></RankingList>
        </template>
      </el-tab-pane>
      <!-- 歌手 -->
      <el-tab-pane label="歌手" name="4">
        <template v-if="activeName === '4'">
          <Singer />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Banner from '@/components/Banner'
import recommendMusic from '@/components/RecommendMusic'
import RankingList from '@/components/RankingList'
import { loginStatus } from '@/api/user'
import PlayList from '@/components/PlayList'
import Singer from '@/components/Singer'
import Test from '@/test/index.vue'

// 切换成哪个项tab页面
const activeName = ref('1')

onMounted(async () => {
  const data = await loginStatus()
  // console.log(data)
})


</script>
<script>

export default {
  name: 'Main'
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin-bottom: 80px;
}
</style>