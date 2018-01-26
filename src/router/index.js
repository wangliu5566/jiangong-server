import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import zwx from "./ZWX/"
import wl from "./WL/"
import lqr from "./LQR/"
import system from "./System/"
export default new Router({
  // mode: 'history',
  routes: [{
      path: '/',
      redirect: '/wrap',
      },{
        path: '/wrap',
        component:resolve => require(['@/components/Wrap'], resolve),
        redirect: '/wrap/index',
        beforeEnter: (to, from, next) => {
          let userInfo = JSON.parse(window.sessionStorage.getItem('bg_user_info'));
          let userType = window.sessionStorage.getItem('bg_user_type');
          if (userInfo && userInfo.Id && userInfo.Id != '' && (userType == 'B6589FC6AB0DC82CF12099D1C2D40AB994E8410C' || userType == '356A192B7913B04C54574D18C28D46E6395428AB')) {
            next()
          } else {
            next({ path: '/login' })
          }
        },
        children: [...zwx,...wl,...lqr]
      },{
        path: '/system',
        component:resolve => require(['@/components/System'], resolve),
        redirect: '/system/index',
        beforeEnter: (to, from, next) => {
          let userInfo = JSON.parse(window.sessionStorage.getItem('bg_user_info'));
          let userType = window.sessionStorage.getItem('bg_user_type');
          if (userInfo && userInfo.Id && userInfo.Id != '' && userType=="AC3478D69A3C81FA62E60F5C3696165A4E5E6AC4") {
            next()
          } else {
            next({ path: '/login' })
          }
        },
        children: [...system]
      },{
          path: '/login',
          component: resolve => require(['@/components/common/BgLogin'], resolve),
        }],
        scrollBehavior(to, from, savedPosition) {
          return { x: 0, y: 0 }
        }
    })
