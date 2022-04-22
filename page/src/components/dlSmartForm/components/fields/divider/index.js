export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'divider',
    label: '分割线',
    value: null,
    editable: false,
    insideForm: false, // 控件是否展示再表单组件内
  }
}
