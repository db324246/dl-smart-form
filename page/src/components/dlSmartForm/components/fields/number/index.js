export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'number',
    label: '数字输入',
    value: 0,
    editable: true,
    attrs: {
      placeholder: '占位符文字',
      min: undefined,
      max: undefined,
      step: 1
    }
  }
}
