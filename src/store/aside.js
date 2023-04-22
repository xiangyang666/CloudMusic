import { defineStore } from "pinia";
import { getItem, setItem } from "@/utils/localStorage";

export const useAsideStore = defineStore('asideMain', {
  state: () => {
    return {
      // 首页侧边栏是否折叠
      isCollapse: getItem('isCollapse'),  // false：不折叠  true：折叠
      // 侧边栏哪一项添加高亮
      activeIndex: getItem('activeIndex') || '1'
    }
  },
  actions: {
    // 修改侧边栏状态
    updataIsCollapse() {
      this.isCollapse = !this.isCollapse
      setItem('isCollapse', this.isCollapse)
    },
    updataActiveIndex(index) {
      this.activeIndex = index
      setItem('activeIndex', this.activeIndex)
    }
  },
  getters: {

  }
})