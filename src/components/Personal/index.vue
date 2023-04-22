<template>
  <div class="main">
    <!-- 信息容器 -->
    <div class="user-container">
      <div class="user-logo">
        <img width="270" :src="user.data.profile?.avatarUrl">
      </div>
      <div class="user-content">
        <!-- top -->
        <div class="top">
          <h1>{{ user.data.profile?.nickname }}</h1>
          <p>性别：{{ gender }}</p>
          <p>Lv{{ user.data.level }}</p>
        </div>
        <div class="bottom">
          <ul>
            <li>
              <h1>{{ user.data.profile?.newFollows }}</h1>
              <p>关注</p>
            </li>
            <li>
              <h1>{{ user.data.profile?.followeds }}</h1>
              <p>粉丝</p>
            </li>
            <li>
              <h1>{{ user.data.profile?.follows }}</h1>
              <p>动态</p>
            </li>
          </ul>
          <!-- 信息 -->
          <p>用户id：{{ id }}</p>
          <p>ip属地: <span>{{ user.data.profile?.city }}</span></p>
          <p>个性签名：{{ user.data.profile?.signature }}</p>
          <p>个人介绍：暂无介绍</p>
          <p>出生日期：{{ getDay(user.data.profile?.birthday) }}</p>
          <p>创建歌单已有：{{ user.data.createDays }}天</p>
          <p>听歌时长：{{ user.data.listenSongs }}</p>
        </div>
        <!-- bottom -->
      </div>
    </div>
    <!-- 歌曲容器 -->
    <div class="music-container">
      <h1 class="title">{{ user.data.profile?.nickname }}创建的歌单({{ playList.data.length }})</h1>
      <div class="music-playlist">
        <div class="item" v-for="(item, index) in playList.data" :key="index" @click="goMusicDetail(item.id)">
          <img width="150" :src="item.coverImgUrl">
          <h1>{{ item.name }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { personalInfo, personalMusicList } from '@/api/home'
import { getDay } from '@/utils/day';

// 实例化route对象
const route = useRoute()
const router = useRouter()

// 获取从哪个页面过来的用户id
const id = route.params.id

// 个人信息
const user = reactive({
  data: {}
})

// 个人歌单列表
let playList = reactive({
  data: []
})

// 页面挂在后就会执行
onMounted(() => {
  idData(id)
})

// 只要route.params.id改变了，就会根据新数据更新页面
watch(() => route.params.id, async () => {
  idData(route.params.id)
})

// 封装根据id获取数据
const idData = async (id) => {
  const { data } = await personalInfo(id)
  user.data = data
  const res = await personalMusicList(id)
  playList.data = res.data.playlist
}


// 格式化性别
const gender = computed(() => {
  return user.data.profile?.gender == 1 ? '男' : '女'
})


// 去歌单详情页
const goMusicDetail = (id) => {
  console.log(id)
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
  name: 'Personal'
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
}

.user-container {
  display: flex;
  color: var(--c);

  // 头像
  .user-logo {
    img {
      border-radius: 50%;
    }
  }

  // 文字信息
  .user-content {
    width: 100%;
    margin-left: 15px;

    // top 
    .top {
      margin-bottom: 20px;

      h1 {
        font-size: 30px;
        margin-top: 20px;
        margin-bottom: 15px;
      }
    }

    // bottom
    .bottom {
      border-top: 1px solid #ccc;

      ul {
        width: 200px;
        display: flex;
        justify-content: space-between;
        margin-left: 10px;
        margin-bottom: 15px;
        margin-top: 10px;

        li {
          height: 45px;
          text-align: center;
        }
      }

      p {
        margin-top: 5px;
        font-size: 18px;
      }
    }
  }
}

.music-container {
  color: var(--c);

  // min-width: 1000px;
  .title {
    margin: 30px 0;
    font-size: 23px;
  }

  .music-playlist {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding-bottom: 130px;

    .item {
      cursor: pointer;
      width: 250px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      // border: 1px solid red;

      img {
        width: 80%;
        height: 200px;
        border-radius: 20px;
      }

      h1 {
        width: 75%;
      }
    }

    &::after {
      content: '我是伪类元素';
      width: 200px;
      height: 200px;
      border: 1px solid red;
      border-radius: 20px;
      opacity: 0;
      margin-left: 40px;
    }
  }
}
</style>