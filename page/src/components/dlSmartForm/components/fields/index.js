import date from './date'
import time from './time'
import input from './input'
import number from './number'
import select from './select'
import title from './title'
import divider from './divider'
import switchCom from './switch'
import textarea from './textarea'
import dateRange from './dateRange'
import mulSelect from './mulSelect'
import arrayForm from './arrayForm'
import radioGroup from './radioGroup'
import checkboxGroup from './checkboxGroup'

// 基础字段
export const basicComponents = [
  date,
  time,
  input,
  number,
  select,
  textarea,
  dateRange,
  mulSelect,
  switchCom,
  radioGroup,
  checkboxGroup
]

// 布局字段
export const layoutComponents = [
  title,
  divider
]

// 复杂类型字典
export const complexField = [
  // 重复上报
  arrayForm
]

// 字段配置组件集合
export const fieldConfigComMap = {}

// 字段模板组件集合
export const fieldTempComMap = {}

basicComponents.forEach(f => {
  Reflect.set(fieldConfigComMap, `${f.field.type}-config`, f.configComponent)
  Reflect.set(fieldTempComMap, `${f.field.type}-template`, f.templateComponent)
})
layoutComponents.forEach(f => {
  Reflect.set(fieldConfigComMap, `${f.field.type}-config`, f.configComponent)
  Reflect.set(fieldTempComMap, `${f.field.type}-template`, f.templateComponent)
})

// 所有元字段的类型集合
const allOriginField = [
  ...basicComponents,
  ...layoutComponents,
  ...complexField
]

// 没有附属规则的字段
export const hasNoAttachRuleFields = [
  'title'
]

export default allOriginField
