export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'input',
    label: '单行文本',
    value: '',
    editable: true,
    insideForm: true, // 控件是否展示再表单组件内
    attrs: {
      placeholder: '占位符文字',
      maxlength: 100,
      dataType: 'string',
      pattern: ''
    }
  }
}
