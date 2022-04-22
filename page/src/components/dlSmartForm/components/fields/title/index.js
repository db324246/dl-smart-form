export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'title',
    label: '标题/段落',
    value: '标题/段落',
    editable: true,
    insideForm: false, // 控件是否展示再表单组件内
    attrs: {
      fontSize: '16px',
      backgroundColor: '#efdebb',
      color: '#303133',
      fontWeight: 'normal'
    }
  }
}
