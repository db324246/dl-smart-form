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
    type: 'blankLine',
    label: '空白行',
    configurable: true, // 字段是否可配置
    isFormField: false, // 是否是表单字段
    attrs: {
      height: 20
    }
  }
}
