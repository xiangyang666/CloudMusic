<template></template>
<!-- test组件已在home组件中注册，test只做数据接口请求测试，不对页面进行操作 -->
<script setup>
import { onMounted } from 'vue'
import { xiaoai } from '@/test/api'
import { podcast, musicInfo } from '@/test/api'


onMounted(async () => {
  // const data = await xiaoai('你是谁？')
  // console.log(data)

  // const data = await podcast(100)
  // console.log(data)
})

onMounted(async () => {

})

onMounted(async () => {

})

</script>
<script>
export default {
  name: ''
}
</script>
<style lang="scss" scoped></style>
