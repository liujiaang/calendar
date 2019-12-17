import Vue from 'vue'
import Router from 'vue-router'

const calendar = () => import("@/demo/calendarManage.vue")



Vue.use(Router)

let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/demo/calendarManage',
      name:'calendarManage',
      component: calendar
    }
  ]
})

export default router
