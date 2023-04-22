// 本模块封装一些公用方法
/**
 * 防抖: 连续触发事件但在设定的一段时间内只执行最后一次(重新来时)
*/
export const debounce = (fn, delay = 1000) => {
  let timer = null;
  return function () {
    let conText = this,
      args = arguments
    // 执行下一次的函数时,先清空之前的定时器
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(conText, args)
    }, delay)
  }
}

// 获取一个随机数（包含min和max）
export const random = (min, max) => {
  return Math.floor(Math.random() * (parseInt(max) - parseInt(min) - 1)) + parseInt(min)
}

// 处理大于1w的数字
export const handleNum = (num) => {
  if (num >= 10000) {
    num = (num / 10000).toFixed(1)
    return num + '万'
  } else {
    return num
  }
}