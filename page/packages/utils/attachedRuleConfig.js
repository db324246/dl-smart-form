import { validateEmail, validatePhone, validateCardId, validateURL } from './validate'

const inputValideObj = {
  cardId: validateCardId,
  phone: validatePhone,
  url: validateURL,
  email: validateEmail
}

/**
 * 字段的附属规则校验rule
 */
export const emptyRule = () => []
export const inputRule = (
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
    validator: (rule, value, callback) => {
      if (!required) return callback()
      if (value === '') return callback(new Error(`11请输入${label}`))

      if (!validator(value)) return callback(new Error(`请输入正确的${label}`))
      callback();
    },
    trigger: 'blur'
  })
  return rules
}
export const changeRule = (required, label) => {
  return {
    required,
    message: `请选择${label}`,
    trigger: 'change'
  }
}
export const arrayFormRule = (required, label) => {
  return {
    required,
    message: `请上报${label}`,
    trigger: 'change'
  }
}
