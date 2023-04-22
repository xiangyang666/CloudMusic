<template>
  <div class="app">
    <ul>
      <li @click="goRouter(item)" v-for="(item, index) in props.list" :key="index">
        <img :src="item.img1v1Url || item.blurPicUrl || item.coverImgUrl || item.picUrl">
        <h3>{{ item.name }}</h3>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
  // 数据
  list: {
    type: Array,
    required: true,
    default: []
  },
  // 数据(页面)类型
  type: {
    type: String,
    required: true,
    default: 'song'
  }
})

// 跳转到指定页
const goRouter = ({ id }) => {
  // 根据父组件传入的值判断需要跳转到哪个页面
  router.push({
    name: props.type,
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
.app {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;

  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;

    li {
      margin: 0 1% 40px .6%;
      width: 18.4%;
      transition: all .5s;
      overflow: hidden;

      img {
        width: 100%;
        min-height: 20vh;
        max-height: 25vh;
        border-radius: 20px;
        cursor: pointer;
        object-fit: cover;
      }

      h3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        transition: all .3s;
        cursor: pointer;
        color: var(--c);
      }

      &:hover h3 {
        color: var(--tc);
      }
    }
  }
}
</style>
