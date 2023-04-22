import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// 引入css文件
import "@/styles/index.css";
// 禁用控制台（默认生产模式打不开）
import "@/utils/disableLog";
import "@/styles/element-plus.scss";

// 格式化时间
// import '@/utils/day'

createApp(App).use(createPinia()).use(router).mount("#app");
