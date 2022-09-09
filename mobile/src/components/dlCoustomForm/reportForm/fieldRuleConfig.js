import { validateEmail, validatePhone, validateCardId, validateURL } from '@/utils/validate'

const inputValideObj = {
  cardId: validateCardId,
  phone: validatePhone,
  url: validateURL,
  email: validateEmail
}

/**
 * 字段的附属规则校验rule
 */
const emptyRule = (required, label) => {
  return []
}
const inputRule = (
  required = false,
  label,
  dataType = '',
  pattern) => {
  const rules = [
    {
      required,
      message: `请输入${label}`,
      trigger: 'blur'
    }
  ]
  if (!dataType) return rules

  const validator = dataType !== 'string'
    ? inputValideObj[dataType]
    : (value) => {
      if (!pattern) return !!value

      const reg = new RegExp(`/${pattern}/`, 'g')
      return reg.test(value)
    }
  rules.push({
    validator: (value, rule) => {
      if (!required) return true
      if (value === '') return Promise.reject(`请输入${label}`)

      if (!validator(value)) return Promise.reject(`请输入正确的${label}`)
      return true
    },
    trigger: 'blur'
  })
  return rules
}
const changeRule = (required, label) => {
  return [{
    required,
    message: `请选择${label}`,
    trigger: 'change'
  }]
}
const citeFormRule = (required, label) => {
  return [{
    required,
    message: `请上报${label}`,
    trigger: 'change'
  }]
}
const uploaderRule = (required, label) => {
  return [{
    required,
    message: `请上传${label}`,
    trigger: 'change'
  }]
}
export default {
  // 标题
  title: emptyRule,
  // 分割线
  divider: emptyRule,
  // 单行文本
  input: inputRule,
  // 多行文本
  textarea: inputRule,
  // 数字输入
  number: inputRule,
  // 单选框组
  radioGroup: changeRule,
  // checkboxGroup
  checkboxGroup: changeRule,
  // 日期选择器
  date: changeRule,
  // 日期范围
  dateRange: changeRule,
  // 时间选择器
  time: changeRule,
  // 时间范围
  timeRange: changeRule,
  // 下拉选择框
  select: changeRule,
  // 多选下拉框
  mulSelect: changeRule,
  // 选人控件
  personnel: changeRule,
  // switch
  switch: changeRule,
  // 文件上传
  file: uploaderRule,
  // 证照上传
  license: uploaderRule,
  // 重复上报表单
  arrayform: citeFormRule
}
