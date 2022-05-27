export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'title',
    label: '标题/段落',
    value: '标题/段落',
    configurable: true, // 字段是否可配置
    isFormField: false, // 是否是表单字段
    attrs: {
      fontSize: '16px',
      backgroundColor: '#efdebb',
      color: '#303133',
      fontWeight: 'normal'
    }
  }
}
