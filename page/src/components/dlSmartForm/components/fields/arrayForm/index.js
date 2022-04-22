export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'arrayform',
    label: '重复上报表单',
    value: [],
    editable: true,
    insideForm: false, // 控件是否展示再表单组件内
    attrs: {
      tableColumns: [],
      queryFields: [],
      fieldCorrelativeRules: [],
      fieldAttachedRule: {}
    }
  }
}
