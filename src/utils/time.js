/**
 * 本模块对时间进行格式化
 * 例如：30040 ---> 3:04
 * 
*/

// 根据type判断是直接格式化 开始时间（start） 还是 结束时间（end）
export const time = (type, musicTime) => {

  // 初始化时间
  let time;
  if (type == 'start') {
    // 将传进来的时间，转成数字类型
    time = Math.floor(parseInt(musicTime)) // 这里的是崇数字1开始
  } else {
    time = Math.floor(parseInt(musicTime / 1000))  // 毫秒为单位的Unix时间戳
  }
      
  // 秒（second）
  let s = Math.floor(parseInt(time))
  // 分（minute）
  let m = Math.floor(parseInt(s / 60))

  // 传进来的时间小于10   00:0[这个是传进来的值]
  // 传进来的时间大于等于10并且小于60   00:[这里是传进来的值]
  // 传进来的时间大于等于60并且s(秒)的余数小于10   0[分钟]:0[s(秒)的余数]（这个函数方法不进行10分钟以上的判断）
  // 传进来的时间大于等于60并且s(秒)的余数大于10   0[分钟]:0[s(秒)的余数]（这个函数方法不进行10分钟以上的判断）
  if (time < 10) {
    time = `00:0${s}`
  } else if (time >= 10 && time < 60) {
    time = `00:${s}`
  } else if (time >= 60 && ((s % 60) >= 10)) {
    time = `0${m}:${s % 60}`
  } else if (time >= 60 && ((s % 60) < 10)) {
    time = `0${m}:0${s % 60}`
  }

  // 将格式化的时间，作为这个方法的值return出去
  return time
}