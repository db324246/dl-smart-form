import configComponent from './config'
import detailComponent from './detail'
import reportComponent from './report'
import templateComponent from './template'

export default {
  configComponent,
  detailComponent,
  reportComponent,
  templateComponent,
  attachedRule(required, label) {
    return {
      required,
      message: `请上传${label}`,
      trigger: 'change'
    }
  },
  field: {
    type: 'uploader', // 字段类型
    label: '上传', // 字段名称
    value: [], // 字段的默认值
    configurable: true, // 属性是否可配置
    isFormField: true, // 是否是表单字段
    attrs: { // 字段的自定义配置属性
      btnText: '点击上传',
      tips: '请上传1M以下的图片',
      accept: ['.png', '.jpg', '.jpeg'],
      multiple: false
    }
  }
}
