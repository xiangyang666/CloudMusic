<template>
  <div class="main">
    <!-- 用户信息容器 -->
    <div class="user-container">
      <!-- 头像 -->
      <div class="user-logo">
        <img :src="user.userLogo" class="logo" />
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <h1 class="userName">{{ user.userName }}</h1>

        <div class="grade">
          <p>等级：lv7</p>
          <p>性别：<span>{{ user.gender === 1 ? '男' : '女' }}</span></p>
        </div>
        <div class="phone">
          <p>网易云音乐号：{{ user.id }}</p>
          <el-button type="danger">编辑个人信息</el-button>
        </div>
        <hr />
        <div class="fans">
          <div>
            <p>10</p>
            <p>关注</p>
          </div>
          <div>
            <p>12</p>
            <p>粉丝</p>
          </div>
          <div>
            <p>10</p>
            <p>动态</p>
          </div>
        </div>
        <!-- 个人描述 -->
        <div class="des">
          <p>ip属地：12871</p>
          <!-- <p>个人签名：{{ user.description ? user.description : '暂无' }}</p> -->
          <p>个人简介：{{ user.signature ? user.signature : '暂无' }}</p>
          <!-- <p>个人介绍：{{ user.detailDescription ? user.detailDescription : '暂无' }}</p> -->
          <!-- <p>生日：{{ user.birthday }}</p> -->
          <p>创建歌单已有：{{ user.createTime }}天</p>
          <p>听歌时长：6116 分钟</p>
          <p>ip属地：{{ user.lastLoginIP }}</p>
        </div>
      </div>
    </div>
    <!-- 用户歌单 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :label="`${user.userName}创建的歌单`" name="1">
        <div class='musicList'>
          <ul>
            <li v-for="(item, index) in createPlayList" :key="index" @click="handleMusic(item.id)">
              <img :src="item.coverImgUrl" alt="">
              <h1>{{ item.name }}</h1>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收藏的歌曲" name="2">
        <div class="musicList">
          <ul>
            <li v-for="(item, index) in collectPlayList" :key="index" @click="handleMusic(item.id)">
              <img :src="item.coverImgUrl" alt="">
              <h1>{{ item.name }}</h1>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="创建的音乐专栏" name="3">创建的音乐专栏</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user'
import { userAccount, getUserSongs, getSongAllMusic } from '@/api/user'
import { getUserInfo, userIp, getUserPlayList } from '@/api/user'

const userStore = useUserStore()
const router = useRouter()

// 获取用户信息 , 歌单，收藏，mv, dj 数量（---没用的接口）
onMounted(async () => {
  const data = await getUserInfo()
  // console.log(data)
})

onMounted(async () => {
  // 获取账号信息
  // 从数据中结构出data
  const { data } = await userAccount(userStore.token)
  // 再从结构的data中结构 account, profile
  const { account, profile } = data

  // 获取用户歌单
  const res = await getUserSongs(profile.userId)

  // 整理有用的用户信息
  const userObj = {
    // 账号id
    id: profile.userId,
    // 账号网名
    userName: profile.nickname,
    // 用户头像
    userLogo: profile.avatarUrl,
    // 性别
    gender: profile.gender,
    // 用户账号背景图片
    bgImg: profile.backgroundUrl,
    // 生日
    birthday: profile.birthday,
    // 描述
    description: profile.description,
    // 详细描述
    detailDescription: profile.detailDescription,
    // 账号创建时间
    createTime: profile.createTime,
    // 账号上一次登录时间
    lastLoginTime: profile.lastLoginTime,
    // 账户上一次登录ip地址
    lastLoginIP: profile.lastLoginIP,
    // 用户的歌单列表
    playList: [],
    // 个人简介
    signature: profile.signature
  }

  // console.log(profile)

  // 获取用户歌单（并赋值给userInfo）（playlist里有创建的和收藏的---以subscribed区分(true:收藏)(false:创建)）
  const result = await getUserPlayList(profile.userId)
  userObj.playList = result.data.playlist

  // console.log(result)

  // 将整合后的账户信息存储到pinia中
  userStore.updataUserInfo(userObj)

})

// 格式化store中的user
const user = computed(() => {
  return userStore.userInfo
})

// 对用户歌单进行格式化（subscribed为true代表收藏，false代表用户自己创建的）
// 创建的歌单
const createPlayList = computed(() => {
  return userStore.userInfo.playList?.filter((item) => !item.subscribed)
})
// // 收藏的歌单
const collectPlayList = computed(() => {
  return userStore.userInfo.playList?.filter((item) => item.subscribed)
})

// 哪个tab栏被高亮
const activeName = ref('1')
// 点击tab栏切换
const handleClick = (tab, event) => {
  // console.log(tab, event)
}

// 传入id可获取歌单详情
const handleMusic = async (id) => {
  // const { data } = await getSongAllMusic(id)
  // console.log(id, data)

  router.push({
    path: `/layout/musicdetail/${id}`
  })
}
</script>
<script>
export default {
  name: 'UserInfo'
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  position: relative;
  color: var(--c);
  padding-bottom: 150px;

  // 用户信息容器
  .user-container {
    width: 100%;
    height: auto;
    display: flex;


    // 头像
    .user-logo {
      width: 300px;
      height: 300px;

      .logo {
        width: 100%;
        border-radius: 50%;
        margin-top: 30px;
        margin-left: 30px;
      }
    }

    // 用户信息
    .user-info {
      width: 100%;
      // padding: 20px 20px;
      margin-top: 30px;
      margin-left: 50px;

      .userName {
        font-size: 27px;
      }

      .grade {
        display: flex;
      }

      .phone {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 30px;
      }

      .fans {
        width: 250px;
        height: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        div p:first-child {
          font-size: 20px;
          font-weight: 900;
        }

      }

      .des {
        p {
          margin-top: 2px;
        }
      }


    }
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
      justify-content: flex-start;
      align-items: center;


      li {
        width: 230px;
        cursor: pointer;
        float: left;
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
          color: var(--c);
          margin-top: 10px;
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