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
  correlativeRule(value, judge, fieldName) { // 字段的关联规则
    const fieldVal = `form['${fieldName}'].value`
    let str = ''
    const st = `${fieldVal}[0] || ''`
    const et = `${fieldVal}[1] || ''`
    // eslint-disable-next-line no-useless-escape
    const valueDate = `new Date('${value}'.replace(/\-/g, '/'))`
    switch (judge) {
      case 'contains':
        str += `${valueDate} >= new Date(${st}) && ${valueDate} <= new Date(${et})`
        break;
      case 'uncontains':
        str += `${valueDate} < new Date(${st}) && ${valueDate} > new Date(${et})`
        break;
      case 'nullArr':
        str += `(!${fieldVal}] || !${fieldVal}.length)`
        break;
      case 'unnullArr':
        str += `(${fieldVal} && ${fieldVal}.length)`
        break;
    }
    return str
  },
  field: {
    type: 'dateRange',
    label: '日期范围',
    value: [],
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      startPlaceholder: '请选择开始日期',
      endPlaceholder: '请选择结束日期',
      format: 'yyyy-MM-dd',
      comType: 'daterange'
    }
  }
}
