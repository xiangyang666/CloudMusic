const clickOutSide = {
  // 组件挂载完毕后调用
  mounted(el, binding) {

    function handleEvent(e) {
      if (el.contains(e.target)) {
        return false
      }

      // 如果绑定的参数是函数，正常情况也应该是函数，执行
      if (binding.value && typeof binding.value === 'funciton') {
        binding.value(e)
      }
    }

    el.__click_outside = handleEvent
    // 添加监听事件
    document.addEventListener('click', handleEvent, false)
  },
  beforeUnmount(el) {
    // 移除事件监听
    document.removeEventListener('click', el.__click_outside)
    // 删除无用属性
    delete el.__click_outside
  },
}


export default clickOutSide