export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'dateRange',
    label: '日期范围',
    value: [],
    editable: true,
    attrs: {
      startPlaceholder: '请选择开始日期',
      endPlaceholder: '请选择结束日期',
      format: 'yyyy-MM-dd',
      comType: 'daterange'
    }
  }
}
