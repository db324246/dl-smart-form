export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'switch',
    label: '开关',
    value: true,
    editable: true,
    insideForm: true, // 控件是否展示再表单组件内
    attrs: {}
  }
}
