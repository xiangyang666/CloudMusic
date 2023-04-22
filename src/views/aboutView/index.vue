<template>
  <div class="main">
    <div class="about_box">
      <h1 class="about_text">关于我们</h1>
    </div>
    <div class="container">
      <p>个人博客：<a target="_blank" href="https://xiangyang666.gitee.io/vuepress/"
          class="vuepress">https://xiangyang666.gitee.io/vuepress/</a></p>
      <p>本人还只是名高三在校生，做这个项目只是玩玩而已。</p>
      <p>本项目数据/及图片接口,由一个开源的项目（网易云音乐NodeJs版 API）提供。本项目界面借鉴了PC端网易云音乐桌面端。</p>
      <p>本站仅提供音视频播放等功能，不拥有所有权，不承担相关法律的内容。如发现本站涉及侵权/违法违规的行为，请发送邮箱至<a class="email">1524187180@qq.com</a>,本人收到邮箱后会第一时间进行处理。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(0)
const value2 = ref(0)
const value3 = ref(0)
const value4 = ref(0)
</script>

<script>
export default {
  name: ''
}
</script>

<style lang="scss" scoped>
.main {
  .about_box {
    filter: contrast(30);
    text-align: center;

    h1 {
      color: var(--c);
      font-size: 35px;

      margin-top: 30px;
      font-family: "";
      animation: about_text 1s forwards;
    }
  }

  @keyframes about_text {
    0% {
      letter-spacing: -25px;
      filter: blur(10px);
    }

    100% {
      letter-spacing: 10px;
      filter: blur(0);
    }
  }


  .container {
    width: 80%;
    height: auto;
    margin: 0 auto;
    margin-top: 65px;

    p {
      color: var(--c);
      font-size: 22px;
      margin-bottom: 10px;
      line-height: 30px;
      font-family: "";

      .vuepress,
      .email {
        color: red;
        text-decoration: underline;
      }

      .vuepress:hover {}
    }

    p::before {
      content: '';
      display: inline-block;
      width: 24px;
      height: 20px;
      color: red;
    }

    .email {
      color: var(--about-email-color);
      cursor: pointer;
    }
  }
}
</style>