export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'date',
    label: '日期选择器',
    value: '',
    placeholder: '请选择日期',
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      placeholder: '请选择日期',
      format: 'yyyy-MM-dd',
      comType: 'date'
    }
  }
}
