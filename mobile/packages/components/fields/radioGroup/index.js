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
    switch (judge) {
      case '==':
      case '!=':
        str += `${fieldVal} ${judge} '${value}'`
        break;
      case 'nullStr':
        str += `!${fieldVal}`
        break;
      case 'unnullStr':
        str += `${fieldVal}`
        break;
    }
    return str
  },
  field: {
    type: 'radioGroup',
    label: '单选框组',
    value: '',
    configurable: true,
    isFormField: true, // 是否是表单字段
    attrs: {
      bindDicts: false, // 是否绑定字典
      dictName: '',
      constantId: ''
    },
    options: [
      {
        value: '选项1',
        key: '1'
      },
      {
        value: '选项2',
        key: '2'
      },
      {
        value: '选项3',
        key: '3'
      }
    ]
  }
}