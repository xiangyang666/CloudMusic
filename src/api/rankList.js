import request from "@/utils/request";
// 排行榜

// 所有榜单
export const allTheList = () => {
  return request({
    method: 'GET',
    url: `/toplist`
  })
}