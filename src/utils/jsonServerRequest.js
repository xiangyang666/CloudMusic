import axios from 'axios'

const jsonServer = axios.create({
  baseURL: 'http://localhost:3006',
  timeout: 5000
})

jsonServer.interceptors.request.use((config) => {
  return config
}, (err) => {
  return Promise.reject(new Error('数据请求失败！'))
})

jsonServer.interceptors.response.use((response) => {
  try {
    return response
  } catch {
    return Promise.reject(new Error('数据响应失败！'))
  }
})

export default jsonServer