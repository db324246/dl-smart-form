import store from '@pr/store'
import { deepClone, typeOf } from '@/utils'
import { default as allOriginField, layoutComponents } from './componentsConfig'

const allOriginField_Map = {}
allOriginField.forEach(item => {
  allOriginField_Map[item.field.type] = item.field
})
// 同步完善固定字段信息
export const syncFieldInitTo = (syncField) => {
  if (syncField) {
    const field = Object.assign({}, deepClone(allOriginField_Map[syncField.type]), deepClone(syncField))
    if (!['objectform', 'arrayform'].includes(field.type)) return field

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
  store.commit('customForm/setFocusNodeKey', '')
  const contextmenuUlList = document.querySelectorAll('.v-contextmenu.v-contextmenu--default')
  for (let i = 0; i < contextmenuUlList.length; i++) {
    contextmenuUlList[i].style.display = 'none'
  }
}

// 生产key值
export const generateKey = key => `${Date.parse(key + new Date())}_${Math.ceil(Math.random() * 999)}`

/**
 * fixed 表示节点内的子节点不可拖拽与新增删除
 */

// 创建列节点
export const createCol = (formId, parentKey, fixed = false, config = {}) => {
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
  store.commit('customForm/setNode', { formId, key: colKey, value: defaultCol })
  return defaultCol
}

// 创建行节点
export const createRow = (formId, parentKey, fixed = false, config = {}) => {
  const rowKey = generateKey('row_')
  const defaultCol = createCol(formId, rowKey, fixed, config)
  const defaultRow = {
    ...config,
    key: rowKey,
    fixed,
    domtype: 'row',
    parentKey, // 行的父节点key值，值为-1时表示是顶级容器
    children: [defaultCol]
  }
  store.commit('customForm/setNode', { formId, key: rowKey, value: defaultRow })
  return defaultRow
}

// 移除字段拖拽产生的dom
export const removeDragDom = (el, className) => {
  const dragDoms = el.querySelectorAll(className)
  dragDoms.forEach(dom => {
    try {
      el.removeChild(dom)
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
export const recursionSaveNode = (formId, nodes = []) => {
  nodes.forEach(node => {
    if (['row', 'col'].includes(node.domtype)) {
      store.commit('customForm/setNode', { formId, key: node.key, value: node })
      node.children && recursionSaveNode(formId, node.children)
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
export const computeCorrelativeRule = (formId, fieldCorrelativeRules = []) => {
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

  store.commit('customForm/setCorrelativeRuleMap', {
    formId,
    correlativeRuleMap
  })
}

// 比较新值和旧值是否有改动 返回更新后的值
export const diffValue = (newVal, oldVal, deep = false) => {
  const recursionDiffer = (newVal, oldVal, level) => {
    // if (!deep && level > 1) return deepClone(newVal)
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
      return
  }
}

const personalTargetConfig = {
  teacher: {
    activeTab: 'org', // 首先展示的tab， 'org'组织人员，'unit'单位/学校，'group'常用组
    target: 'user', // 最终指向，'user'代表用户, 'unit'代表学校、部门, 'all' 所有
    org: { // 组织人员配置
      show: true // 是否展示
    },
    unit: { // 单位/学校 配置
      show: false, // 是否展示
      isShowDepart: false, // 是否展示部门
      isOnlyChoseDepart: false // 是否只选部门
    },
    group: { // 常用组配置
      show: false // 是否展示
    }
  },
  unit: {
    activeTab: 'unit', // 首先展示的tab， 'org'组织人员，'unit'单位/学校，'group'常用组
    target: 'unit', // 最终指向，'user'代表用户, 'unit'代表学校、部门, 'all' 所有
    org: { // 组织人员配置
      show: false // 是否展示
    },
    unit: { // 单位/学校 配置
      show: true, // 是否展示
      isShowDepart: false, // 是否展示部门
      isOnlyChoseDepart: false // 是否只选部门
    },
    group: { // 常用组配置
      show: false // 是否展示
    }
  },
  student: {
    activeTab: 'classStudent', // 首先展示的tab， 'org'组织人员，'unit'单位/学校，'group'常用组
    target: 'user', // 最终指向，'user'代表用户, 'unit'代表学校、部门, 'all' 所有
    org: { // 组织人员配置
      show: false // 是否展示
    },
    unit: { // 单位/学校 配置
      show: false, // 是否展示
      isShowDepart: false, // 是否展示部门
      isOnlyChoseDepart: false // 是否只选部门
    },
    group: { // 常用组配置
      show: false // 是否展示
    },
    classStudent: { // 班级、学生配置
      show: true, // 是否展示
      isOnlyChoseClass: false // 是否只选班级
    }
  }
}

export const generatePersonalConfig = config => {
  const {
    isSingle,
    placeholder,
    rangeType,
    target } = config

  return {
    placeholder, // 按钮或点击input的提示性文字
    dialogTitle: placeholder, // 弹出框标题
    rangeType, // 范围类型，发布范围 'release' 还是 管理范围 'manage'
    isSingle, // 是否单选
    ...personalTargetConfig[target]
  }
}
