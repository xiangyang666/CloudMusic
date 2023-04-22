<!-- default-active：控制哪个导航高亮（el-menu-item中的index与它要同步）
    collapse：是否需要收起侧边栏
   -->
<template>
  <el-menu :default-active="menuActive" @select="handleMenu" class="aside-box el-menu-vertical-demo"
    :collapse="store.isCollapse">
    <el-menu-item :disabled="item.isDisabled" v-for="item in asideMenuList" :index="item.id"
      @click="goRouter(item.router)">
      <span class="iconfont" :class="item.icon"></span>
      <template #title>
        <span>{{ item.title }}</span>
      </template>
    </el-menu-item>
    <div v-show="!store.isCollapse" style="margin-left:7px;font-size:20px;color:#ccc;height:50px;line-height: 50px;">创建的歌单
    </div>
    <el-menu-item @click="myLikeMusic" :disabled="!userStore.token" index="6">
      <span class="iconfont icon-aixin"></span>
      <template #title>
        <span>我的喜欢</span>
      </template>
    </el-menu-item>
    <el-menu-item @click="userCenter" :disabled="!userStore.token" index="7">
      <span class="iconfont icon-xiazai"></span>
      <template #title>
        <span>个人中心</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useAsideStore } from '@/store/aside';
import { useUserStore } from '@/store/user';
import { userLikeMusic, likeMusicList } from '@/api/user';
import { getItem, setItem } from '@/utils/localStorage';

const store = useAsideStore()
const userStore = useUserStore()
const router = useRouter()

// 菜单默认激活id
const menuActive = ref('1')

onMounted(() => {
  /**
   * 这里有一个小bug
   * 当用于第一次打开网站时，需要从 localStorage 中获取 menuActive ，但是他是没有的(null)（为false），没有的结果就是 menu 没有一个显示样式的
   * 在这判断一下，如果没有 menuActive 则第一次给他赋值为 1 ，首页菜单选项获得样式
   * 如果有，则获取 localStorage 中的 menuActive 赋值给 menuActive.value
  */
  //  有
  if (sessionStorage.getItem('menuActive')) {
    menuActive.value = sessionStorage.getItem('menuActive') + ''
  } else {
    // 没有（没有就是压根就没这变量---用户点击以后才会有menuActive数据）
    menuActive.value = '1'
  }
})

/*
参考官网地址：https://element-plus.gitee.io/zh-CN/component/menu.html#menu-methods
Menu Events
  ---> select：菜单激活回调
  参数1：选中菜单项的 index
  参数2：选中菜单项的 index path,
  参数3：item: 选中菜单项（包括index，和indexPath）
*/
// 侧边栏菜单处理函数
const handleMenu = (index) => {
  // 有token
  if (userStore.token) {
    // index就是当前激活菜单项的 index
    // 将index存储到localStorage中，进行持久存储，防止用户刷新页面从（加入在video组件中）跑到home组件
    sessionStorage.setItem('menuActive', index)
  } else {
    // 没有token
    // 如果没有登录（点击每日推荐/收藏/视频等），刷新后样式就不能停留在当前meun上，要index切换为 1
    sessionStorage.setItem('menuActive', '1')
  }
}

// 侧边菜单数据
const asideMenuList = reactive([
  {
    id: '1',
    title: '发现音乐',
    icon: 'icon-musicfill',
    router: 'home'
  },
  {
    id: '2',
    title: '每日推荐',
    icon: 'icon-tuijian',
    router: 'dayrecommend'
  },
  {
    id: '3',
    title: '收藏',
    icon: 'icon-shoucang',
    router: 'collect'
  },
  {
    id: '4',
    title: '视频',
    icon: 'icon-video',
    router: 'video'
  },
  {
    id: '5',
    title: '时间线',
    icon: 'icon-shijian-xianxing',
    router: 'timeline'
  }
])
// 封装跳转路由函数（只需要传入路由name即可）
function goRouter(routerPage) {
  router.push({
    name: `${routerPage}`
  })
}

// 用户喜欢的音乐列表id
const userMusicListId = ref(0)

onMounted(async () => {
  const data = await userLikeMusic()
  // console.log('喜欢列表', data)
  userMusicListId.value = data.data.playlistId
})

// 我喜欢的音乐
const myLikeMusic = () => {
  // console.log(userStore.userInfo)
  router.push({
    name: 'musicDetail',
    params: {
      id: userMusicListId.value
    }
  })
}

// 个人中心
const userCenter = () => {
  goRouter('userInfo')
}

</script>

<style lang="scss" scoped>
// .el-menu-vertical-demo[data-v-63a0291e]:not(.el-menu--collapse) {
//   background-color: var(--bgc);
// }

.el-menu-vertical-demo {
  background-color: var(--bgc);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
  min-height: 400px;

}

.common-layout .el-container .el-aside .el-menu--collapse[data-v-038e7047] {
  background-color: var(--bgc);
}

.el-menu-item {
  display: flex;
  align-items: center;
  font-size: 21px;
  font-family: 'myfont';
  color: var(--c);


  &:hover {
    background-color: var(--aside);
  }

  span {
    font-size: 23px;
    margin-right: 10px;
    margin-left: 5px;
    margin-top: 5px;
  }
}

// 点击导航栏的文字颜色（激活的元素）
.el-menu-item.is-active {
  color: var(--home-menu);
  font-weight: 900;
  font-size: 25px;
}
</style>