import dayjs from "dayjs"

// const time = 1673931337183
const time = Date.now()

const result = dayjs(time).format('YYYY-MM-DD')

// console.log(result)

// 1.传入时间戳，返回相应时间-->2023-01-27
export const getDay = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD')
}


