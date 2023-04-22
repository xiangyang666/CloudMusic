# 网易云音乐笔 app 笔记

## 1. 安装 element-plus，并配置文件，组件中使用

参考：https://element-plus.gitee.io/zh-CN/guide/installation.html

1. 安装

```bash
npm install element-plus --save
```

2. 按需导入（自动导入）---推荐（不推荐直接引入方式）

```js
npm install -D unplugin-vue-components unplugin-auto-import
```

```js
// 配置文件
以Webpack项目为例;
// vue.config.js中
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = {
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
};
```

3. 在组件中使用

```js
<template>
  <el-row class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </el-row>
</template>

<script setup>
</script>

<style lang="scss" scoped>
</style>
```
