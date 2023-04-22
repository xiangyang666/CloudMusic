<template>
  <div class="main">
    <h1 class="title">共找到 <span class="total">{{ albumList.data?.albumCount || 0 }}</span> 个专辑</h1>
    <TemplateCode :list="albumList.data?.albums" type="album" />
    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination hide-on-single-page @current-change="currentChange" @prev-click="currentChange"
        @next-click="currentChange" :page-size="store.getDataCount" background layout="prev, pager, next"
        :total="totalCount" class="mt-4" />
    </div>
  </div>
  <!-- 无数据 -->
  <NoData :text='text' v-if="albumList.data?.albumCount == 0" />
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { keywordsSearch } from '@/api/search'
import { useSearchStore } from '@/store/search';
import TemplateCode from './TemplateCode.vue';
import NoData from '@/components/NoData'
import { offset } from '@popperjs/core';

// 无找到该歌手NoData text数据
const text = computed(() => {
  return `很抱歉，未能找到 ${store.keyword} 相关的专辑`
})

const store = useSearchStore()

// 专辑列表
const albumList = reactive({
  data: []
})

onMounted(() => {


  app(0)
})


// 封装函数
async function app(offset) {  // 只需要传入offset参数（用于分页 , 如 :(页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0），其余都是死的
  const { data } = await keywordsSearch(store.keyword, store.getDataCount, offset, 10)

  // console.log(data)

  albumList.data = data.result
}

function currentChange(num) {
  console.log(num - 1, 'kk')
  app((num - 1) * store.getDataCount)
}

// 数据总条数
const totalCount = computed(() => {
  // 当0的时候分页器不显示
  return Number(albumList.data?.albumCount) || 0
})
</script>
<script>
export default {
  name: ''
}
</script>
<style lang="scss" scoped>
.main {
  max-width: 1280px;
  min-width: 980px;
  margin: 0 auto;

  .title {
    font-size: 30px;
    color: var(--c);

    .total {
      color: var(--tc)
    }
  }
}

.pagination {
  margin-bottom: 100px;
}
</style>
