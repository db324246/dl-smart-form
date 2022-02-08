export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'switch',
    label: '开关',
    value: true,
    editable: true,
    attrs: {}
  }
}
