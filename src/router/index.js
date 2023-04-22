import { ElMessage } from 'element-plus'
import { createRouter, createWebHashHistory } from 'vue-router'
import routeList from './routes'
import { getItem } from '@/utils/localStorage'

const routes = routeList;

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
// to：去哪的路由对象
// from：从哪来的的路由对象
// next：放行（通过）
router.beforeEach((to, from, next) => {
  // 如果需要跳转的路由需要权限
  if (to.meta.isAuth) {
    // 如果用户的本地存储中有token（就能访问，否则不能跳转）
    if (getItem('token')) {
      next()
    } else {
      ElMessage.error('您没有权限访问，请先登录！')
      // 没有token，直接跳转到登录页面（如果用户跳转需要权限的页面并且还未登录，则每次都需要跳转到登录页，这会影响用户体验，所以不跳转即可）
      // next({
      //   name: 'login'
      // })
      next(false)
    }
  } else {
    // 如果已经有了token，就不能在地址栏输入登录('/login')路由进行跳转了
    if (getItem('token') && to.name === 'login') {
      ElMessage({
        type: 'error',
        message: '您已经登录了！'
      })
      next(from.name) // 从哪来回哪去
    } else {
      // 不需要权限的路由（访问时直接通过即可）
      next()
    }
  }
})

export default router
