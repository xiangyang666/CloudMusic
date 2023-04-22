<template>
  <!-- 音乐列表的抽屉 -->
  <el-drawer class="music-drawer" v-model="store.drawer" :with-header="false">
    <!-- 因为这里首次加载网站，音乐列表中有一个空对象，如果这里不处理页面首次加载列表length显示就会出现是1 -->
    <span class="length">
      您添加了<p class="music-length">{{ store.musicListInfo.length }}</p>首音乐
    </span>
    <hr />
    <!-- 歌单里没有歌曲时，空状态 -->
    <div v-if="!store.musicListInfo.length">
      <el-empty description="快去添加自己喜欢的歌曲吧！" />
    </div>
    <!-- 歌曲列表 -->
    <ul v-else>
      <template v-for="(item, index) in store.musicListInfo" :key="index">
        <!-- 因为第一个音乐对象是空的，所以索引为0的不渲染到页面上，为什么是空的呢，因为audio组件在页面初始化的时候就需要读取musicListInfo
        里的数据，所以为空，如果在这里不处理，就要在audio组件中处理，那样会很麻烦的，所以简单的就在这渲染的时候一处理就好了!!! -->
        <li @click="updataAudioUrl(item.id, index)">
          <!-- logo -->
          <img class="logo" :src="item.logo" alt="">
          <!-- 歌名 -->
          <p>{{ item.musicName }}</p>
          <!-- 歌手 -->
          <!-- <p>{{ item.musicSinger }}</p> -->
          <!-- 时长 -->
          <p>{{ time('end', item.time) }}</p>
        </li>
      </template>
    </ul>
  </el-drawer>
</template>

<script setup>
import { nextTick, computed, ref } from 'vue'
import { useAudioStore } from '@/store/audio'
import { time } from '@/utils/time';
import { musicUrl, getMusicLyrics, getMusicComment } from '@/api/audio'

const store = useAudioStore()


let audio = document.querySelector('audio')
// 点击音乐列表播放音乐
const updataAudioUrl = async (id, index) => {
  let musicApp = store.musicListInfo.filter((item) => {
    return item.id === id
  })

  store.updataMusic(musicApp[0])

  // 歌词
  const { data } = await getMusicLyrics(id)
  // 评论
  const comment = await getMusicComment(id)

  // 更新store中的数据
  // 更新歌词抽屉组件歌词
  store.upDataLyricsStr(data.lrc.lyric)
  // 更新歌词抽屉组件评论
  store.upDataMusicComment(comment.data.comments)

  // 设置当前播放的是列表中哪一首（修改index）
  store.upDataIndex('random', index)

  // 每点一首歌修改是否暂停（所因为每点一次音乐肯定是播放的，以应该传true）
  // store.updataIsPlay(true)
}

</script>

<style lang="scss" scoped>
.length {
  color: #979595;
}

.music-length {
  display: inline-block;
  color: red;
  margin-left: 10px;
  margin-right: 10px;
}

::v-deep .music-drawer {
  .el-drawer__body {
    background-color: red;
  }
}

.music-drawer {
  background-color: red;
}

::v-deep .el-overlay {
  .el-drawer.rtl {
    .el-id-4748-5 {
      background-color: red;
    }

  }
}

ul {

  li {
    padding: 20px 10px;
    border-bottom: 1px solid #ececec;
    margin-bottom: 5px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      width: 30px;
    }

    p {
      width: 33%;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover {
      background-color: rgb(236, 234, 234);
    }
  }
}
</style>
