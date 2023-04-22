<template>
  <div class='musicList'>
    <ul>
      <li v-for="item in 8" :key="playList" @click="handleMusic(item.id)">
        <!-- <img :src="item.picUrl" alt=""> -->
        <!-- <h1>{{ item.name }}</h1> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  playList: {
    type: Array,
    required: true,
    default: []
  }
})

// 跳转到对应id下的歌单列表页面
const handleMusic = (id) => {
  console.log(id)
}

</script>
<script>
export default {
  name: ''
}
</script>
<style lang="scss" scoped>
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
    border: 1px solid red;
    justify-content: space-around;
    align-items: center;


    li {
      width: 230px;
      height: 230px;
      border: 1px solid red;
      cursor: pointer;
      float: left;
      display: inline-flex;
      display: flex;
      flex-direction: column;
      margin-right: 50px;
      margin-bottom: 20px;

      /* 如果屏幕尺寸为 870px 或更小*/
      // @media only screen and (max-width: 870px) {
      //   & {
      //     width: 160px;
      //   }
      // }

      img {
        border-radius: 10px;
      }

      h1 {
        color: var(--c)
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
</style>
