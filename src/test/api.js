import request from "@/utils/request";
import { getItem } from "@/utils/localStorage";

// 小爱同学的接口（有跨域问题，所以不能使用）
export const xiaoai = (message) => {
  return request({
    method: "GET",
    url: `https://v.api.aa1.cn/api/api-xiaoai/talk.php?msg=${message}&type=json`,
    // url: `https://v.api.aa1.cn/api/qqimg/index.php?qq=15001904`,
  });
};

// 最近播放 - 播客（接口已失效）
export const podcast = (limit = 100) => {
  return request({
    method: "GET",
    url: `/record/recent/dj?limit=${limit}&cookie=${getItem("token")}`,
  });
};

// 音乐百科 - 简要信息（接口数据错乱，已失效）
export const musicInfo = (id) => {
  return request({
    method: "GET",
    url: `/song/wiki/summary?id=${id}`,
  });
};
