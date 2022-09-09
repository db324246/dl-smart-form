import configComponent from './config'
import detailComponent from './detail'
import reportComponent from './report'
import templateComponent from './template'
import { arrayFormRule } from '../../../utils/attachedRuleConfig'

export default {
  configComponent, // 配置组件
  detailComponent, // 详情组件
  reportComponent, // 上报组件
  templateComponent, // 模板组件
  attachedRule: arrayFormRule, // 字段的附属规则计算函数
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
