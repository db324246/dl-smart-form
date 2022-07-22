import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'
import docRoutes from './docRoutes'

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
        name: 'home',
        component: () => import('@/views/Home')
      },
      {
        path: 'doc',
        redirect: '/doc/install',
        component: () => import('@/views/doc'),
        children: docRoutes
      },
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/create')
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('@/views/report')
      },
      {
        path: 'detail',
        name: 'detail',
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
