<template>
  <div class="common-layout">
    <div class="slider" :style="{ width: `${width}%` }"></div>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <Header />
      </el-header>
      <!-- 内容容器 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside style="width:auto;">
          <Aside />
        </el-aside>
        <!-- 主页 -->
        <!-- 添加element滚动条 -->
        <el-main class="main" @scroll='handleScroll'>
          <!-- 路由出口 -->
          <!-- 路由匹配的组将将渲染到这里 -->
          <router-view></router-view>
        </el-main>
      </el-container>
      <!-- 音乐播放器容器 -->
      <div class="audio-container">
        <Audio />
      </div>
      <!-- 返回顶部组件 -->
      <BackTop v-if="userStore.show"></BackTop>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/views/header'
import Aside from '@/views/Aside'
import Audio from '@/views/audio'
import BackTop from '@/components/BackTop'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 初始化页面加载条的宽度
let width = ref(0)

const handleScroll = () => {
  if (document.querySelector('.el-main').scrollTop >= 150) {
    userStore.show = true
  } else {
    userStore.show = false
  }
  // console.log('滚动条滚动了！')
  // console.dir(document.querySelector('.slider'))

  // 获取滚动条的垂直位置
  let scrollTop = Math.ceil(document.querySelector('.el-main').scrollTop)
  // 整个html页面高度(减去滚动条的高度) =  body的高度 - 窗口的文档显示区的高度
  let maxScrollTop = document.querySelector('.el-main').scrollHeight - document.querySelector('.el-main').clientHeight
  // 百分比 =  获取滚动条的垂直位置 / 整个html页面高度 * 100
  let percent = (scrollTop / maxScrollTop * 100);
  // 赋值
  width.value = percent
}
</script>
<script>
export default {
  name: 'Layout'
}
</script>

<style lang="scss" scoped>
.common-layout {
  width: 100%;
  height: 100%;

  .slider {
    width: 20%;
    height: 5px;
    background-color: #329bf7;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    transition: all .5s;
    background-image: linear-gradient(43deg, var(--page-progress-bar-start), var(--page-progress-bar-end));
    border-radius: 10px;
  }

  .el-container {
    width: 100%;
    height: 100%;
    // 页面最小宽度
    // min-width: 1280px;

    .el-header {
      padding: 0;
      // height:60px;
      background-color: var(--hc);
      // filter: drop-shadow(2px 4px 6px #ec4141);
      // background-color: rgba(152, 151, 151, 0.2); 
      box-shadow: inset 0 0 0 200px rgb(255, 255, 255, 0.08);
    }

    .el-main {
      min-width: 1000px;
      // margin-bottom: 50px;
    }

    .el-aside {
      .el-menu--collapse {
        height: 100%;
      }
    }
  }

  .audio-container {
    min-width: 840px;
    height: 70px;
    width: 100vw;
    background-color: rgb(255, 255, 255);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    box-shadow: 0 0 40px 15px var(--audio-box-shadow);
  }
}
</style>