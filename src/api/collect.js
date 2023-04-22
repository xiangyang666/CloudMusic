import request from "@/utils/request";
import { getItem } from "@/utils/localStorage";

// 收藏相关api接口封装


// 收藏的歌手列表
export const collectSingerList = () => {
  return request({
    method: 'GET',
    url: `/artist/sublist?&cookie=${getItem('token')}`
  })
}

// 收藏的视频列表
export const collectVideoList = () => {
  return request({
    method: 'GET',
    url: `/mv/sublist?&cookie=${getItem('token')}`
  })
}

// 获取已收藏专辑列表
export const collectAlbumList = (limti = 20, offset = 0) => {
  return request({
    method: 'GET',
    url: `/album/sublist?limit=${limti}&offset=${offset}&cookie=${getItem('token')}`
  })
}
