import { deepClone, typeOf } from '../utils'

// 比较新值和旧值是否有改动 返回更新后的值
export const diffValue = (newVal, oldVal, deep = false) => {
  const recursionDiffer = (newVal, oldVal, level) => {
    level++
    const newType = typeOf(newVal)
    const oldType = typeOf(oldVal)
    if (newType !== oldType) return deepClone(newVal)

    let differ
    switch (newType) {
      case 'object':
        differ = {}
        for (const key in newVal) {
          const differvalue = recursionDiffer(newVal[key], oldVal[key], level)
          if (differvalue !== '__empty__value__') {
            differ[key] = differvalue
          }
        }
        return Object.keys(differ).length
          ? differ
          : '__empty__value__'
      case 'array':
        differ = []
        newVal.forEach((val, index) => {
          const differvalue = recursionDiffer(val, oldVal[index], level)
          if (differvalue !== '__empty__value__') {
            differ.push(differvalue)
          }
        })
        if (!deep && level === 2) {
          return differ.length
            ? deepClone(newVal)
            : '__empty__value__'
        } else {
          return differ.length
            ? differ
            : '__empty__value__'
        }
        // return differ.length
        //   ? differ
        //   : '__empty__value__'
      default:
        return newVal === oldVal
          ? '__empty__value__'
          : newVal
    }
  }

  const differ = recursionDiffer(newVal, oldVal, 0)
  if (differ !== '__empty__value__') return differ

  const type = typeOf(newVal)
  switch (type) {
    case 'object':
      return {}
    case 'array':
      return []
    default:
      return null
  }
}
