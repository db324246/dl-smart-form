import configComponent from './config'
import detailComponent from './detail'
import reportComponent from './report'
import templateComponent from './template'
import { changeRule } from '../../../utils/attachedRuleConfig'

export default {
  configComponent, // 配置组件
  detailComponent, // 详情组件
  reportComponent, // 上报组件
  templateComponent, // 模板组件
  attachedRule: changeRule, // 字段的附属规则计算函数
  correlativeRule(condition) { // 字段的关联规则
    const { value, fieldName, judge, compareFieldName, isCompareField } = condition
    const fieldVal = `form['${fieldName}'].value`
    const judeValue = isCompareField
      ? `form['${compareFieldName}'].value`
      : `${value}`
    let str = ''
    switch (judge) {
      case '==':
      case '!=':
        str += `${fieldVal} ${judge} ${judeValue}`
        break;
      default:
        str += 'true'
        break;
    }
    return str
  },
  field: {
    type: 'switch',
    label: '开关',
    value: true,
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {}
  }
}
