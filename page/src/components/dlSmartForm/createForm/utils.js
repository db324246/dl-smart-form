import Bus from './Bus'
import allOriginField, { layoutComponents } from '../createForm/components/componentsConfig'
import { deepClone, typeOf } from '../utils'

export { deepClone, typeOf }

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

// 关闭右击菜单
export const hideContextMenu = () => {
  Bus.setFocusNodeKey('')
  const contextmenuUlList = document.querySelectorAll('.v-contextmenu.v-contextmenu--default')
  for (let i = 0; i < contextmenuUlList.length; i++) {
    contextmenuUlList[i].style.display = 'none'
  }
}

// 生产key值
export const generateKey = key => `${key}${Date.now()}${Math.ceil(Math.random() * 999)}`

/**
 * fixed 表示节点内的子节点不可拖拽与新增删除
 */
// 创建列节点
export const createCol = (parentKey, fixed = false, config = {}) => {
  const colKey = generateKey('col_')
  const defaultCol = {
    ...config,
    key: colKey,
    width: 0,
    fixed,
    align: 'middle_left',
    domtype: 'col',
    editable: true,
    parentKey, // 列的父节点key值
    children: []
  }
  Bus.setNode({ key: colKey, value: defaultCol })
  return defaultCol
}

// 创建行节点
export const createRow = (parentKey, fixed = false, config = {}) => {
  const rowKey = generateKey('row_')
  const defaultCol = createCol(rowKey, fixed, config)
  const defaultRow = {
    ...config,
    key: rowKey,
    fixed,
    domtype: 'row',
    parentKey, // 行的父节点key值，值为-1时表示是顶级容器
    children: [defaultCol]
  }
  Bus.setNode({ key: rowKey, value: defaultRow })
  return defaultRow
}

// 创建明细子表结构
export const generateCreateSubFormFn = (generateFieldName, extendedAttrs) => {
  const createSubFormBox = parentKey => {
    const fieldName = generateFieldName('subForm')
    const titleField = {
      name: generateFieldName('title'),
      ...deepClone(extendedAttrs),
      ...layoutComponents.find(item => item.field.type === 'title').field
    }
    Bus.$emit('add-field', { field: titleField }, true)
    // 明细子表 - 行
    const boxRow = createRow(parentKey, true, {
      fieldName,
      isSubForm: true
    })
    const boxCol = boxRow.children[0]
    // 明细子表 - 标题行
    const titleRow = createRow(boxCol.key, true, {
      fieldName,
      isSubForm: true
    })
    // 明细子表 - 列行
    const columnRow = createRow(boxCol.key, false, {
      fieldName,
      isSubForm: true,
      subFormCol: true
    })
    boxCol.children.push(titleRow)
    boxCol.children.push(columnRow)
    // 明细子表 - 默认列
    columnRow.children.push(
      createCol(columnRow.key, false, {
        fieldName,
        isSubForm: true,
        subFormCol: true
      })
    )
    const titleCol = titleRow.children[0]

    titleCol.children.push({
      domtype: 'field',
      parentKey: titleCol.key,
      key: titleField.name,
      fieldName: titleField.name
    })
    Bus.$emit('add-subForm-field', {
      name: fieldName,
      value: [],
      titleField: titleField.name,
      domKey: boxRow.key,
      type: 'subform',
      columnFields: [],
      ...deepClone(extendedAttrs)
    })
    Bus.$emit('edit-node')
    return boxRow
  }
  return createSubFormBox
}

// 移除字段拖拽产生的dom
export const removeDragDom = (el, className) => {
  const dragDoms = el.querySelectorAll(className)
  dragDoms.forEach(dom => {
    try {
      if (dom.parentNode === el) {
        el.removeChild(dom)
      }
    } catch (error) {
      console.log(error)
      console.log(el)
      console.log(dom)
    }
  })
}

// 为拖拽clone产生的 dom 添加标识属性
export const setDraggableAttr = (el) => {
  el.setAttribute('data-cloned', 1)
}

// 移除拖拽clone产生的dom (含有标识属性)
export const removeDragCloneDom = (el, className) => {
  const dragDoms = el.querySelectorAll(className)
  dragDoms.forEach(dom => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!dom.getAttribute('data-cloned')) {
      try {
        el.removeChild(dom)
      } catch (error) {
        console.log(error)
        console.log(el)
        console.log(dom)
      }
    }
  })
}

// 递归存储node节点 (创建)
export const recursionSaveNode = (nodes = []) => {
  nodes.forEach(node => {
    if (['row', 'col'].includes(node.domtype)) {
      Bus.setNode({ key: node.key, value: node })
      node.children && recursionSaveNode(node.children)
    }
  })
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
        const handler = new Function('form', watchFunStr)
        correlativeRuleMap[fieldName].push({
          handler,
          ...correlativeRules[i]
        })
      }
    })
  }

  Bus.setCorrelativeRuleMap({
    correlativeRuleMap
  })
}
