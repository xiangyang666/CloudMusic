<template>
  <div class="container">
    <h1 class="title">{{ isDev }}</h1>
    <div class="addJob">
      <h2 class="title">开发记录</h2>
      <el-input v-model="inputText" type="textarea" placeholder="请将今天对项目的开发描述写下来" />
      <span style="color:var(--c)">请选择一款节点颜色（默认白色）</span>
      <el-color-picker @active-change="activeChange" v-model="color" show-alpha :predefine="predefineColors" />
      <hr />
      <el-button type="primary" @click="handleTimeLine">添加</el-button>
    </div>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in objArr.data" :color="item.color" :timestamp="item.timestamp.toString()"
        :key="item.id" placement="top">
        <el-card>
          <h4>{{ item.text }}</h4>
          <p style="margin-top:20px;">更新于：{{ item.timestamp }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { getTimeline, addTimeline } from '@/api/jsonServer'

const predefineColors = ref([
  'rgba(0, 0, 0, 1)',
  'rgba(200, 198, 198, 1)',
  'rgba(244, 65, 65, 1)',
  'rgba(0, 157, 255, 1)',
  'rgba(0, 255, 47, 1)',
  'rgba(255, 200, 0, 1)',
  '#c71585',
  'rgba(255, 69, 0, 1)',
  'rgb(255, 120, 0)',
])

// input文本框的值
let inputText = ref('')
// 时间线上的节点颜色
let color = ref('')
// 对象数组(时间线上的数据)
let objArr = reactive({
  data: []
})

// 获取数据（页面上的dom元素渲染完毕，获取时间线的数据）
onMounted(async () => {
  TimelineFun()
})
// 封装成方法
async function TimelineFun() {
  const { data } = await getTimeline()
  objArr.data = data.reverse()
}

// 添加数据
const handleTimeLine = () => {
  // 没有值return出去，不执行后面代码
  if (!inputText.value) {
    ElMessage.warning('请在输入框输入内容？')
    return true;
  }
  // 提示
  ElMessage.success('更新一条记录')
  // 更新一条记录
  addTimeline(inputText.value, color.value, dayjs(Date.now()).format('YYYY-MM-DD HH:MM:ss'))
  // 重新获取数据（为了解决更新数据后，页面不更新数据问题）
  setTimeout(() => {
    TimelineFun()
  }, 100)
  // 清空输入框的值
  inputText.value = ''
}

// 只要色彩面板颜色一点击就会执行
const activeChange = (coloring) => {
  color.value = coloring
}

// 时间线数据需要部署到服务器上才行，我没有服务器，所以只能本地运行数据，本地项目才能预览，如果objArr.data的数据为0或空，则返回‘本页数据未开启’，反之
const isDev = computed(() => {
  return objArr.data.length ? '网易云音乐项目开发---时间线' : '本页数据暂不支持开放'
})

</script>
<script>
export default {
  name: ''
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  margin-bottom: 60px;

  .title {
    font-size: 35px;
    color: var(--c);
  }

  .addJob {
    width: 80%;
    margin: 30px 20px;

    .title {
      font-size: 27px;
      color: var(--c);
    }

    .el-button {
      width: 100%;
    }

    ::v-deep .el-textarea {
      width: 100%;
      height: 147px;
      margin: 10px 0;

      .el-textarea__inner {
        height: 100%;
        resize: none;
        font-size: 18px;
      }
    }
  }
}

.el-timeline {
  padding-bottom: 60px;
}
</style>