import request from "@/utils/request";
import { getItem } from "@/utils/localStorage";

/**
 * 音频相关api
*/

// 获取歌曲url
export const musicUrl = (id) => {
  return request({
    method: 'GET',
    url: `/song/url?id=${id}&cookie=${getItem('token')}&timestamp=${Date.now()}`
  })
}

// 获取歌曲url——新版
// level：播放音质等级
/**
 * 参数：standard => 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res
*/
// md，测试了一下跟原版没啥区别，数据都一样，还提高音质(可笑)
export const newMusicUrl = (id, level) => {
  return request({
    method: 'GET',
    url: `/song/url/v1?id=${id}&level=${level}&cookie=${getItem('token')}&timestamp=${Date.now()}`
  })
}

// 获取歌曲详细信息
export const musicDetailInfo = (id) => {
  return request({
    method: 'GET',
    url: `/song/detail?ids=${id}&cookie=${getItem('token')}`
  })
}

// 获取音乐歌词
export const getMusicLyrics = (id) => {
  return request({
    method: 'GET',
    url: `/lyric?id=${id}`
  })
}

// 歌曲评论（做少20条）
export const getMusicComment = (id, limit = 20, offset = 0) => {
  return request({
    method: 'GET',
    url: `/comment/music?id=${id}&limit=${limit}&offset=${offset}`
  })
}