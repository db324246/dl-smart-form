export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'switch',
    label: '开关',
    value: true,
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {}
  }
}
