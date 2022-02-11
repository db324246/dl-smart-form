import Bus from './Bus'
import allOriginField from '../components/fields'
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
export const createCol = (parentKey, config = {}) => {
  const colKey = generateKey('col_')
  const defaultCol = {
    ...config,
    key: colKey,
    width: 0,
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
export const createRow = (parentKey, config = {}) => {
  const rowKey = generateKey('row_')
  const defaultCol = createCol(rowKey, config)
  const defaultRow = {
    ...config,
    key: rowKey,
    domtype: 'row',
    parentKey, // 行的父节点key值，值为-1时表示是顶级容器
    children: [defaultCol]
  }
  Bus.setNode({ key: rowKey, value: defaultRow })
  return defaultRow
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
