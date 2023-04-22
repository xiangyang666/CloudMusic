<!-- 封装音乐列表组件 -->
<template>
  <div class="main">
    <!-- 表格 -->
    <!-- 加上stripe属性表格就会出现斑马线条纹了 -->
    <!-- row-click：点击某一行 -->
    <el-table empty-text="Data loading..." stripe class="tables" :data="props.musicList" style="width:100%"
      :row-class-name="tableRowClassName" @row-click="getId">
      <!-- 编号 -->
      <el-table-column type="index" label="编号" width="70" />
      <!-- 下载按钮 -->
      <el-table-column label="下载" width="70">
        <span class="iconfont icon-xiazai1"></span>
      </el-table-column>
      <!-- 头像 -->
      <el-table-column prop="al.picUrl" label="头像" width="100">
        <template #default="scope">
          <img :src="scope.row.al.picUrl" alt="" width="30" height="30" style="margin-top:10px;">
        </template>
      </el-table-column>
      <!-- 音乐标题 -->
      <el-table-column prop="name" label="音乐标题" />
      <!-- 歌手名字 -->
      <el-table-column prop="ar[0].name" label="歌手" width="220" />
      <!-- 专辑名字 -->
      <el-table-column prop="al.name" label="专辑" width="240" />
      <!-- 歌曲时长 -->
      <el-table-column prop="dt" :formatter="formatter" label="时长" width="180" />
    </el-table>
    <!-- 评论分页器 -->
    <div class="comment-pagination" v-if="isShow">
      <el-pagination hide-on-single-page @current-change="currentChange" @prev-click="prevClick" @next-click="nextClick"
        :page-size="pageSize" small background layout="prev, pager, next" :total="searchStore.songCount" class="mt-4" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, computed, nextTick, watch, defineEmits } from 'vue';
import { useAudioStore } from '@/store/audio'
import { musicUrl, newMusicUrl } from '@/api/audio'
import { keywordsSearch } from '@/api/search'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useSearchStore } from '@/store/search';
import { download } from '@/utils/downloadMusic';
import { time } from '@/utils/time';
import playMusicDetailList from '@/hooks/playMusicDetailList';

const audioStore = useAudioStore()
const searchStore = useSearchStore()
const route = useRoute()

// 定义发射给父组件的方法
// const emits = defineEmits(['getCount'])

// onMounted(() => {
//   // 将总共获取的歌曲数量发送给父组件
//   emits('getCount', '李佳怡')
// })

// 定义哪些路由组件不需要展示分页器
const noPagination = ['musicDetail', 'album', 'dayrecommend']

// 分页器是否隐藏（从推荐歌单点进来的需要隐藏）
let isShow = ref(true)
// 当前哪个路由组件
const routeName = route.matched[1].name

// console.log(routeName, noPagination.indexOf(routeName), noPagination.indexOf(routeName) !== -1)

// 推荐歌单音乐详情
if (noPagination.indexOf(routeName) !== -1) {
  isShow.value = false
} else {
  isShow.value = true
}

// 拿到传来的音乐列表数据
const props = defineProps(['musicList', 'musicApp'])


function tableRowClassName({ row, rowIndex }) {
  // 把当前行的index赋值给rowIndex
  row.index = rowIndex

  // 给当前播放的音乐添加样式
  if (row.id === audioStore.id) {
    return 'click'
  }
}

// 获取当前行的id，并发请求
const getId = async (row, column, event) => {
  // 播放当前详情列表的全部音乐
  playMusicDetailList(undefined, props.musicApp)

  // 当前列表索引应该和audio（pinia）中的index一致（点击当前行，将当前行索引交给audio（pinia）中的index）
  // console.log(row.index)
  audioStore.index = row.index

  const downloads = event.target.className

  // 点击某一行音乐，获取某一行音乐的数据（下载和播放是都需要该数据，所以我放在最外面发请求的，本来没有下载处理函数的话，就写到else就行）
  // 发请求根据当前行的id拿到相应音乐数据
  const { data } = await musicUrl(row.id)
  // const { data } = await newMusicUrl(row.id, 'exhigh')
  // console.log('新版音乐URL:无质', data)
  if (downloads == 'iconfont icon-xiazai1') {
    // 下载音乐，传入音乐名，和音乐url地址即可
    download(row.name, data.data[0].url)
  } else {
    // 播放音乐时才发请求，播放音乐
    // console.log('播放音乐')
    // console.log(row.id) // 拿到当前行的音乐id

    // 如果音乐src存在
    if (data.data[0].url) {
      // console.log('歌曲url：',data.data[0].url)

      // 点击后当前行后，获取当前行的音乐信息（这里是整理好的后再存到pinia中）
      let oneMusicInfo = {
        // 音乐ID
        id: row.id,
        // 歌曲名
        musicName: row.name,
        // 歌曲音乐人
        musicSinger: row.ar[0].name,
        // 歌曲logo
        logo: row.al.picUrl,
        // 歌曲url
        url: data.data[0].url,
        // 歌曲时长
        time: data.data[0].time,
        // 歌曲的大小
        size: data.data[0].size
      }

      // 存储当前点击的音乐id
      audioStore.getId(row.id)

      // 把歌曲url存到批念中前要判断（如果存的跟以前pinia中的url一样就不需要在存一份）
      audioStore.updataMusic(oneMusicInfo)


      // 每点一首歌修改是否暂停（因为每点一次音乐肯定是播放的，所以应该传true）
      audioStore.updataIsPlay(true)

      // 处理当前点击的音乐
      const id = audioStore.id
      // 所有歌曲数据的集合
      const musicListInfo = audioStore.musicListInfo

      // musicListInfo.map((item) => {
      //   return item.id !== id
      // })

      // 一首歌数据 
      const song = musicListInfo


      // audio音乐的数据（歌曲读取的数据）
      // audioStore.updataMusic(song)

    } else if ((data.data[0].time <= 31000)) {
      // 音乐只有30秒（收费的）
      ElMessage.error('该音乐需要VIP即可享受完整版，正在播放试听版！')
    } else {
      // 没有src
      ElMessage.error('该音乐版权已丢失，无法播放！')
    }
  }
}

// 当前页面路由参数（当页面停留在搜索结果页面，用户导致浏览器刷新，还会跟用户路由参数keyword进行获取数据）
const key = computed(() => {
  return route.params.keyword
})
// 音乐分页
const getMusicList = async (keyword, limit, offset) => {
  const res = await keywordsSearch(keyword, limit, offset)
  searchStore.updataMusicList(res.data.result)


  // 更新条目数
  searchStore.updataSongCount(res.data.result?.songCount)
}

// num实参就是当前是哪一页
const currentChange = (num) => {
  // 之所以需要当前页码减去1，是因为接口的数据是从0开始的，0就是第一页
  getMusicList(searchStore.keyword, searchStore.getDataCount, (num - 1) * searchStore.getDataCount)
  // console.log(searchStore.keyword)
}
const prevClick = (num) => {
  getMusicList(searchStore.keyword, searchStore.getDataCount, (num - 1) * searchStore.getDataCount)
}
const nextClick = (num) => {
  getMusicList(searchStore.keyword, searchStore.getDataCount, (num - 1) * searchStore.getDataCount)
}

// 假如页面一加载是搜索页面，但搜索框没有内容，就默认给个值请求数据
onMounted(() => {
  if (!searchStore.keyword) {
    getMusicList(route.params.keyword, searchStore.getDataCount, 0)
  } else {
    getMusicList(searchStore.keyword, searchStore.getDataCount, 0)
  }
})

// 对音乐时长进行一下格式
const formatter = (row, column, cellValue, index) => {
  return time('end', row.dt)
}

// 路由跳转前修改值
onBeforeRouteLeave(() => {
  audioStore.yes = true
})


// 动态添加每一页的条数
const pageSize = computed(() => {
  return searchStore.songCount / (searchStore.songCount / searchStore.getDataCount)
})

// 算出音乐编号（页码数 * 每页条数 - 每页条数）
const musicNumber = (pageNumber, pageSize) => {
  return pageNumber * pageSize - pageSize
}
</script>

<script>
export default {
  name: 'MusicList'
}
</script>
1
<style lang="scss" scoped>
.main {
  width: 100%;

  ::v-deep .el-table {
    // 表格宽度最小1040px
    min-width: 1040px;
    cursor: pointer;
    color: var(--c);

    .el-table__inner-wrapper {

      // 表格头部
      .el-table__header-wrapper {
        table {
          thead {
            tr {
              th {
                background-color: var(--bgc);
              }
            }
          }
        }
      }

      // 表格内容
      .el-table__body-wrapper {
        .el-scrollbar {
          .el-scrollbar__wrap {
            .el-scrollbar__view {
              .el-table__body {
                tbody {

                  tr {
                    background-color: var(--bgc);

                    td {
                      background-color: var(--bgc);

                      div {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      }
                    }

                    // 点击某一项时，添加对应样式
                    &:hover {
                      color: var(--home-menu);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  // 评论分页器
  ::v-deep .comment-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0px;
    margin-bottom: 140px;

    div {

      button {
        width: 40px;
        height: 40px;

      }

      ul {
        li {
          width: 40px;
          height: 40px;
          font-size: 20px;

        }

        .is-active {
          background-color: #ed5050;
        }
      }
    }
  }
}

// 点击某一项后，添加样式
::v-deep .el-table .click {
  color: var(--home-menu);
}
</style>