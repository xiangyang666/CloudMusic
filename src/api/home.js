import request from "@/utils/request";
import { getItem } from "@/utils/localStorage";
// 首页相关接口数据

// 获取轮播图图片
// 参数1：类型 0：pc 1：android 2：iphone 3：ipad
export const getRecommendList = (type) => {
  return request({
    method: 'GET',
    url: `/banner?type=${type}&timestamp=${Date.now()}`
  })
}


// 获取推荐歌单
export const recommendMusicList = (count) => {
  return request({
    method: 'GET',
    url: `/personalized?limit=${count}&timestamp=${Date.now()}`
  })
}

// 获取歌单详情
export const musicDetail = (id) => {
  return request({
    method: 'GET',
    url: `/playlist/detail?id=${id}&timestamp=${Date.now()}`
  })
}

// 获取歌单评论
export const getMusicCommentList = (id, limit = 50, offset = 0) => {
  return request({
    method: 'GET',
    url: `/comment/playlist?id=${id}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`
  })
}

// 获取歌单收藏者
export const getMusicCollector = (id, limit = 50, offset = 0) => {
  return request({
    method: 'GET',
    url: `/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`
  })
}

// 获取用户详情
export const personalInfo = (id) => {
  return request({
    method: "GET",
    url: `/user/detail?uid=${id}&timestamp=${Date.now()}`,
  });
}

// 获取用户歌单
export const personalMusicList = (id) => {
  return request({
    method: "GET",
    url: `/user/playlist?uid=${id}&timestamp=${Date.now()}`,
  });
}

// 每日推荐歌曲
export const dayRecommend = () => {
  return request({
    method: 'GET',
    url: `/recommend/songs?cookie=${getItem('token')}`
  })
}




