const installRoutes = [
  {
    path: 'install',
    component: () => import('@/views/doc/install'),
    title: '快速上手',
    name: 'install'
  }
  // {
  //   path: 'quick',
  //   component: () => import('@/views/doc/quick'),
  //   title: '快速上手',
  //   name: 'quick'
  // }
]

const guideRoutes = [
  {
    path: 'form',
    component: () => import('@/views/doc/form'),
    title: '表单',
    name: 'form'
  },
  {
    path: 'field',
    component: () => import('@/views/doc/field'),
    title: '字段',
    name: 'field'
  },
  {
    path: 'register',
    component: () => import('@/views/doc/register'),
    title: '注册字段',
    name: 'register'
  },
  {
    path: 'correlativeRule',
    component: () => import('@/views/doc/correlativeRule'),
    title: '关联规则',
    name: 'correlativeRule'
  }
]

const componentsRoutes = [
  {
    path: 'createForm',
    component: () => import('@/views/doc/createForm'),
    title: '创建表单',
    name: 'createForm'
  },
  {
    path: 'reportForm',
    component: () => import('@/views/doc/reportForm'),
    title: '填报表单',
    name: 'reportForm'
  },
  {
    path: 'detailForm',
    component: () => import('@/views/doc/detailForm'),
    title: '表单详情',
    name: 'detailForm'
  },
  {
    path: 'templateComponent',
    component: () => import('@/views/doc/templateComponent'),
    title: '字段模板组件',
    name: 'templateComponent'
  },
  {
    path: 'configComponent',
    component: () => import('@/views/doc/configComponent'),
    title: '字段配置组件',
    name: 'configComponent'
  },
  {
    path: 'detailComponent',
    component: () => import('@/views/doc/detailComponent'),
    title: '字段详情组件',
    name: 'detailComponent'
  },
  {
    path: 'reportComponent',
    component: () => import('@/views/doc/reportComponent'),
    title: '字段上报组件',
    name: 'reportComponent'
  }
]

export const docConfig = [
  {
    id: '1',
    title: '安装',
    children: installRoutes
  },
  {
    id: '2',
    title: '指南',
    children: guideRoutes
  },
  {
    id: '3',
    title: '组件',
    children: componentsRoutes
  }
]

export default [
  ...installRoutes,
  ...guideRoutes,
  ...componentsRoutes
]
