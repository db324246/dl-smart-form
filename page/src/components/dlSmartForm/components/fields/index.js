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
  input,
  number,
  textarea,
  date,
  time,
  dateRange,
  select,
  mulSelect,
  radioGroup,
  checkboxGroup,
  switchCom
]

// 高阶字段
export const advanceComponents = []

// 布局字段
export const layoutComponents = [
  title,
  divider
]

// 复杂类型字段（一个字段内部集成了多个字段）
export const complexComponents = [
  // 重复上报表格
  arrayForm
]

// 字段配置组件集合
export const fieldConfigComMap = {}
// 字段模板组件集合
export const fieldTempComMap = {}
// 字段上报组件集合
export const fieldReportComMap = {}
// 字段详情组件集合
export const fieldDetailComMap = {}

const comsMap = {
  basicComponents,
  advanceComponents,
  layoutComponents,
  complexComponents
}

Object.values(comsMap).forEach(item => {
  item.forEach(f => {
    Reflect.set(fieldConfigComMap, `${f.field.type}-config`, f.configComponent)
    Reflect.set(fieldTempComMap, `${f.field.type}-template`, f.templateComponent)
    Reflect.set(fieldReportComMap, `${f.field.type}-report`, f.reportComponent)
    Reflect.set(fieldDetailComMap, `${f.field.type}-detail`, f.detailComponent)
  })
})

// 所有元字段的类型集合
const allOriginField = [
  ...basicComponents,
  ...layoutComponents,
  ...complexComponents
]

export default allOriginField
