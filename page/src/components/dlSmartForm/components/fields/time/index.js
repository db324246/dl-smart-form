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
      case '==':
      case '!=':
        str += `${_value} ${c.judge} '${c.value}'`
        break;
      case 'nullStr':
        str += `!${_value}`
        break;
      case 'unnullStr':
        str += `${_value}`
        break;
    }
    return str
  },
  field: {
    type: 'time',
    label: '时间选择器',
    value: '', // 21:19
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      placeholder: '请选择时间',
      format: 'HH:mm'
    }
  }
}
