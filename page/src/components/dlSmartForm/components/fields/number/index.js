export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'number',
    label: '数字输入',
    value: 0,
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      placeholder: '占位符文字',
      min: undefined,
      max: undefined,
      step: 1
    }
  }
}
