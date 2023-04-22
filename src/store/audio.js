import { defineStore } from "pinia";

export const useAudioStore = defineStore('audioMain', {
  state: () => {
    return {
      // 音乐的一些信息
      /**
       * {
       *    // 歌曲名
            musicName: row.name,
            // 歌曲音乐人
            musicSinger: row.ar[0].name,
            // 歌曲logo
            logo: row.al.picUrl,
            // 歌曲url
            url: data.data[0].url,
            // 歌曲时长
            time: data.data[0].time,
            // 歌曲的大小
            size: data.data[0].size   
       * }
      */
      //  当前音乐的id
      id: null,
      // 播放当前音乐的当前音乐时间
      currentTime: 0,
      // 当前音乐的相关数据（当前播放的音乐）
      music: {},
      // 在音乐列表中播放的是哪一首音乐（初始化时是第一首）
      index: 0,
      // 音乐是什么播放逻辑（顺序播放列表音乐/随机播放列表音乐/单曲循环播放音乐）
      // 单曲循环：0
      // 顺序播放：1
      // 随机播放：2
      playMock: 1,   // 默认顺序播放
      // 所有音乐列表数据
      musicListInfo: [

      ],
      // 是否播放--因为一打开网站没有音乐，默认暂停，所有为false
      isPlay: false,
      // 音乐列表抽屉
      drawer: false,
      // 音乐歌词抽屉
      lyricsDrawer: false,
      // 歌词数据、评论
      lyricsData: {
        str: '',
        commentList: []
      },
      flag: true,
      // 点击播放全部按钮后改为false，当当前组件路由离开后就改为false了，（yes作用true为播放当前组件的所有音乐，还没有离开当前页面时，修改为false后不再做发请求）
      yes: true
    }
  },
  actions: {
    // 获取当前点击的音乐id
    getId(id) {
      this.id = id
    },
    // 更新单曲音乐数据
    updataMusic(musicObj) {
      this.music = musicObj
    },
    // 更新音乐列表信息
    updataMusicInfo(obj) {
      // 用来标识是否向音乐列表添加音乐 true添加，false不添加
      // let flag = true
      // this.musicListInfo.map((item) => {
      //   // 判断第二次
      //   if (item.musicName === obj.musicName && item.logo === obj.logo && item.musicSinger === obj.musicSinger) {
      //     console.log('音乐列表里已有该音乐！')
      //     flag = false
      //   }
      // })
      // if (flag) {
      this.musicListInfo = obj
      // }
    },
    // 更新音乐是否播放
    updataIsPlay(boolean) {
      this.isPlay = boolean
    },
    // 音乐列表抽屉组件是否显示
    updataDrawer(boolean) {
      this.drawer = boolean
    },
    // 更新歌词抽屉组件是否展开与关闭
    updataLyrics(boolean) {
      this.lyricsDrawer = boolean
    },
    // 更新歌词
    upDataLyricsStr(str) {
      this.lyricsData.str = str
    },
    // 更新歌词评论
    upDataMusicComment(commentList) {
      this.lyricsData.commentList = commentList
    },
    // 
    upDataFlag(boolean) {
      this.flag = boolean
    },
    // 修改当前音乐的播放时间
    upDataCurrentTime(currentTime) {
      this.currentTime = currentTime
    },
    // 上一首or下一首
    upDataIndex(type, num) {
      // console.log('indexType', type)

      const flag = type ? '下一首' : '上一首'
      // console.log(this.musicListInfo)
      // console.log(flag, this.index)

      // 首次加载页面，id为空的话，就不执行上一首或下一首
      if (this.id !== null) {
        // 将audio组件中的播放icon状态设置为播放
        this.updataIsPlay(true)

        // 下一首
        if (type === true) {
          if (this.index >= this.musicListInfo.length - 1) {
            this.index = 0
          } else {
            this.index++
          }
        } else if (type === false) {
          // 上一首
          if (this.index <= 0) {
            this.index = this.musicListInfo.length - 1
          } else {
            this.index--
          }
        } else if (type == 'random') {  // 随机
          this.index = num
        }
      }
    },
    // 修改音乐播放模式
    upDataPlayMock(mode) {

      if (mode === 0) {
        this.playMock = 0
      } else {
        this.playMock++
      }
    }
  },
  getters: {

  }
})