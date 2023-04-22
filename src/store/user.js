import { defineStore } from "pinia";
import { getItem, setItem } from "@/utils/localStorage";

// user相关数据操作
// 命名规范：最好开头是use，结尾是Store
export const useUserStore = defineStore("userMain", {
  // 存储数据地方
  state: () => {
    return {
      // 令牌（有这个才有权限干事情）
      token: getItem("token") || null,
      userInfo: getItem("userInfo") || {},
      // 项目主题（true：白天——false：晚上）
      theme: getItem("theme"),
      // 个人中心侧边栏
      userCenterAside: false,
      // 加载页loading
      loading: true,
      // 返回顶部组件状态
      show: false,
    };
  },
  actions: {
    // 存储token
    updataToken(token) {
      // 1. 将接受的token赋值给state中的token
      this.token = token;
      // 2. 将token存储到本地存储中
      setItem("token", token);
    },
    // 更新用户数据并存储到本地存储中
    updataUserInfo(info) {
      this.userInfo = info;
      setItem("userInfo", info);
    },
    // 切换主题
    updataTheme() {
      this.theme = !this.theme;
      setItem("theme", this.theme);
    },
    // 个人中心侧边栏
    updataCenterAside() {
      this.userCenterAside = !this.userCenterAside;
    },
  },
  getters: {
    // 用户名
    userName() {
      return this.userInfo.nickname;
    },
    // 头像
    userLogo() {
      return this.userInfo.avatarUrl;
    },
  },
});
