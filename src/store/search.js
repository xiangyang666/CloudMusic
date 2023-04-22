import { defineStore } from 'pinia'
import { setItem, getItem } from '@/utils/localStorage';

export const useSearchStore = defineStore("searchMain", {
  state: () => {
    return {
      // 搜索关键字
      keyword: '',
      // 通过关键字搜索的歌曲列表
      searchMusicList: [],
      // 总共多少曲音乐
      songCount: 0,
      // 每页获取多少条数据
      getDataCount: 20,
      // 当前在哪项tab栏上
      activeTabs: '1',
      // 是否展示搜索容器组件
      isShow: false
    };
  },
  actions: {
    // 修改关键字
    updataKeyword(keyword) {
      this.keyword = keyword
    },
    // 修改歌单
    updataMusicList(musicList) {
      this.searchMusicList = musicList;
    },
    // 更新音乐曲数
    updataSongCount(count) {
      this.songCount = count
    },
    // 修改当前tab栏数值状态
    updataActiveTabs(num) {
      this.activeTabs = num
      // setItem('searchTab', num)
    },
    // 修改当前状态
    updataIsShow(status) {
      this.isShow = status
    }
  },
  getters: {},
});