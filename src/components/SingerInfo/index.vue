<template>
  <h1 class="main">{{ info.data.briefDesc }}</h1>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { singerInfoDetil } from '@/api/singer';

const route = useRoute()

// 歌手信息
const info = reactive({
  data: {}
})

onMounted(async () => {
  const data = await singerInfoDetil(route.params.id)
  info.data = data.data.data.artist

  console.log(info.data)
})

</script>
<script>
export default {
  name: 'SingerInfo'
}
</script>

<style lang="scss" scoped>
.main {
  line-height: 30px;
  text-indent: 40px;
  color: var(--c);

  &::first-letter {
    color: var(--tc);
    font-size: 40px;
  }
}
</style>