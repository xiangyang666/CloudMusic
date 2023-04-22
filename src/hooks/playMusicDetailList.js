// 这个hook函数负责‘播放音乐详情的所有歌曲’

import { ref } from 'vue'
import { musicUrl } from '@/api/audio'
import { useAudioStore } from '@/store/audio';

const store = useAudioStore()

// 你不能一直点播放全部那会一直执行for循环里面的代码，一直发请求，会影响性能，消耗资源，这里加以限制
// yes作用，同上（这里拿数据存放到了pinia中了）
let yes = true

// 播放当前详情页的全部音乐
export default async function (e, songsList) {  // e不传代表是直接点击的是播放全部按钮，反之按的是单曲
  // console.log(songsList)
  /** songsList的示例数据
   * [
   *  {name: '若把你', id: 865632948, pst: 0, t: 0, ar: Array(1), …}
   *  {name: '倒数', id: 1299550532, pst: 0, t: 0, ar: Array(1), …}
   *  {name: '带我去找夜生活', id: 1410647903, pst: 0, t: 0, ar: Array(1), …}
   *  {name: '阳光开朗大男孩', id: 1895164923, pst: 0, t: 0, ar: Array(1), …}
   * ]
  */

  // 只有点击播放全部按钮才有提示
  // 提示用户
  if (e) {  // 点击按钮时e才存在，别的元素都是undefined
    ElMessage.success('歌单已全部加入歌曲列表!')
  }

  // 如果为true执行
  if (store.yes) {
    // 改为false(只有true会执行)，下次就不执行了
    store.yes = false  // 只执行一次


    // 歌曲列表
    let obj = []

    for (let i = 0; i < songsList?.length; i++) {
      // 歌曲url之类信息
      let { data } = await musicUrl(songsList[i].id)
      obj.push({
        // 音乐ID
        id: songsList[i].id,
        // 歌曲名
        musicName: songsList[i].name,
        // 歌曲音乐人
        musicSinger: songsList[i].ar[0].name,
        // 歌曲logo
        logo: songsList[i].al?.picUrl,
        // 歌曲url
        url: data.data[0].url,
        // 歌曲时长
        time: data.data[0].time,
        // 歌曲的大小
        size: data.data[0].size
      })

      // 如果单曲音乐数据中已经有了音乐
      if (e) {
        // 这里是执行第一次for循环的时候，就需要给单曲音乐添加数据，不然for循环后才会更新单曲数据（影响用户体验）
        // !i 就是0 ,代表false，因为0以后的都是1，都为true(只想让i为0的时候执行一次代码)
        if (!i) {
          // 点击播放全部，播放音乐列表中的第一首音乐
          store.updataMusic({
            // 音乐ID
            id: songsList[0].id,
            // 歌曲名
            musicName: songsList[0].name,
            // 歌曲音乐人
            musicSinger: songsList[0].ar[0].name,
            // 歌曲logo
            logo: songsList[0].al?.picUrl,
            // 歌曲url
            url: data.data[0].url,
            // 歌曲时长
            time: data.data[0].time,
            // 歌曲的大小
            size: data.data[0].size
          })

          // 更新单曲音乐id
          store.getId(songsList[0].id)
          // 更新audio组件播放图标
          store.updataIsPlay(true)
        }
      }
      // 更新音乐列表数据
      store.updataMusicInfo(obj)

    }
  }
}