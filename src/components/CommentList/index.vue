<template>
  <div class="music-list">
    <div class="comment-item" v-for="(item, index) in commentList" :key="index">
      <!-- 评论的信息 -->
      <div class="left">
        <div class="user-logo">
          <img @click="goCommentUserPage(item.user.userId)" width="70" :src="item.user.avatarUrl" alt="" />
        </div>
        <div class="user-comment-info">
          <div class="user-name">
            <span @click="goCommentUserPage(item.user.userId)">{{ item.user?.nickname }}：</span>
            <span>{{ item?.content }}</span>
          </div>
          <div class="app">
            <div class="create-time"><span>ip属地:{{ item.ipLocation.location ? item.ipLocation.location : '未知'
            }}</span><span>{{ item.timeStr }}</span></div>
            <!-- 点赞转发评论之类的 -->
            <div class="right">
              <p><span class="iconfont icon-dianzan"></span>点赞</p>
              <p><span class="iconfont icon-wenben"></span>评论</p>
              <p><span class="iconfont icon-zhuanfa"></span>转发</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useAudioStore } from '@/store/audio'

const router = useRouter()
const audioStore = useAudioStore()

// 接受父组件传过来的评论列表
const props = defineProps({
  commentList: {
    type: Array,
    required: true,
    default: []
  }
})


// 去评论用户的详情页面
const goCommentUserPage = (id) => {
  router.push({
    name: 'personal',
    params: {
      id
    }
  })
  // 然后关闭歌词抽屉组件
  audioStore.updataLyrics(false)
}

</script>
<script>
export default {
  name: 'CommentList'
}
</script>

<style lang="scss" scoped>
.music-list {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 50px;

  // 评论
  .splendid-comment {
    font-size: 30px;
    margin-bottom: 30px;
  }

  .comment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    border-bottom: 1px solid var(--comment-bottom-color);
    margin-bottom: 20px;
    color: var(--c);

    .left {
      width: 100%;
      display: flex;
      margin-bottom: 30px;

      .user-logo {
        img {
          border-radius: 50%;
          cursor: pointer;
        }
      }

      .user-comment-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 30px;

        .user-name {
          margin-bottom: 10px;

          span:first-child {
            color: red;
            font-size: 20px;
            cursor: pointer;
          }

          span:last-child {
            font-family: '';
            line-height: 25px;
          }
        }

        .app {
          width: 100%;
          display: flex;

          justify-content: space-between;

          .create-time {
            span {
              color: var(--c);
              font-size: 20px;
              margin-right: 20px;
            }
          }

          .right {
            width: 200px;
            display: flex;
            justify-content: space-between;
            padding: 0px 10px;

            p,
            span {
              cursor: pointer;
              color: var(--c);
            }

            p:hover {
              span {
                color: var(--tc);
              }

              color: var(--tc);
            }

            .bottom {
              display: flex;
              justify-content: space-between;

              .handle {
                display: flex;
              }
            }
          }
        }

      }
    }


  }

  // 收藏者
  .collector-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .collector-item {
      height: 100px;
      width: 400px;
      margin-top: 50px;
      border-radius: 10px;
      display: flex;
      // margin-left:50px;
      padding: 10px 20px;

      &:hover {
        background-color: #f2f2f2;
        cursor: pointer;
      }

      img {
        // width: 100px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .collector-info {
        p:first-child {
          font-size: 25px;
        }

        p:last-child {
          font-family: '';
          font-size: 16px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          margin-top: 10px;
          color: #9c9c9c;
        }
      }
    }
  }

}
</style>