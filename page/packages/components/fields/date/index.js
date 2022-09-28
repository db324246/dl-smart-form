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
      : `'${value}'`
    let str = ''
    switch (judge) {
      case '>':
      case '<':
      case '>=':
      case '<=':
      case '==':
      case '!=':
        str += `${fieldVal} ${judge} ${judeValue}`
        break;
      case 'nullStr':
        str += `!${fieldVal}`
        break;
      case 'unnullStr':
        str += `${fieldVal}`
        break;
      default:
        str += 'true'
        break;
    }
    return str
  },
  field: {
    type: 'date',
    label: '日期选择器',
    value: '',
    placeholder: '请选择日期',
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      placeholder: '请选择日期',
      format: 'yyyy-MM-dd',
      comType: 'date'
    }
  }
}
