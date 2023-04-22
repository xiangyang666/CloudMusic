<template>
  <router-view />
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { useUserStore } from './store/user';
import { getItem, setItem } from './utils/localStorage'
import { changeFontFamily } from '@/utils/setFontFamily';
import font1 from '@/assets/letterform/font01.ttf'
import font2 from '@/assets/letterform/font02.ttf'
import font3 from '@/assets/letterform/font03.ttf'
import font4 from '@/assets/letterform/font04.ttf'
import font5 from '@/assets/letterform/font05.ttf'

const userStore = useUserStore()

onMounted(() => {
  if (getItem('theme') == null) {
    userStore.theme = true
    setItem('theme', true)
  }
  userStore.theme = getItem('theme')
})

watch(() => userStore.theme, () => {
  if (getItem('theme')) {
    // console.log('白天模式')
    document.documentElement.removeAttribute('theme')
  } else {
    // console.log('夜间模式')
    document.documentElement.setAttribute('theme', 'dark')
  }
}, {
  immediate: true
})


// 首次加载字体
changeFontFamily(font5)
</script>

<style lang="scss">
// 修改滚动条样式
::-webkit-scrollbar {
  width: 10px;
  position: fixed;
  right: 0;
  top: 0;
}

::-webkit-scrollbar-thumb {
  background-color: #CECECE;
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #dad7d7;
}
</style>
