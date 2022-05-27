import allOriginField, { complexComponents } from '../components/fields'

const allOriginField_Map = {}
const complexComTypes = complexComponents.map(com => com.field.type)

allOriginField.forEach(item => {
  allOriginField_Map[item.field.type] = item.field
})

// 同步完善固定字段信息
export const syncFieldInitTo = (syncField) => {
  if (!syncField) return
  const field = Object.assign(
    {},
    deepClone(allOriginField_Map[syncField.type]),
    deepClone(syncField))
  if (!complexComTypes.includes(field.type)) return field

  // 复杂类型字段添加默认的内部字段附属规则
  if (!Object.keys(field.attrs.fieldAttachedRule).length) {
    field.modelFields.forEach(f => {
      field.attrs.fieldAttachedRule[f.name] = {
        showLabel: true,
        required: false
      }
    })
  }

  if (field.type === 'arrayform' && !field.attrs.tableColumns.length) {
    field.attrs.tableColumns = field.modelFields.slice()
  }

  return field
}

// 多个条件的时候（conditions多个），转换条件连接符
const getCorrelativeRules = fieldCorrelativeRules => {
  if (!fieldCorrelativeRules || fieldCorrelativeRules.length === 0) return []

  fieldCorrelativeRules.forEach(r => {
    r.conditions = r.conditions.reduce((p, c) => {
      if (c.connector) {
        let connectorJson
        if (c.connector === '&&') {
          connectorJson = {
            type: 'connector',
            label: '并',
            value: '&&'
          }
        } else if (c.connector === '||') {
          connectorJson = {
            type: 'connector',
            label: '或',
            value: '||'
          }
        } else {
          connectorJson = {
            type: 'connector',
            label: '异或',
            value: '^'
          }
        }
        p.push(connectorJson)
      }
      p.push(c)
      return p
    }, [])
  })

  return fieldCorrelativeRules
}

// 计算判断条件字符串
const exportRuleConditionsStr = (conditions, formVar = 'form') => {
  let str = ''
  conditions.forEach(c => {
    if (c.type === 'condition') {
      const fieldName = c.fieldName
      const _value = `${formVar}['${fieldName}'].value`
      switch (c.judge) {
        // 可以直接判断的条件符
        case '>':
        case '<':
        case '>=':
        case '<=':
        case '==':
        case '!=':
          str += `${_value} ${c.judge} '${c.value}'`
          break;
        // 字符串数字为空、不为空的判断
        case 'nullStr':
          str += `(${_value} !== 0 && !${_value})`
          break;
        case 'unnullStr':
          str += `(${_value} === 0 || ${_value})`
          break;
        // 数组为空、不为空的判断
        case 'nullArr':
          str += `(!${_value}] || !${_value}.length)`
          break;
        case 'unnullArr':
          str += `(${_value} && ${_value}.length)`
          break;
        // 包含、不包含的判断--只有多选下拉和复选框组有这个条件
        case 'contains':
          c.value.forEach((v, i) => {
            if (!i) {
              str += `(${_value}.indexOf(${v}) >= 0)`
            } else {
              str += ` && (${_value}.indexOf(${v}) >= 0)`
            }
          })
          break
        case 'uncontains':
          c.value.forEach((v, i) => {
            if (!i) {
              str += `(${_value}.indexOf(${v}) < 0)`
            } else {
              str += ` && (${_value}.indexOf(${v}) < 0)`
            }
          })
          break
        // 开关布尔值的判断
        case 'true':
          str += `${_value}`
          break;
        case 'false':
          str += `！${_value}`
          break;
      }
    } else if (c.type === 'connector') {
      // 如果类型为连接符
      str += ` ${c.value} `
    }
  })
  return str
}

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
