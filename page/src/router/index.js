import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home')
      },
      {
        path: 'create',
        component: () => import('@/views/create')
      },
      {
        path: 'report',
        component: () => import('@/views/report')
      },
      {
        path: 'detail',
        component: () => import('@/views/detail')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
