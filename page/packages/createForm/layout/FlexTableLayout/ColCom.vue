<template>
  <div
    class='f-table-col'
    :class="{
      'active-col': active
    }"
    :style="computedStyles"
    v-bind="$attrs"
    v-contextmenu:contextmenu
    @contextmenu.stop.prevent="handlerFocus"
    @click.stop="handleNodeFocus">
    <v-contextmenu ref="contextmenu"
      :node-key="colData.key"
      :style="{
        'border-width': '1px'
      }"
      @contextmenu.native.stop.prevent>
      <v-contextmenu-submenu title="新增">
        <v-contextmenu-item @click="handleCommand('newFields')">字段</v-contextmenu-item>
        <v-contextmenu-item @click="handleCommand('newRow')">在单元格里新增表格行</v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-submenu title="插入">
        <v-contextmenu-item @click="handleCommand('insertLeftCol')">单元格(在左侧)</v-contextmenu-item>
        <v-contextmenu-item @click="handleCommand('insertRightCol')">单元格(在右侧)</v-contextmenu-item>
        <v-contextmenu-item @click="handleCommand('insertTopRow')">行(在上方)</v-contextmenu-item>
        <v-contextmenu-item @click="handleCommand('insertBottomRow')">行(在下方)</v-contextmenu-item>
      </v-contextmenu-submenu >
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="handleCommand('editColAttr')">编辑单元格</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="handleCommand('emptyCol')">清空单元格</v-contextmenu-item>
      <v-contextmenu-item @click="handleCommand('delCol')">删除单元格</v-contextmenu-item>
      <v-contextmenu-item @click="handleCommand('delRow')">删除行</v-contextmenu-item>
    </v-contextmenu>

    <div ref="drag-wrapper" class="drag-wrapper">
      <template v-for="(item, index) in colData.children">
        <widget-item
          v-if="item.domtype === 'field'"
          :key="item.key"
          :dom-key="colData.key"
          :field-name="item.fieldName"
          v-contextmenu:contextmenu
          @click.native="handleContentEdit(item.fieldName)">
        </widget-item>
        <row-com
          v-else-if="item.domtype === 'row'"
          :key="item.key"
          :row-index="index"
          :row-config="item"
          :row-key="item.key"/>
      </template>
    </div>

    <div
      v-if="active"
      class="col-drag">
      <i class="el-icon-rank drag-col"></i>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import WidgetItem from '../../components/WidgetItem.vue'
import {
  hideContextMenu,
  createRow,
  removeDragDom,
  removeDragCloneDom,
  setDraggableAttr
} from '../../utils'
export default {
  name: 'col-com',
  components: {
    WidgetItem
  },
  inject: [
    'rowKey',
    'rowVm',
    'fieldsArr',
    'eventBus'
  ],
  props: {
    colData: {
      type: Object,
      required: true
    },
    colIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      focusFieldIn: false,
      focusField: null,
      sortableWrap: null
    }
  },
  computed: {
    rowIndex() {
      return this.rowVm.rowIndex
    },
    // 判断行中是否只有一列
    isOnlyCol() {
      return this.rowVm.rowConfig.children.length === 1
    },
    // 列 中是否插入了字段
    hasFiled() {
      return this.colData.children.filter(item => {
        return item.domtype === 'field'
      }).length > 0
    },
    // 列 中是否插入了行
    hasRowNode() {
      return this.colData.children.filter(item => {
        return item.domtype === 'row'
      }).length > 0
    },
    active() {
      return this.eventBus.focusNodeKey === this.colData.key
    },
    computedStyles() {
      const width = this.colData.width
      return {
        'max-width': width ? width + 22 + 'px' : '100%',
        'min-width': width ? width + 22 + 'px' : 'auto',
        width: width ? width + 22 + 'px' : '100%'
      }
    }
  },
  created() {
    // 递归删除col
    this.eventBus.$on('delete-col', colKey => {
      if (this.colData.key !== colKey) return
      this.hasFiled && this.deleteField()
      this.hasRowNode && this.deleteRow()
      this.rowVm.deleletCol(colKey)
    })
    this.eventBus.$on('delete-field', ({ domKey, fieldKey }) => {
      if (this.colData.key !== domKey) return

      this.colData.children = this.colData.children.filter(item => {
        if (item.domtype !== 'field') return true
        else return item.fieldName !== fieldKey
      })
    })
    this.eventBus.$on('liquidation-rows', () => {
      const indexs = []
      this.colData.children.forEach((node, index) => {
        if (node.domtype === 'row' && !node.children.length) {
          indexs.push(index)
        }
      })
      indexs.reverse().forEach(i => {
        this.colData.children.splice(i, 1)
      })
    })
  },
  mounted() {
    this.sortableWrap = Sortable.create(
      this.$refs['drag-wrapper'],
      {
        group: {
          name: 'row',
          pull: true,
          put: ['row', 'field']
        },
        animation: 200,
        handle: '.drag-row',
        draggable: '.f-table-row',
        ghostClass: 'ghost-row', // 实现行影子样式
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
      this.hideContextMenu(true)
      this.eventBus.setFocusNodeKey(this.colData.key)
    },
    // 字段点击编辑
    handleContentEdit(fieldName) {
      this.eventBus.$emit('edit-node', this.fieldsArr.find(f => f.name === fieldName))
    },
    // 列 右击聚焦
    handlerFocus() {
      this.hideContextMenu()
      this.focusFieldIn = false
      this.focusField = null
    },
    // 右击菜单项点击- 事件
    handleCommand(type) {
      switch (type) {
        case 'newRow': // 新增行
          (() => {
            const row = createRow(this.colData.key)
            this.colData.children.push({
              domtype: 'row',
              ...row
            })
          })()
          break;
        case 'newFields': // 新增字段
          this.eventBus.$emit('show-insert-dialog', this.colData)
          break;
        case 'insertLeftCol': // 插入一列在左边
          this.rowVm.insertCol(this.colIndex)
          break;
        case 'insertRightCol': // 插入一列在右边
          this.rowVm.insertCol(this.colIndex + 1)
          break;
        case 'insertTopRow': // 插入一行在上边
          this.eventBus.$emit('insert-row', this.rowIndex, this.rowKey)
          break;
        case 'insertBottomRow': // 插入一行在下边
          this.eventBus.$emit('insert-row', this.rowIndex + 1, this.rowKey)
          break;
        case 'editColAttr': // 编辑列属性
          this.eventBus.$emit('edit-node', this.colData)
          break;
        case 'emptyCol': // 清空列
          this.hasField && this.deleteField()
          this.hasRowNode && this.deleteRow()
          break;
        case 'delCol': // 删除单元格
          this.$confirm('删除后不可撤销，确认删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.hasFiled && this.deleteField()
            this.hasRowNode && this.deleteRow()
            if (this.isOnlyCol) {
              this.rowVm.deleletCol(this.colData.key)
              this.eventBus.$emit('delete-row', this.rowKey)
            } else {
              this.rowVm.deleletCol(this.colData.key)
            }
          })
          break;
        case 'delRow': // 删除行
          this.$confirm('删除后不可撤销，确认删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.eventBus.$emit('delete-row', this.rowKey)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break;
      }
    },
    // 删除字段
    deleteField() {
      const filedName = this.colData.children.find(node => node.domtype === 'field').fieldName
      this.eventBus.$emit('delete-field', {
        domKey: this.colData.key,
        fieldKey: filedName
      })
    },
    // 删除列下的行
    deleteRow() {
      const rowKeys = this.colData.children
        .filter(node => node.domtype === 'row')
        .map(row => row.key)
      rowKeys.forEach(rk => this.eventBus.$emit('delete-row', rk))
    },
    // 隐藏 右击菜单项
    hideContextMenu(hide) {
      hideContextMenu(this.colData.key, hide)
      this.$refs.contextmenu.hide()
    },
    // 开始拖拽
    handleDragStart(evt) {
      this.eventBus.setDraggingNode({
        type: 'row',
        data: this.colData.children[evt.oldIndex]
      })
    },
    // 移除元素
    handleDragRemove(evt) {
      this.colData.children.splice(evt.oldIndex, 1)
    },
    // 拖拽排序更新
    handleDragUpdate(evt) {
      const { oldIndex, newIndex } = evt
      const children = this.colData.children
      const cacheCol = children[oldIndex]
      this.$set(children, oldIndex, children[newIndex])
      this.$set(children, newIndex, cacheCol)
    },
    // 添加元素
    handleDragAdd(evt) {
      if (!this.eventBus.draggingNode) return
      setDraggableAttr(evt.item)
      const { type, data } = this.eventBus.draggingNode
      switch (type) {
        case 'row':
          this.colData.children.splice(evt.newIndex, 0, data)
          data.parentKey = this.colData.key
          break;
        case 'field':
          (() => {
            removeDragDom(
              this.$refs['drag-wrapper'],
              '.field-component'
            )
            if (this.hasFiled) return this.$message.error('节点中已存在字段')
            this.eventBus.$emit('add-field', {
              field: data
            })
            this.eventBus.$emit('edit-node', data)
            this.colData.children.splice(evt.newIndex, 0, {
              domtype: 'field',
              parentKey: this.colData.key,
              fieldName: data.name,
              key: data.name
              // ...data
            })
          })()
          break;
      }
      removeDragCloneDom(
        this.$refs['drag-wrapper'],
        '.f-table-row'
      )
    },
    // 结束拖拽
    handleDragEnd() {
      this.colData.children.forEach(node => {
        node.parentKey = this.colData.key
      })
      this.eventBus.setDraggingNode(null)
    }
  }
}
</script>

<style scoped>
.f-table-col {
  position: relative;
  flex: 1;
  margin: 0 5px;
  position: relative;
  min-height: 50px;
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px dashed #ebf0fe;
  z-index: 1;
  background-color: rgba(236, 245, 255, .8);
}
.f-table-col:hover {
  border-color: #00bfc4;
}
.f-table-col .drag-wrapper {
  height: 100%;
}
.f-table-col .col-drag {
  position: absolute;
  left: 0;
  top: 0;
  height: 28px;
  line-height: 28px;
  background: #00bfc4;
  z-index: 20;
}
.f-table-col .col-drag i{
  font-size: 14px;
  color: #fff;
  margin: 0 5px;
  cursor: move;
}
.active-col {
  border-color: #00bfc4;
}
</style>
<style lang="scss">
.ghost-col{
  width: 100%;
  border: 1px dashed #ffa921;
  border-radius: 4px;
}
</style>
