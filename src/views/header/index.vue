<template>
  <div class="header">
    <!-- left -->
    <div class="left">
      <el-image @click="router.push({
        name: 'home'
      })" style="width:130px;cursor: pointer;" src="http://www.codeman.ink/img/logo.47591c5c.png" fit="contain" />
      <div class="navigate">
        <span @click="router.back()" class="iconfont icon-xiangzuojiantou back"></span>
        <span @click="router.go(1)" class="iconfont icon-xiangyoujiantou go"></span>
      </div>
      <div class="search_box" @click.stop="clickSearch">
        <p class="iconfont icon-sousuo"></p>
        <input type="text" v-model="searchStore.keyword" placeholder="请输入关键词" @focus.enter="handleFocus"
          @keydown.enter="searchEnter" @input="searchKeyword" />
        <SearchContainer :isShow="searchStore.isShow" v-show="searchStore.isShow" :hotSearchList="hotSearchList.data" />
        <!-- 官方版的也未添加搜索按钮，这里添加了，但效果不是很满意，也取消了 -->
        <!-- <el-button @click="searchEnter" v-if="searchStore.keyword" class="search_btn" type="danger">搜索</el-button> -->
      </div>
    </div>
    <!-- right -->
    <!-- 有token显示 -->
    <div v-if="store.token" class="right">
      <h1 id="userName" @click="personCenter">{{ store.userInfo.userName }}</h1>
      <el-image :src="store.userInfo.userLogo" @click="personCenter"></el-image>
    </div>
    <!-- 否则，没有token显示 -->
    <div v-else class="right rightNoToken">
      <!-- 如果登录了就不需要展示该按钮了 -->
      <el-button class="login" @click="router.push('/login')" style="color:var(--c);">登录</el-button>
      <h1 @click="personCenter">个人中心</h1>
    </div>
    <!-- 抽屉盒子 -->
    <el-drawer v-model="store.userCenterAside" :with-header="true">
      <UserDrawer />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useSearchStore } from '@/store/search';
import { useRouter, useRoute } from 'vue-router';
import UserDrawer from '@/components/UserDrawer'
import SearchContainer from '@/components/SearchContainer'
import { hotSearch, keywordsSearch } from '@/api/search'
import { musicDetail } from '@/api/home'
import { userAccount } from '@/api/user'
// import { debounce } from '@/utils/toolFunction';


const store = useUserStore()
const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()

// 输入框关键词
onMounted(async () => {
  if (!searchStore.keyword) {
    searchStore.updataKeyword(route.params.keyword)
    return searchStore.keyword
  }
  return searchStore.key
})

// 是否显示抽屉盒子
const drawer = ref(false)

// 拿到token，对token状态做一些事情

// 个人中心
const personCenter = () => {
  store.updataCenterAside()
}

let hotSearchList = reactive({
  data: []
})

// 获取热搜列表
onMounted(async () => {
  const { data } = await hotSearch()

  hotSearchList.data = data.data

  // console.log('hot', hotSearchList)
})

// 点击搜索框
const clickSearch = (e) => {
  searchStore.updataIsShow(true)
}

// 聚焦搜索输入框事件
const handleFocus = async () => {
  searchStore.updataIsShow(true)
}
// 点击页面任何地方隐藏搜索容器
const body = document.body
body.onclick = function (e) {
  searchStore.updataIsShow(false)
}

// 回车搜索歌曲，并展示到musicList组件
const searchEnter = async () => {
  // 输入框没有值
  if (!searchStore.keyword) {
    ElMessage.error('请输入关键词')
  } else {
    // 修改tab栏的状态（回到歌曲tab栏下）
    searchStore.updataActiveTabs('1')

    // 输入框有值
    router.push({
      name: 'search',
      params: {
        keyword: searchStore.keyword
      }
    })

    // 搜索歌曲
    // 根据关键词，发请求,搜索音乐列表
    const res = await keywordsSearch(searchStore.keyword)
    const musicListData = res.data.result
    searchStore.updataMusicList(musicListData)

    // 更新曲目条数
    searchStore.updataSongCount(res.data.result.songCount)

    searchStore.updataIsShow(false)
  }
}

// 输入框输入值的时候发请求，获取搜索建议数据
const searchKeyword = (e) => {
  // console.log('输入框输入中...')
}

</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0 20px;


  .left {
    height: 100%;
    display: flex;
    align-items: center;

    .search_box {
      width: 350px;
      display: flex;
      align-items: center;
      border: 1px solid rgb(255, 255, 255);
      background-color: #fff;
      margin-left: 20px;
      border-radius: 40px;
      visibility: visible;
      position: relative;
      cursor: pointer;

      p {
        font-size: 20px;
        margin-left: 15px;
      }

      input {
        height: 35px;
        width: 90%;
        background-color: transparent;
        border: none;
        outline: none;
        padding-left: 10px;
        padding-right: 20px;
        font-size: 17px;
      }

      .search_btn {
        height: 35px;
        margin-right: 10px;
      }
    }

    .navigate {
      margin-left: 50px;

      span {
        color: #fff;
        cursor: pointer;
        background-color: rgba(0, 0, 0, .1);
        padding: 7px;
        border-radius: 100%;
        font-size: 14px;
      }

      span:last-child {
        margin-left: 10px;
      }
    }
  }

  .right {
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding-right: 30px;
    position: absolute;
    right: 0px;
    margin-right: 30px;


    ::v-deep .login {
      margin-right: 30px;

      span {
        color: #000 !important;

      }
    }

    #userName {
      // color: var(--bgc);
      color: #fff;
      cursor: pointer;
    }

    .el-image {
      width: 50px;
      border-radius: 100%;
      cursor: pointer;
      box-shadow: 0 0 20px 5px rgb(255, 255, 255);
      margin-left: 10px;
    }
  }

  .rightNoToken {
    h1 {
      color: #fff;
      cursor: pointer;
    }
  }
}

// 抽屉盒子
::v-deep .el-drawer {
  background-color: var(--bgc);
}
</style>