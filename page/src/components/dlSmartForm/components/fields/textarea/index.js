export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'textarea',
    label: '多行文本',
    value: '',
    editable: true,
    attrs: {
      placeholder: '占位符文字',
      maxlength: 1000
    }
  }
}
