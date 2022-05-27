export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  field: {
    type: 'arrayform',
    label: '重复上报表单',
    value: [],
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      dialogWidth: 500,
      tableColumns: [],
      queryFields: [],
      fieldCorrelativeRules: [],
      fieldAttachedRule: {}
    }
  }
}
