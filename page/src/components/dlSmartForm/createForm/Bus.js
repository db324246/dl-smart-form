import Vue from 'vue'
import { deepClone } from '../utils'

// 智能表单实例对象
class SmartFormer {
  constructor() {
    this.nodesMap = new Map() // 存储所有节点
    this.reportData = null
    this.fieldAttachedRule = null
    this.watcher = new Vue({ // 字段关联规则的观察者
      data() {
        return {
          fieldsMap: {}, // 所有的字段集合
          formModel: {}, // 字段与value的集合
          formModelRules: {}, // 字段的附属规则结合
          ruleShow: {}
        }
      }
    })
    this.offWatcher = []
    this.correlativeRuleMap = {}
  }
}

export default new Vue({
  data() {
    return {
      former: null,
      draggingNode: null, // 被拖拽的节点
      focusNodeKey: '' // 当前选中的节点
    }
  },
  methods: {
    initFormer() {
      this.former = new SmartFormer()
    },
    // 保存布局节点
    setNode({ key, value }) {
      this.former.nodesMap.set(key, value)
    },
    // 保存拖拽中节点
    setDraggingNode(node) {
      this.draggingNode = deepClone(node)
    },
    // 设置正在聚焦的节点
    setFocusNodeKey(key) {
      this.focusNodeKey = key
    }
  }
})
