<!-- 布局行组件 -->
<template>
  <div
    class="f-table-row"
    :class="{
      'active-row': active
    }"
    v-contextmenu:contextmenu
    @contextmenu.stop.prevent="hideContextMenu"
    @click.stop="handleNodeFocus">
    <v-contextmenu ref="contextmenu"
      :node-key="rowKey"
      :style="{
        'border-width': '1px'
      }"
      @contextmenu.native.stop.prevent>
      <v-contextmenu-submenu title="插入">
        <v-contextmenu-item @click="handleCommand('insertCol')">单元格</v-contextmenu-item>
        <v-contextmenu-item @click="handleCommand('insertTopRow')">行(在上方)</v-contextmenu-item>
        <v-contextmenu-item @click="handleCommand('insertBottomRow')">行(在下方)</v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="handleCommand('delRow')">删除行</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item :disabled="rowIndex === 0" @click="handleCommand('upRow')">前移行</v-contextmenu-item>
    </v-contextmenu>

    <div
      ref="drag-wrapper"
      class="drag-wrapper f-table-row__flex"
      :style="{ 'overflow-x': 'auto' }">
      <col-com
        :key="item.key"
        v-for="(item, index) in rowConfig.children"
        :col-data="item"
        :col-index="index"
        :style="{
          'max-width': item.width ? item.width + 'px' : '100%',
          'min-width': item.width ? item.width + 'px' : 'auto',
          'width': item.width ? item.width + 'px' : '100%'
        }"/>
    </div>

    <div v-if="active" class="row-drag">
      <i class="el-icon-rank drag-row"></i>
    </div>
  </div>
</template>

<script>
import Bus from '../../Bus'
import Sortable from 'sortablejs'
import {
  createCol,
  hideContextMenu,
  removeDragCloneDom,
  setDraggableAttr
} from '../../utils'

export default {
  name: 'row-com',
  props: {
    // 行配置
    rowConfig: {
      type: Object
    },
    // 行下标
    rowIndex: {
      type: Number
    },
    rowKey: {
      type: String,
      required: true
    }
  },
  provide() {
    return {
      rowVm: this,
      rowKey: this.rowKey,
      rowIndex: this.rowIndex,
      sortableWrap: null
    }
  },
  computed: {
    nodesMap() {
      return Bus.nodesMap
    },
    active() {
      return Bus.focusNodeKey === this.rowKey
    }
  },
  mounted() {
    this.sortableWrap = Sortable.create(
      this.$refs['drag-wrapper'],
      {
        group: {
          name: 'col',
          pull: true,
          put: ['col']
        },
        animation: 200,
        handle: '.drag-col',
        ghostClass: 'ghost-col', // 实现行影子样式
        onStart: this.handleDragStart.bind(this),
        onRemove: this.handleDragRemove.bind(this),
        onAdd: this.handleDragAdd.bind(this),
        onUpdate: this.handleDragUpdate.bind(this),
        onEnd: this.handleDragEnd.bind(this)
      }
    )
  },
  methods: {
    // 节点 聚焦
    handleNodeFocus() {
      this.hideContextMenu()
      Bus.setFocusNodeKey(this.rowKey)
    },
    // 插入列
    insertCol(sourceIndex) {
      const defaultCol = createCol(this.rowKey)
      this.rowConfig.children.splice(sourceIndex, 0, defaultCol)
      return defaultCol
    },
    // 交换列
    exchangeCol(sourceIndex, targetIndex) {
      if (sourceIndex === 0) return
      const arr = this.rowConfig.children
      arr[targetIndex] = arr.splice(sourceIndex, 1, arr[targetIndex])[0]
    },
    // 删除列
    deleletCol(colKey) {
      const sourceIndex = this.rowConfig.children.findIndex(col => col.key === colKey)
      this.rowConfig.children.splice(sourceIndex, 1)
      this.nodesMap.delete(colKey)
    },
    // 删除行
    handleRowDelete() {
      this.$confirm('删除后不可撤销，确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Bus.$emit('delete-row', this.rowKey)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 刷新子节点的parentKey
    refreshColsParentKey() {
      this.rowConfig.children.forEach(col => {
        col.parentKey = this.rowKey
      })
    },
    // 右击菜单项点击- 事件
    handleCommand(type) {
      switch (type) {
        case 'insertCol': // 插入列
          this.insertCol(
            this.rowConfig.children.length
          )
          break;
        case 'insertTopRow': // 插入一行在上边
          Bus.$emit('insert-row', this.rowIndex, this.rowKey)
          break;
        case 'insertBottomRow': // 插入一行在下边
          Bus.$emit('insert-row', this.rowIndex + 1, this.rowKey)
          break;
        case 'delRow': // 删除行
          this.handleRowDelete()
          break;
        case 'upRow': // 前移行
          Bus.$emit('exchange-row', this.rowIndex, this.rowIndex - 1, this.rowKey)
          break;
      }
    },
    // 隐藏 右击菜单项
    hideContextMenu() {
      hideContextMenu(this.rowKey)
      this.$refs.contextmenu.hide()
    },
    // 开始拖拽
    handleDragStart(evt) {
      Bus.setDraggingNode({
        type: 'col',
        data: this.rowConfig.children[evt.oldIndex]
      })
    },
    // 移除元素
    handleDragRemove(evt) {
      this.rowConfig.children.splice(evt.oldIndex, 1)
      this.$nextTick(() => {
        Bus.$emit('liquidation-rows')
      })
    },
    // 拖拽排序更新
    handleDragUpdate(evt) {
      const { oldIndex, newIndex } = evt
      const children = this.rowConfig.children
      const cacheCol = children[oldIndex]
      this.$set(children, oldIndex, children[newIndex])
      this.$set(children, newIndex, cacheCol)
    },
    // 添加元素
    handleDragAdd(evt) {
      if (!Bus.draggingNode) return
      setDraggableAttr(evt.item)
      const { type, data } = Bus.draggingNode
      switch (type) {
        case 'col':
          this.rowConfig.children.splice(evt.newIndex, 0, data)
          this.refreshColsParentKey()
          break;
      }
      removeDragCloneDom(
        this.$refs['drag-wrapper'],
        '.f-table-col'
      )
    },
    // 结束拖拽
    handleDragEnd() {
      Bus.setDraggingNode(null)
    }
  }
}
</script>

<style lang="scss" scoped>
.f-table-row {
  position: relative;
  width: 100%;
  padding: 10px 5px;
  border: 1px solid #ebf0fe;
  background-color: #fff;
  box-sizing: border-box;
  &:nth-child(n + 2) {
    margin-top: -1px;
  }
  &:hover {
    z-index: 1;
    border-color: #00bfc4;
  }
  .row-drag {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 28px;
    line-height: 28px;
    background: #00bfc4;
    z-index: 20;
    i{
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: move;
    }
  }
}
.active-row {
  z-index: 1;
  border-color: #00bfc4;
}
.f-table-row__flex {
  display: flex;
}
</style>
<style lang="scss">
.ghost-row {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border: 1px solid #00bfc4;
  border-radius: 4px;
}
</style>
