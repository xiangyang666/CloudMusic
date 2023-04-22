import request from "@/utils/request";
import { getItem } from "@/utils/localStorage";
/**
 * 视频相关api
*/

// 获取视频分类列表
export const videoCategoryList = () => {
  return request({
    method: 'GET',
    url: `/video/category/list?&cookie=${getItem('token')}`
  })
}

// 获取视频标签/分类下的视频
export const videoGroup = (id, offset = 0) => {
  return request({
    method: 'GET',
    url: `/video/group?id=${id}&offset=${offset}&cookie=${getItem('token')}`
  })
}

// 获取视频详情
export const videoDetail = (id) => {
  return request({
    method: 'GET',
    url: `/video/detail?id=${id}&cookie=${getItem('token')}`
  })
}

// 根据id获取视频的url地址
export const videoUrl = (id) => {
  return request({
    method: 'GET',
    url: `/video/url?id=${id}&cookie=${getItem('token')}`
  })
}

// 视频的相关视频
export const aboutAllVideo = (id) => {
  return request({
    method: 'GET',
    url: `/related/allvideo?id=${id}&cookie${getItem('token')}`
  })
}

// 获取视频评论
export const videoComment = (id, offset = 0) => {
  return request({
    method: 'GET',
    url: `/comment/video?id=${id}&offset=${offset}&cookie=${getItem('token')}`
  })
}
// export const videoComment = (type, id, sortType = 3, pageSize, pageNo) => {
//   return request({
//     method: 'GET',
//     url: `/comment/new?type=${type}&id=${id}&sortType=${sortType}&cursor=${Date.now()}&pageSize=${pageSize}&pageNo=${pageNo}`
//   })
// }


// 获取视频标签列表
export const videoGroupList = () => {
  return request({
    method: 'GET',
    url: `/video/group/list?cookie=${getItem('token')}`
  })
}


// *************************************************************************************************************************************************************
// mv相关接口

// 全部mv
/**
 * area：地区
 * type: 类型
 * order: 排序
 * limit：取出数量
 * offset：偏移数量
*/
export const allMv = (area, type, order, limit, offset = 0) => {
  return request({
    method: 'GET',
    url: `/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}&cookie=${getItem('token')}`
  })
}

// 获取mv数据
export const mvDetailData = (id) => {
  return request({
    method: 'GET',
    url: `/mv/detail?mvid=${id}`
  })
}

// mv地址
export const mvUrl = (id) => {
  return request({
    method: 'GET',
    url: `/mv/url?id=${id}`
  })
}

// 相似mv（相关推荐mv）
export const similarMv = (id) => {
  return request({
    method: 'GET',
    url: `/simi/mv?mvid=${id}`
  })
}

// 获取 mv 点赞转发评论数数据
export const mvInfo = (id) => {
  return request({
    method: 'GET',
    url: `/mv/detail/info?mvid=${id}`
  })
}

// 获取mv评论
export const mvComment = (id, limit = 30, offset = 0) => {
  return request({
    method: 'GET',
    url: `/comment/mv?id=${id}&limit=${limit}&offset=${offset}`
  })
}