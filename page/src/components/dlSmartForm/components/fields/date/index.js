export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'date',
    label: '日期选择器',
    value: '',
    placeholder: '请选择日期',
    editable: true,
    attrs: {
      placeholder: '请选择日期',
      format: 'yyyy-MM-dd',
      comType: 'date'
    }
  }
}
