<template>
  <el-tabs v-model="store.activeTabs" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="单曲" name="1">
      <SearchSong v-if="String(store.activeTabs) == '1'" />
    </el-tab-pane>
    <el-tab-pane label="歌手" name="2">
      <SearchSinger v-if="String(store.activeTabs) == '2'" />
    </el-tab-pane>
    <el-tab-pane label="专辑" name="3">
      <SearchAlbum v-if="String(store.activeTabs) == '3'" />
    </el-tab-pane>
    <el-tab-pane label="视频" name="4">
      <SearchVideo v-if="String(store.activeTabs) == '4'" />
    </el-tab-pane>
    <el-tab-pane label="歌单" name="5">
      <SearchMusiclist v-if="String(store.activeTabs) == '5'" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useSearchStore } from '@/store/search';
import { useRoute } from 'vue-router';
import SearchSong from './SearchSong'
import SearchSinger from './SearchSinger';
import SearchAlbum from './SearchAlbum';
import SearchVideo from './SearchVideo';
import SearchMusiclist from './SearchMusiclist';
import { setItem, getItem } from '@/utils/localStorage';

const store = useSearchStore()
const route = useRoute()

// 当前哪一项被选中
const activeName = store.activeTabs

onMounted(() => {
  store.updataKeyword(route.params.keyword)
})

// watch(() => store.keyword, () => {
//   updataActiveName()
// }, {
//   immediate: true
// })

function updataActiveName() {
  // 获取本次数据中的searchTab高亮选项数据
  activeName.value = getItem('searchTab') + ''
}

// tab栏点击事件
const handleClick = (tab, event) => {
  store.updataActiveTabs(tab.paneName)
}


</script>

<script>
export default {
  name: 'SearchResultDetail'
}
</script>

<style lang="scss" scoped>
h1 {
  color: var(--c);
  font-size: 30px;
  margin-bottom: 10px;
}
</style>