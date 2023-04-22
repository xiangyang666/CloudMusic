<template>
  <h1 class="count">共找到 <span class="count_index">{{ store.songCount }}</span> 首单曲</h1>
  <MusicList v-if="store.searchMusicList?.songs" :musicList="store.searchMusicList?.songs" />
  <!-- 无数据 -->
  <NoData class="no_data" :text='text' v-if="!store.searchMusicList?.songs" />
</template>

<script setup>
import { computed } from 'vue'
import { useSearchStore } from '@/store/search';
import { useRoute } from 'vue-router';
import MusicList from '@/components/MusicList'
import NoData from '@/components/NoData'

const route = useRoute()
const store = useSearchStore()

// 获取到传递过来的关键词
const keyword = route.params.keyword

// 无找到该歌手NoData text数据
const text = computed(() => {
  return `很抱歉，未能找到 ${store.keyword} 相关的歌曲`
})

</script>
<script>
export default {
  name: ''
}
</script>
<style lang="scss" scoped>
.count {
  font-size: 30px;
  color: var(--c);

  .count_index {
    color: var(--tc);
  }
}

.no_data {
  margin-top: 135px;
}
</style>
