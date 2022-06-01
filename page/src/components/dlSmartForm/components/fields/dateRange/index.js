import { changeRule } from '../../../utils/attachedRuleConfig'

export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  detailComponent: () => import('./detail'), // 详情组件
  reportComponent: () => import('./report'), // 上报组件
  attachedRule: changeRule, // 字段的附属规则计算函数
  correlativeRule(value, judge, fieldName) { // 字段的关联规则
    const fieldVal = `form['${fieldName}'].value`
    let str = ''
    switch (judge) {
      // case 'contains':
      //   c.value.forEach((v, i) => {
      //     if (!i) {
      //       str += `${_value}.includes(${v})`
      //     } else {
      //       str += ` && ${_value}.includes(${v})`
      //     }
      //   })
      //   break;
      // case 'uncontains':
      //   c.value.forEach((v, i) => {
      //     if (!i) {
      //       str += `!${_value}.includes(${v})`
      //     } else {
      //       str += ` && !${_value}.includes(${v})`
      //     }
      //   })
      //   break;
      case 'nullArr':
        str += `(!${_value}] || !${_value}.length)`
        break;
      case 'unnullArr':
        str += `(${_value} && ${_value}.length)`
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
