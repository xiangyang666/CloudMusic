<template>
  <el-empty :description="props.text">
  </el-empty>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  text: {
    type: String,
    required: false,
    default: '暂无数据'
  }
})

</script>
<script>
export default {
  name: 'NoData'
}
</script>

<style lang="scss" scoped></style>