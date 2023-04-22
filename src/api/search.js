import request from "@/utils/request";

/**
 * 搜索模块
*/

// 热搜列表
export const hotSearch = () => {
  return request({
    method: "GET",
    url: `/search/hot/detail`,
  });
}

// 关键词搜索页面
/*
  type: 搜索类型；默认为 1 即单曲 , 取值意义 : 
  1: 单曲, 
  10: 专辑, 
  100: 歌手, 
  1000: 歌单, 
  1002: 用户, 
  1004: MV, 
  1006: 歌词, 
  1009: 电台, 
  1014: 视频, 
  1018:综合, 
  2000:声音(搜索声音返回字段格式会不一样)
*/
export const keywordsSearch = (keyword, limit = 20, offset = 0, type = 1) => {
  return request({
    method: "GET",
    url: `/cloudsearch?keywords=${keyword}&type=${type}&limit=${limit}&offset=${offset}&timestamp=${Date.now()}`,
  });
}

// 默认搜索关键词
export const defaultKeyword = () => {
  return request({
    method: 'GET',
    url: '/search/default'
  })
}

// 搜索建议(传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单信息)
export const searchAdvise = (keyword) => {
  return request({
    method: 'GET',
    url: `/search/suggest?keywords=${keyword}`
  })
}