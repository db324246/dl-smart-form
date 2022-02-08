export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'time',
    label: '时间选择器',
    value: '', // 21:19
    editable: true,
    attrs: {
      placeholder: '请选择时间',
      format: 'HH:mm'
    }
  }
}
