import allOriginField from '../components/fields'
const allOriginField_Map = {}
allOriginField.forEach(item => {
  allOriginField_Map[item.field.type] = item.field
})
// 同步完善固定字段信息
export const syncFieldInitTo = (syncField) => {
  if (syncField) {
    const field = Object.assign(
      {},
      deepClone(allOriginField_Map[syncField.type]),
      deepClone(syncField))
    if (!['objectform', 'arrayform'].includes(field.type)) return field

    console.log('field', field)
    // 重复上报和数据子项添加默认的内部字段附属规则
    if (!Object.keys(field.attrs.fieldAttachedRule).length) {
      field.modelFields.forEach(f => {
        field.attrs.fieldAttachedRule[f.name] = {
          showLabel: true,
          required: false
        }
      })
    }

    if (field.type === 'arrayform') {
      if (!field.attrs.tableColumns.length) {
        field.attrs.tableColumns = field.modelFields.slice()
      }
    }

    return field
  }
}

// 深度克隆
export function deepClone(source) {
  if (!source || typeof source !== 'object') {
    return source
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 返回变量的数据类型
export function typeOf(data) {
  return Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase()
}
