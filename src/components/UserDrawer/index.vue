<template>
  <!-- 
    collapse：控制是否折叠起菜单栏
   -->
  <el-menu default-active="1" class="el-menu-vertical-demo">
    <el-menu-item index="1" @click="centerUserInfo">
      <span class="iconfont"></span>
      <template #title>个人信息</template>
    </el-menu-item>
    <el-menu-item @click="handleAboutInfo" index="2">
      <span class="iconfont"></span>
      <template #title>关于我们</template>
    </el-menu-item>
    <el-menu-item index="3">
      <span class="iconfont"></span>
      <template #title>
        全屏模式
        <el-switch @change="handleFullScreen" v-model="fullScreen" />
      </template>
    </el-menu-item>
    <el-menu-item index="4" @click="handleIsCollapse">
      <span>关闭侧边栏</span>
      <el-switch v-model="asideStore.isCollapse" @click="handleIsCollapse" size="large" />
    </el-menu-item>
    <el-menu-item index="5">
      <span>夜间模式</span>
      <el-switch v-model="themeStatus" @change="handleThese" size="large" />
    </el-menu-item>
    <el-menu-item @click="handleSetting" index="6">
      设置
    </el-menu-item>
    <el-menu-item v-if="userStore.token" @click="centerDialogVisible = true" index="7"
      style="background-color: #73b8ff;font-family:''">
      退出登录
    </el-menu-item>
    <!-- <el-menu-item>
      <span style="margin-right:15px;"></span>
      <el-switch @change="handleThese" v-model="userStore.theme" size="large" />
    </el-menu-item> -->
  </el-menu>

  <!-- Dialog 对话框（这里用来显示是否退出的登录） -->
  <el-dialog v-model="centerDialogVisible" title="提示" width="35%" align-center>
    <span>确定退出登录吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelLogout">取消</el-button>
        <el-button type="primary" @click="logout">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useAsideStore } from '@/store/aside';
import { useUserStore } from '@/store/user'
import { logoutApi } from '@/api/user'
import { getItem, removeItem } from '@/utils/localStorage';

const router = useRouter()
// 用户store
const userStore = useUserStore()
// 首页侧边栏相关
const asideStore = useAsideStore()

// 主题状态
const themeStatus = computed({
  // return !userStore.theme
  get() {
    return !userStore.theme
  },
  set(newVal) {
    userStore.theme = newVal
  }
})

// 个人信息
const centerUserInfo = () => {
  router.push({
    name: 'userInfo'
  })
  close()
}

// 关于我们
const handleAboutInfo = () => {
  router.push({
    name: 'aboutInfo'
  })
  close()
}

// 展开或收起侧边栏
const handleIsCollapse = () => {
  asideStore.updataIsCollapse()
  close()
  // console.log(asideStore.isCollapse)
}

// 切换主题
const handleThese = () => {
  userStore.updataTheme()
  close()
}

// 关闭侧边栏
const close = () => {
  userStore.updataCenterAside()
}

// 个性设置
const handleSetting = () => {
  router.push({
    name: 'setting'
  })
  close()
}

const centerDialogVisible = ref(false)

// 退出登录
const logout = async () => {
  const { data } = await logoutApi()

  // 退出成功
  if (data.code === 200) {
    // 清楚本地存储的token数据
    removeItem('token')
    removeItem('userInfo')
    // 跳转页面
    router.replace({
      name: 'login'
    })
    setTimeout(() => {
      // 也要清楚pinia中的token数据
      userStore.updataToken('')
      userStore.updataUserInfo('')
      // 提示退出成功
      ElNotification.success('退出成功')

      // 关闭用户中心的侧边栏
      userStore.updataCenterAside()
    }, 1)

  } else {
    // 提示退出失败
    ElMessage.success('网络拥挤，退出失败！')
  }
}
// 取消退出登录
const cancelLogout = () => {
  // 关闭侧边栏
  userStore.updataCenterAside()
  // 关闭通知
  centerDialogVisible.value = false
  // 提示用户
  ElNotification({
    type: 'warning',
    title: '提示',
    message: '已取消退出登录！',
    duration: 2500
  })
}


// 全屏模式（参考技术文档：https://www.likecs.com/show-307089604.html）
const fullScreen = ref(false)
const handleFullScreen = (newVal) => {
  close()
  // 获取html
  const html = document.documentElement

  // 如果文档未全屏
  if (!document.fullscreenElement) {
    // 进入全屏模式
    html.requestFullscreen()
  } else {
    if (document.exitFullscreen) { // 如果退出全屏
      // 退出全屏
      document.exitFullscreen()
    }
  }


}
</script>

<script>
export default {
  name: 'Drawer'
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  background-color: var(--bgc);
  border: none;

  .el-menu-item {
    color: var(--c);
    font-size: 20px;

    .el-switch {
      margin-left: 10px;
      margin-top: 1px;
    }

    &:hover {
      background-color: #999797;
      color: #fff;
    }
  }
}

::v-deep .el-overlay {

  .el-drawer.ltr,
  .el-drawer.rtl {
    background-color: var(--bgc);
  }
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>