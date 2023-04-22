<template>
  <div class="main">
    <h1 class="setting">设置中心</h1>
    <div class="font_family">
      <div class="key">
        <h1>字体</h1>
      </div>
      <div class="value">
        <!-- default-first-option：默认第一项是选中状态 -->
        <el-select filterable reserve-keyword allow-create default-first-option @change="handleSelect(value)"
          v-model="value" class="m-2" placeholder="默认字体">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import font1 from '@/assets/letterform/font01.ttf'
import font2 from '@/assets/letterform/font02.ttf'
import font3 from '@/assets/letterform/font03.ttf'
import font4 from '@/assets/letterform/font04.ttf'
import font5 from '@/assets/letterform/font05.ttf'
import { changeFontFamily } from '@/utils/setFontFamily'
import { ElMessage } from 'element-plus'

const value = ref('思源柔黑等宽(默认)')

const options = [
  {
    value: 'font5',
    label: '思源柔黑等宽(默认)',
  },
  {
    value: 'font1',
    label: '思源黑体 Regular',
  },
  {
    value: 'font2',
    label: '思源黑体旧字形',
  },
  {
    value: 'font3',
    label: '思源黑体旧字形',
  },
  {
    value: 'font4',
    label: '思源黑体TC-ExtraLight',
  }
]

// 字体选择处理函数
const handleSelect = (value) => {
  if (value === 'font1') {
    changeFontFamily(font1)
  } else if (value === 'font2') {
    changeFontFamily(font2)
  } else if (value === 'font3') {
    changeFontFamily(font3)
  } else if (value === 'font4') {
    changeFontFamily(font4)
  } else if (value === 'font5') {
    changeFontFamily(font5)
  }

  if (value === 'font5') {
    ElMessage.success('默认字体设置成功')
  } else {
    ElMessage.success('字体设置成功')
  }
}
</script>
<script>
export default {
  name: 'Set'
}
</script>

<style lang="scss" scoped>
.main {
  width: 1080px;
  margin: 0 auto;

  .setting {
    width: 100%;
    margin-bottom: 20px;
    font-size: 35px;
    font-family: '';
    color: var(--c);
  }

  .font_family {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: baseline;
    // border: 1px solid red;

    .key {
      color: var(--c);
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 1px solid green;
      flex: 1;
      padding-right: 200px;
    }

    .value {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // border: 1px solid rgb(128, 15, 0);
    }
  }
}
</style>