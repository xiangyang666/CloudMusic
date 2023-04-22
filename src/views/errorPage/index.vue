<template>
  <div class="main">
    <el-empty :image="imgUrl" description="啊叻？网站不见了？" image-size="700">
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// 引404入照片
import imgUrl from './images/404.png'

const router = useRouter()

const goBack = () => {
  router.push({
    name: 'home'
  })
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>