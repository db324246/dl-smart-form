import configComponent from './config'
import detailComponent from './detail'
import reportComponent from './report'
import templateComponent from './template'
import { emptyRule } from '../../../utils/attachedRuleConfig'

export default {
  configComponent, // 配置组件
  detailComponent, // 详情组件
  reportComponent, // 上报组件
  templateComponent, // 模板组件
  attachedRule: emptyRule, // 字段的附属规则计算函数
  field: {
    type: 'divider',
    label: '分割线',
    value: null,
    configurable: false,
    isFormField: false // 是否是表单字段
  }
}
