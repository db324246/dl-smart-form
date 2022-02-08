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
    <v-contextmenu ref="contextmenu" :style="{
      'border-width': !isSubForm || subFormCol ? '1px' : '0px'
    }">
      <v-contextmenu-submenu v-show="!isSubForm || subFormCol" title="插入">
        <v-contextmenu-item v-show="!isSubForm || subFormCol" @click="handleCommand('insertCol')">单元格</v-contextmenu-item>
        <v-contextmenu-item v-show="!isSubForm" @click="handleCommand('insertTopRow')">行(在上方)</v-contextmenu-item>
        <v-contextmenu-item v-show="!isSubForm" @click="handleCommand('insertBottomRow')">行(在下方)</v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-item v-show="!isSubForm" divider></v-contextmenu-item>
      <v-contextmenu-item v-show="!isSubForm" @click="handleCommand('delRow')">删除行</v-contextmenu-item>
      <v-contextmenu-item v-show="!isSubForm" divider></v-contextmenu-item>
      <v-contextmenu-item v-show="!isSubForm" :disabled="rowIndex === 0" @click="handleCommand('upRow')">前移行</v-contextmenu-item>
    </v-contextmenu>

    <div
      ref="drag-wrapper"
      class="drag-wrapper f-table-row__flex"
      :style="(!isSubForm || subFormCol)
        ? { 'overflow-x': 'auto' }
        : {}">
      <template v-if="isSubForm && subFormCol">
        <col-com
          :key="item.key"
          v-for="(item, index) in rowConfig.children"
          :col-data="item"
          :col-index="index"
          :style="{
            'min-width': '240px',
            'text-align': item.align.split('_')[1],
            'vertical-align': item.align.split('_')[0]
          }"/>
      </template>
      <template v-else>
        <col-com
          :key="item.key"
          v-for="(item, index) in rowConfig.children"
          :col-data="item"
          :col-index="index"
          :style="{
            'max-width': item.width ? item.width + 'px' : 'auto',
            'min-width': item.width ? item.width + 'px' : 'auto',
            'text-align': item.align.split('_')[1],
            'vertical-align': item.align.split('_')[0]
          }"/>
      </template>
    </div>

    <div v-if="active" class="row-drag">
      <i class="el-icon-rank drag-row"></i>
    </div>

    <template v-if="active && isSubForm">
      <div class="subForm-actions">
        <!-- <i class="el-icon-edit-outline" title="编辑" @click.stop="handleSubFormEdit"></i> -->
        <i class="el-icon-delete" title="删除" @click.stop="handleSubFormDelete"></i>
      </div>
    </template>
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
      return Bus.former.nodesMap
    },
    // 是否是明细字表结构
    isSubForm() {
      return this.rowConfig.isSubForm
    },
    // 是否是明细字表col项
    subFormCol() {
      return !!this.rowConfig.subFormCol
    },
    active() {
      return Bus.focusNodeKey === this.rowKey
    }
  },
  mounted() {
    if (this.rowConfig.fixed) return
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
      const parentKey = this.rowConfig.parentKey
      if (parentKey !== -1) {
        const parent = this.nodesMap.get(parentKey)
        if (parent && parent.fixed) return
      }
      Bus.setFocusNodeKey(this.rowKey)
    },
    // 插入列
    insertCol(sourceIndex) {
      let defaultCol
      if (this.isSubForm && this.subFormCol) {
        defaultCol = createCol(this.rowKey, false, {
          fieldName: this.rowConfig.fieldName,
          isSubForm: true,
          subFormCol: true
        })
      } else {
        defaultCol = createCol(this.rowKey)
      }
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
    // 删除明细字表或行
    handleSubFormDelete() {
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
          this.handleSubFormDelete()
          break;
        case 'upRow': // 前移行
          Bus.$emit('exchange-row', this.rowIndex, this.rowIndex - 1, this.rowKey)
          break;
      }
    },
    // 隐藏 右击菜单项
    hideContextMenu() {
      hideContextMenu()
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
        console.log('rorow -- $emit', this.rowKey)
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
      console.log(type, data)
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
  .subForm-actions {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 28px;
    line-height: 28px;
    background: #00bfc4;
    z-index: 20;
    i{
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
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
