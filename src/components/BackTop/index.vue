<template>
  <div class="baktop" @click="handleBacktop(70)">
    <img src="./images/rocket_top.png" alt="火箭">
  </div>
</template>

<script setup>
import { ref } from 'vue';

let timer = ref(null)
const handleBacktop = (speed) => {
  // console.log('返回顶部')
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    if (document.querySelector('.el-main').scrollTop <= 0) {
      clearInterval(timer.value)
    }
    document.querySelector('.el-main').scrollTop = document.querySelector('.el-main').scrollTop - speed
  }, 10);
}
</script>
<script>
export default {
  name: ''
}
</script>

<style lang="scss" scoped>
.baktop {
  color: #fff;
  position: fixed;
  bottom: 100px;
  right: 30px;
  z-index: 99999;
  padding: 20px;
  cursor: pointer;


  img {
    transition: all .3s;
    opacity: .5;
    z-index: 1000;
  }

  &:hover {
    img {
      transform: scale(1.2);
      opacity: 1;
    }
  }
}
</style>