import configComponent from './config'
import detailComponent from './detail'
import reportComponent from './report'
import templateComponent from './template'
import { inputRule } from '../../../utils/attachedRuleConfig'

export default {
  configComponent, // 配置组件
  detailComponent, // 详情组件
  reportComponent, // 上报组件
  templateComponent, // 模板组件
  attachedRule: inputRule, // 字段的附属规则计算函数
  correlativeRule(value, judge, fieldName) { // 字段的关联规则
    const fieldVal = `form['${fieldName}'].value`
    let str = ''
    switch (judge) {
      case '>':
      case '<':
      case '>=':
      case '<=':
      case '==':
      case '!=':
        str += `${fieldVal} ${judge} '${value}'`
        break;
      case 'nullStr':
        str += `(${fieldVal} !== 0 && !${fieldVal})`
        break;
      case 'unnullStr':
        str += `(${fieldVal} === 0 || ${fieldVal})`
        break;
    }
    return str
  },
  field: {
    type: 'number',
    label: '数字输入',
    value: 0,
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      placeholder: '占位符文字',
      min: undefined,
      max: undefined,
      step: 1
    }
  }
}
