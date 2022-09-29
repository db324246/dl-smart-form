import Bus from './Bus'
import { deepClone, typeOf, syncFieldInitTo } from '../utils'

export { deepClone, typeOf, syncFieldInitTo }

// 关闭右击菜单
export const hideContextMenu = (nodeKey, hide) => {
  Bus.setFocusNodeKey('')
  const contextmenuUlList = document.querySelectorAll('.v-contextmenu.v-contextmenu--default')
  for (let i = 0; i < contextmenuUlList.length; i++) {
    const contextmenuUl = contextmenuUlList[i]
    if (!nodeKey) {
      contextmenuUl.style.display = 'none'
    } else if (contextmenuUl.getAttribute('node-key') !== nodeKey) {
      contextmenuUl.style.display = 'none'
    } else {
      setTimeout(() => {
        contextmenuUl.style.display = hide ? 'none' : 'block'
      })
    }
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
    domtype: 'col',
    configurable: true,
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
