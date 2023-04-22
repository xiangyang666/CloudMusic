// 配置请参考vue-cli官方文档 https://cli.vuejs.org/zh/
const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint代码检查
  lintOnSave: false,
  // 配置elementPlus
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      new NodePolyfillPlugin(),
    ],
  },
  // 基本路径，相对路径
  publicPath: "./",
  // 输出文件目录
  // outputDir: './dist',
  devServer: {
    allowedHosts: [".natappfee.cc"], // 域名
    host: "localhost",
    proxy: {
      "/api": {
        target: "https://v.api.aa1.cn",
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          "^/api": "", // 重写请求
        },
      },
    },
  },
  // 配置scss文件全局变量
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/styles/theme.scss` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: '@import "@/styles/theme.scss"',
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        additionalData: `@import "@/styles/theme.scss";`,
      },
    },
  },
});
