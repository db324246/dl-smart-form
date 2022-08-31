import Store from '@pr/store'
// 复杂类型字段
import { complexComponents } from '@pr/components/fields'

// 同步完善固定字段信息
export const syncFieldInitTo = (syncField) => {
  if (!syncField) return
  const allOriginField_Map = Store.allOriginFieldsMap
  const field = Object.assign(
    {},
    deepClone(allOriginField_Map[syncField.type]),
    deepClone(syncField))
  if (field.name) {
    field.key = field.key || field.name
  }

  const complexComTypes = complexComponents.map(com => com.field.type)
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
const exportRuleConditionsStr = (conditions) => {
  let str = ''
  const fieldCorrectRuleMap = Store.fieldCorrectRuleMap
  conditions.forEach(c => {
    const handler = fieldCorrectRuleMap[c.fieldType]
    if (c.type === 'condition' && handler) {
      str += handler(c.value, c.judge, c.fieldName)
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

        const watchFunStr = `return Boolean(${exportRuleConditionsStr(conditions, 'form')})`
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
