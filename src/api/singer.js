import request from "@/utils/request";
import { getItem } from "@/utils/localStorage";
// 歌手榜相关数据

// 歌手分类列表
export const singerClassify = (type, area, initial) => {
  return request({
    method: 'GET',
    url: `/artist/list?type=${type}&area=${area}&initial=${initial}`
  })
}

// 歌手榜
/**
 * type : 地区
      1: 华语
      2: 欧美
      3: 韩国
      4: 日本
*/
export const singerList = (type) => {
  return request({
    method: 'GET',
    url: `/toplist/artist?type=${type}`
  })
}

// 获取歌手详情
export const singerDetail = (id) => {
  return request({
    method: 'GET',
    url: `/artist/detail?id=${id}`
  })
}

// 歌手热门50首歌曲
export const singerHotMusic = (id) => {
  return request({
    method: 'GET',
    url: `/artist/top/song?id=${id}`
  })
}

// 获取歌手专辑
export const singerAllAlbum = (id, limit = 30) => {
  return request({
    method: 'GET',
    url: `/artist/album?id=${id}&limit=${limit}`
  })
}

// 获取专辑内容
export const getAlbumData = (id) => {
  return request({
    method: 'GET',
    url: `/album?id=${id}`
  })
}

// 专辑评论
export const albumComment = (id, limit = 50, offset = 0) => {
  return request({
    method: 'GET',
    url: `/comment/album?id=${id}&limit=${limit}&offset=${offset}`
  })
}

// 获取歌手mv
export const singerMv = (id, limit) => {   // limit：获取多少条数据
  return request({
    method: 'GET',
    url: `/artist/mv?id=${id}&limit=${limit}`
  })
}


// 获取歌手详情
export const singerInfoDetil = (id) => {
  return request({
    method: 'GET',
    url: `/artist/detail?id=${id}`
  })
}