// 登录页面的请求模块

import request from '@/utils/request'

/**
 * 手机号登录
 *  参数1：手机号
 *  参数2：密码
*/
export const phoneLogin = (params) => {
  return request({
    method: 'GET',
    url: '/login/cellphone',
    params,
    withCredentials: true
  })
}

/**
 * 验证码登录
 * 参数1：手机号
*/
export const codeLogin = (params) => {
  return request({
    method: 'GET',
    url: '/captcha/sent',
    params
  })
}

/**
 * 验证用户输入的验证码是否正确
 * 参数1：手机号
 * 参数2：验证码（用户手机里接受的）
*/
export const regCode = (params) => {
  return request({
    method: 'GET',
    url: '/captcha/verify',
    params
  })
}

// 登录状态
export const getLoginStatus = () => {
  return request({
    method: 'GET',
    url: '/login/status'
  })
}

// 退出登录
export const logoutApi = () => {
  return request({
    method: 'GET',
    url: '/logout'
  })
}

// 刷新登录
export const refreshLogin = () => {
  return request({
    method: 'GET',
    url: '/login/refresh'
  })
}

/**
 * 二维码登录
 * 说明：二维码登录涉及到 3 个接口,调用务必带上时间戳,防止缓存
*/
// 1. 先生成key
export const getKey = () => {
  return request({
    method: 'GET',
    url: `/login/qr/key?timestamp=${Date.now()}`,
  })
}

// 2. 二维码生成
export const qrcodeCreate = (key) => {
  return request({
    method: 'GET',
    // url: `/login/qr/create?key=${key}&timerstamp=${}`
    url: '/login/qr/create',
    params: {
      key,
      qrimg: true,
      timerstamp: Date.now()
    }
  })
}

// 3. 检测二维码扫码的状态
export const testQrcodeStatus = (key) => {
  return request({
    method: 'GET',
    url: `/login/qr/check?key=${key}&timerstamp=${Date.now()}`
  })
}