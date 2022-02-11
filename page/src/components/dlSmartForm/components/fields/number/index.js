export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'number',
    label: '数字输入',
    value: 0,
    editable: true,
    insideForm: true, // 控件是否展示再表单组件内
    attrs: {
      placeholder: '占位符文字',
      min: undefined,
      max: undefined,
      step: 1
    }
  }
}
