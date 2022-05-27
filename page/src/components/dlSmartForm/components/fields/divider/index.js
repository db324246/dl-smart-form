export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'divider',
    label: '分割线',
    value: null,
    configurable: false,
    isFormField: false // 是否是表单字段
  }
}
