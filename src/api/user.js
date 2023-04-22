/**
 * 用户信息相关模块
*/
import axios from "axios"
import request from "@/utils/request"
import { getItem } from "@/utils/localStorage"

// 免费的HTTP接口代理，可解决跨域问题
// https://bird.ioliu.cn/v2/?url=请求的地址
// url后面拼接你想要跨域的链接就OK了

// 获取用户当前归属地IP地址
export const userIp = (ip) => {
  return axios({
    method: 'GET',
    url: `https://bird.ioliu.cn/v2/?url=http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`
  })
}

// 退出登录
export const logoutApi = () => {
  return request({
    method: 'GET',
    url: '/logout'
  })
}

// 获取账号登录状态
export const loginStatus = () => {
  return request({
    method: 'GET',
    url: `/login/status?cookie=${getItem('token')}`
  })
}

// 获取账号信息
export const userAccount = () => {
  return request({
    method: 'GET',
    url: `/user/account?cookie=${getItem('token')}`
  })
}

// 获取用户歌单
export const getUserSongs = (userId) => {
  return request({
    method: 'GET',
    url: `/user/playlist?uid=${userId}`
  })
}

// 获取歌单所有歌曲
export const getSongAllMusic = (id) => {
  return request({
    method: 'GET',
    url: `/playlist/detail?id=${id}&cookie=${getItem('token')}`
  })
}

// 获取用户信息 , 歌单，收藏，mv, dj 数量
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: `/user/subcount?&cookie=${getItem('token')}`
  })
}

// 喜欢音乐
export const userLikeMusic = (id = 347230, like = false) => {
  return request({
    method: 'GET',
    url: `/like?id=${id}&like=${like}&cookie=${getItem('token')}`
  })
}

// 喜欢音乐的列表
export const likeMusicList = (id) => {
  return request({
    method: 'GET',
    url: `/likelist?uid=${id}&cookie=${getItem('token')}`
  })
}

// 获取用户歌单
export const getUserPlayList = (id, limit = 20, offset = 0) => {
  return request({
    method: 'GET',
    url: `/user/playlist?uid=${id}&limit=${limit}&offset=${offset}&cookie=${getItem('token')}`
  })
}