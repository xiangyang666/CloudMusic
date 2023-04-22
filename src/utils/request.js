// 对axios进行二次封装
import axios from "axios";

// 获取当前环境的baseURL
const url = process.env.VUE_APP_BASEURL;
const request = axios.create({
  // // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 这里的baseURL，参考的是---http://www.codeman.ink---感谢https://gitee.com/PengGeee大佬的支持
  // 网易云音乐后台api接口：http://47.93.187.37
  // baseURL: 'http://www.codeman.ink/api',
  // baseURL: 'http://47.93.187.37',
  // baseURL：'https://music.wzzz.fun/api',
  // baseURL：'https://netease-cloud-music-api.fe-mm.com'
  baseURL: url,
  timeout: 5000,
  withCredentials: true, // 需配置为true，使请求体携带cookie
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(new Error("请求失败！"));
  }
);

// 响应拦截器
request.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(new Error("响应错误！"));
});

export default request;
