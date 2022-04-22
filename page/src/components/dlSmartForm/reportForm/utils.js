// 转化模板字段关联规则为 可让 vue 识别的结构（使用watcher监听方式）
export const computeCorrelativeRule = (fieldCorrelativeRules = []) => {
  const correlativeRules = getCorrelativeRules(fieldCorrelativeRules)
  const correlativeRuleMap = {}
  for (let i = 0, len = correlativeRules.length; i < len; i++) {
    const conditions = correlativeRules[i].conditions || [] // 条件s
    if (!conditions.length) continue

    // 遍历条件
    conditions.forEach(c => {
      if (c.type === 'condition') {
        const fieldName = c.fieldName
        if (!correlativeRuleMap[fieldName]) {
          correlativeRuleMap[fieldName] = []
        }

        const watchFunStr = `return !!(${exportRuleConditionsStr(conditions, 'form')})`
        // eslint-disable-next-line
        const handler = new Function('form', watchFunStr)
        correlativeRuleMap[fieldName].push({
          handler,
          ...correlativeRules[i]
        })
      }
    })
  }
  return correlativeRuleMap
}

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
