import request from '@/utils/request'
import { getItem } from '@/utils/localStorage'
// 发现音乐中的歌曲页面数据

// 获取歌单分类
export const categoryList = () => {
  return request({
    method: 'GET',
    url: '/playlist/catlist'
  })
}

// 热门歌单分类
export const hotMusicCategory = () => {
  return request({
    method: 'GET',
    url: '/playlist/hot'
  })
}

// 歌单 ( 网友精选碟 )
export const playList = ( cat = '华语', offset = 0) => {
  return request({
    method: 'GET',
    url: `/top/playlist?cat=${cat}&offset=${offset}`
  })
}


// 获取精品歌单
export const highqualityPlaylist = (limit = 1) => {
  return request({
    method: 'GET',
    url: `/top/playlist/highquality?limit=${limit}`
  })
}


// 精品歌单标签列表
export const highqualityMusic = () => {
  return request({
    method: 'GET',
    url: '/playlist/highquality/tags'
  })
}

// 相关歌单推荐
export const relatedPlaylist = (id) => {
  return request({
    method: 'GET',
    url: `/related/playlist?id=${id}`
  })
}