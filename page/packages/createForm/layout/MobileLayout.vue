<template>
  <el-form>
    <v-contextmenu
      ref="contextmenu"
      :style="{
        'border-width': showFieldHandler ? '1px' : '0px'
      }">
      <v-contextmenu-item v-show="showFieldHandler && focusField.configurable" @click="handleCommand('editField')">编辑字段</v-contextmenu-item>
      <v-contextmenu-item v-show="showFieldHandler" @click="handleCommand('delField')">删除字段</v-contextmenu-item>
    </v-contextmenu>
    <div ref="drag-wrapper" class="drag-wrapper">
      <div
        class="drag-item"
        :class="{
          'active-item': focusNodeKey === field.name
        }"
        v-for="(field, index) in rowsData"
        :key="field.name"
        v-contextmenu:contextmenu
        @contextmenu.stop="handleContentFocus(field, index)"
        @click.stop="handleNodeFocus(field)">
        <widget-item
          @click.native="handleContentEdit(field.name)"
          :field-name="field.name"
          :data-index="index">
        </widget-item>

        <div v-if="draggable && focusNodeKey === field.name" class="row-drag">
          <i class="el-icon-rank drag-field"></i>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script>
import Sortable from 'sortablejs'
import WidgetItem from '@pr/createForm/components/WidgetItem'
import {
  removeDragDom,
  hideContextMenu,
  removeDragCloneDom,
  setDraggableAttr
} from '../utils'

export default {
  name: 'mobile-layout',
  inject: [
    'layout',
    'fieldsArr',
    'eventBus'
  ],
  components: {
    WidgetItem
  },
  props: {
    draggable: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rowsData: [],
      sortableWrap: null,
      subIndex: 0,
      focusFieldIn: false,
      focusField: null
    }
  },
  computed: {
    focusNodeKey() {
      return this.eventBus.focusNodeKey
    },
    nodesMap() {
      return this.eventBus.nodesMap
    },
    showFieldHandler() {
      return this.focusFieldIn && this.focusField
    }
  },
  created() {
    // 创建结构字段时，才可编辑
    if (this.editable) {
      this.eventBus.$on('insert-field', this.insertField)

      this.$on('hook:destroyed', () => {
        this.eventBus.$off('insert-field')
      })
    }
    this.eventBus.$on('set-mobile-rows', this.setRows)
    this.eventBus.$on('add-m-field', this.handleAddField)
    this.eventBus.$on('delete-m-field', this.handleDelField)

    this.$on('hook:destroyed', () => {
      this.eventBus.$off('set-mobile-rows')
      this.eventBus.$off('add-m-field')
      this.eventBus.$off('delete-m-field')
    })
  },
  mounted() {
    if (!this.draggable) return
    this.sortableWrap = Sortable.create(
      this.$refs['drag-wrapper'],
      {
        group: {
          name: 'field',
          pull: false,
          put: this.editable ? ['field'] : false
        },
        animation: 200,
        handle: '.drag-field',
        ghostClass: 'ghost-field', // 实现行影子样式
        onStart: this.handleDragStart.bind(this),
        onAdd: this.handleDragAdd.bind(this),
        onUpdate: this.handleDragUpdate.bind(this),
        onEnd: this.handleDragEnd.bind(this)
      }
    )
  },
  methods: {
    // 新增字段
    handleAddField(field) {
      const fieldInfo = {
        key: field.key,
        name: field.name,
        type: field.type
      }
      this.rowsData.push(fieldInfo)
    },
    // 删除字段
    handleDelField(fieldKey) {
      const index = this.rowsData.findIndex(f => f.name === fieldKey)
      if (index >= 0) {
        this.rowsData.splice(index, 1)
      }
    },
    // 设置行数据
    setRows(rowsData = []) {
      this.rowsData.splice(0, this.rowsData.length)
      this.rowsData.push(
        ...rowsData
      )
    },
    // 节点 聚焦
    handleNodeFocus(field) {
      this.hideContextMenu()
      this.eventBus.setFocusNodeKey(field.name)
    },
    // 内容 聚焦
    handleContentFocus(node, subIndex) {
      this.hideContextMenu()
      if (!this.editable) return
      this.subIndex = subIndex
      this.focusFieldIn = true
      this.focusField = node
    },
    // 字段点击编辑
    handleContentEdit(fieldName) {
      const field = this.fieldsArr.find(f => f.name === fieldName)
      this.eventBus.$emit('edit-node', field)
    },
    // 菜单操作
    handleCommand(type) {
      if (type === 'editField') {
        this.focusField && this.handleContentEdit(this.focusField.name)
      } else if (type === 'delField') {
        this.focusField && this.$confirm('是否删除此字段?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.eventBus.$emit('delete-field', { fieldKey: this.focusField.name })
        })
      }
    },
    // 隐藏 右击菜单项
    hideContextMenu() {
      hideContextMenu()
      this.$refs.contextmenu.hide()
    },
    // 开始拖拽
    handleDragStart(evt) {
      this.eventBus.setDraggingNode({
        type: 'col',
        data: this.rowsData[evt.oldIndex]
      })
    },
    // 添加元素
    handleDragAdd(evt) {
      if (!this.eventBus.draggingNode) return
      setDraggableAttr(evt.item)
      const { type, data } = this.eventBus.draggingNode
      type === 'field' && this.insertField(data, evt.newIndex)

      removeDragDom(
        this.$refs['drag-wrapper'],
        '.field-component'
      )
      removeDragCloneDom(
        this.$refs['drag-wrapper'],
        '.drag-item'
      )
    },
    // 拖拽排序更新
    handleDragUpdate(evt) {
      const { oldIndex, newIndex } = evt
      const node = this.rowsData[oldIndex]
      this.rowsData.splice(oldIndex, 1)
      this.rowsData.splice(newIndex, 0, node)
    },
    // 结束拖拽
    handleDragEnd() {
      this.eventBus.setDraggingNode(null)
    },
    // 插入字段
    insertField(field, index) {
      if (this.layout === 'single') {
        this.eventBus.$emit('empty-fields')
        this.rowsData.splice(0, this.rowsData.length)
      }

      this.eventBus.$emit('add-field', { field })
      this.eventBus.$emit('edit-node', field)
    },
    // 获取布局数据
    getLayout() {
      return this.rowsData
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  width: 600px;
  margin: 0 auto;
  height: 100%;
  .drag-wrapper {
    height: 100%;
    padding-bottom: 50px;
    overflow-y: auto;
    box-sizing: border-box;
    .drag-item {
      position: relative;
      padding: 10px;
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
    .active-item {
      z-index: 1;
      border-color: #00bfc4;
    }
  }
}
</style>
<style lang="scss">
.ghost-field {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  border: 1px solid #00bfc4;
  border-radius: 4px;
}
</style>
