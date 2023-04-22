import jsonServer from "@/utils/jsonServerRequest";

// 对jsonserver服务进行增删改查

// 获取时间线列表所有的数据
export const getTimeline = () => {
  return jsonServer({
    method: 'GET',
    url: '/timeline'
  })
}

// 添加时间线描述
export const addTimeline = (text, color, timestamp) => {
  return jsonServer({
    method: 'POST',
    url: '/timeline',
    data: {
      text,
      color,
      timestamp
    }
  })
}
