/**
 * 二次封装本次存储操作
*/

// 1. 获取数据
export const getItem = (name) => {
  const data = window.localStorage.getItem(name)

  /**
   * 为什么把 JSON.parse 放到 try-catch 中？
   * 因为data可能不是 JSON 格式字符串（可能不是对象形式）
   * */ 
  try {
    // 获取的数据可能不是对象形式，就转换成对象再返回出去
    return JSON.parse(data)
  } catch {
    // 如果是对象形式直接返回出去
    return data
  }
}

// 2. 存储数据
export const setItem = (name, data) => {
  // 如果传进来的数据是对象类型（转成字符串形式再传）
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  
  window.localStorage.setItem(name, data)
  
}

// 3. 删除某项数据
export const removeItem = (name) => {
  window.localStorage.removeItem(name)
}