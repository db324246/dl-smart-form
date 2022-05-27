export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'time',
    label: '时间选择器',
    value: '', // 21:19
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      placeholder: '请选择时间',
      format: 'HH:mm'
    }
  }
}
