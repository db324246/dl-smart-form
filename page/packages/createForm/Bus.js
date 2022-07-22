import Vue from 'vue'
import { deepClone } from '../utils'

export default new Vue({
  data() {
    return {
      nodesMap: new Map(), // 存储所有节点
      draggingNode: null, // 被拖拽的节点
      focusNodeKey: '' // 当前选中的节点
    }
  },
  methods: {
    initFormer() {
      this.nodesMap = new Map()
    },
    // 保存布局节点
    setNode({ key, value }) {
      this.nodesMap.set(key, value)
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
