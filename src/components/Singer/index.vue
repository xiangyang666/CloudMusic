<template>
  <div class="main">
    <!-- 标签容器 -->
    <div class="label">
      <!-- 语种： -->
      <div class="languages box">
        <div class="text">语种：</div>
        <div class="option">
          <div :class="item == languages ? 'active' : ''" @click="changeLabel(item, classify, sift)"
            v-for="(item, index) in languageList" :key="index">{{ item }}</div>
        </div>
      </div>
      <!-- 分类 -->
      <div class="classify box">
        <div class="text">分类：</div>
        <div class="option">
          <div :class="item == classify ? 'active' : ''" @click="changeLabel(languages, item, sift)"
            v-for="(item, index) in classifyList" :key="index">{{ item }}</div>
        </div>
      </div>
      <!-- 筛选 -->
      <div class="sift box">
        <div class="text">筛选：</div>
        <div class="option">
          <div :class="item == sift ? 'active' : ''" @click="changeLabel(languages, classify, item)"
            v-for="(item, index) in siftList" :key="index">{{ item }}</div>
        </div>
      </div>
    </div>

    <div class="singer">
      <ul>
        <li @click="goSingerDetail(item.id)" v-for="(item, index) in singerData.data" :key="index">
          <!-- <img width="200" :src="item.img1v1Url"> -->
          <div class="imgBox">
            <img :src="item.picUrl">
          </div>
          <h1>{{ item.name }}</h1>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { singerList, singerClassify } from '@/api/singer'

const router = useRouter()

const languageList = reactive(['全部', '华语', '欧美', '日本', '韩国', '其他'])
const classifyList = reactive(['全部', '男歌手', '女歌手', '乐队'])
const siftList = reactive(['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'])


// 语种
const languages = ref('全部')
// 分类
const classify = ref('全部')
// 筛选
const sift = ref('热门')

const singerData = reactive({
  data: []
})
onMounted(() => {
  app(classify.value, languages.value, sift.value)
})
async function app(type, area, initial) {
  if (type == '全部') {
    type = -1
  } else if (type == '男歌手') {
    type = 1
  } else if (type == '女歌手') {
    type = 2
  } else if (type == '乐队') {
    type = 3
  }

  if (area == '全部') {
    area = -1
  } else if (area == '华语') {
    area = 7
  } else if (area == '欧美') {
    area = 96
  } else if (area == '日本') {
    area = 8
  } else if (area == '韩国') {
    area = 16
  } else if (area == '其他') {
    area = 0
  }

  if (initial == '热门') {
    initial = -1
  } else if (initial == '#') {
    initial = 0
  }

  const { data } = await singerClassify(type, area, initial)
  console.log(data)
  singerData.data = data.artists
}

// 改变标签内容，获取不同的数据
const changeLabel = (area, type, initial) => {
  languages.value = area
  classify.value = type
  sift.value = initial
  console.log(area, type, initial)

  app(classify.value, languages.value, sift.value)
}

// 去歌手详情页
const goSingerDetail = (id) => {
  router.push({
    name: 'singerdetail',
    params: {
      id
    }
  })
}
</script>
<script>
export default {
  name: 'Singer'
}
</script>

<style lang="scss" scoped>
.main {
  max-width: 1280px;
  min-width: 980px;
  margin: 0 auto;

  .label {
    width: 100%;
    font-size: 18px;

    .box {
      display: flex;
      margin-bottom: 15px;

      .text {
        margin-right: 10px;
        color: var(--c);
      }

      .option {
        display: flex;
        flex-wrap: wrap;

        div {
          width: 60px;
          margin-right: 10px;
          text-align: center;
          color: var(--c);
          cursor: pointer;
          height: 25px;
          border-radius: 20px;
          line-height: 25px;
        }
      }
    }

    .sift {
      .text {
        min-width: 54px;
      }

      .option {

        div {
          margin-bottom: 10px;
          height: 25px;
          border-radius: 20px;
          line-height: 25px;
        }
      }
    }
  }

  .singer {
    width: 100%;

    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 17.5%;
        margin: 10px 2.5% 40px 0;
        cursor: pointer;
        overflow: hidden;


        &:hover {
          h1 {
            color: var(--tc);
          }
        }


        .imgBox {
          border-radius: 20px;
          overflow: hidden;

          img {
            width: 120%;

          }
        }


        h1 {
          margin-top: 5px;
          color: var(--c);
          transition: all .5s;
        }
      }
    }
  }
}

.active {
  background-color: var(--label-color);
  color: var(--tc) !important;
}
</style>