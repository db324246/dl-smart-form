import date from './date'
import time from './time'
import input from './input'
import number from './number'
import select from './select'
import switchCom from './switch'
import textarea from './textarea'
import dateRange from './dateRange'
import mulSelect from './mulSelect'
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
export const layoutComponents = []

// 复杂类型字典
export const complexField = [
  // 数据子项
  {
    field: {
      type: 'objectform',
      label: '数据子项',
      value: null,
      editable: true,
      attrs: {
        fieldCorrelativeRules: [],
        fieldAttachedRule: {}
      }
    }
  },
  // 重复上报
  {
    field: {
      type: 'arrayform',
      label: '重复上报',
      value: [],
      editable: true,
      attrs: {
        tableColumns: [],
        queryFields: [],
        fieldCorrelativeRules: [],
        fieldAttachedRule: {}
      }
    }
  }
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

export default allOriginField
