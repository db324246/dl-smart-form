export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'dateRange',
    label: '日期范围',
    value: [],
    editable: true,
    insideForm: true, // 控件是否展示再表单组件内
    attrs: {
      startPlaceholder: '请选择开始日期',
      endPlaceholder: '请选择结束日期',
      format: 'yyyy-MM-dd',
      comType: 'daterange'
    }
  }
}
