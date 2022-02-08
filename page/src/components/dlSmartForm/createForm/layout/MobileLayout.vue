<!-- ！！！！只能排序,不能编辑和删除字段  自定义表单模板-移动端布局 -->
<template>
  <el-form label-width="120px">
    <v-contextmenu
      ref="contextmenu"
      :style="{
        'border-width': showFieldHandler ? '1px' : '0px'
      }">
      <v-contextmenu-item v-show="showFieldHandler && focusField.type !== 'divider'" @click="handleCommand('editField')">编辑字段</v-contextmenu-item>
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
        <row-com
          v-if="field.type === 'subform'"
          :row-index="index"
          :row-config="getSubformRow(field.domKey)"
          :row-key="getSubformRow(field.domKey).key"
          />
        <widget-item
          v-else
          @click.native="handleContentEdit(field)"
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
import Bus from '../Bus'
import Sortable from 'sortablejs'
import WidgetItem from '@/components/dlSmartForm/createForm/components/WidgetItem'
import {
  removeDragDom,
  hideContextMenu,
  removeDragCloneDom,
  setDraggableAttr
} from '../utils'

export default {
  name: 'mobile-layout',
  inject: ['layout', 'createSubFormBox'],
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
      return Bus.focusNodeKey
    },
    nodesMap() {
      return Bus.former.nodesMap
    },
    showFieldHandler() {
      return this.focusFieldIn && this.focusField
    }
  },
  created() {
    // 创建结构字段时，才可编辑
    if (this.editable) {
      Bus.$on('insert-field', this.insertField)

      this.$on('hook:destroyed', () => {
        Bus.$off('insert-field')
      })
    }
    Bus.$on('set-mobile-rows', this.setRows)
    Bus.$on('add-m-field', this.handleAddField)
    Bus.$on('delete-m-field', this.handleDelField)

    this.$on('hook:destroyed', () => {
      Bus.$off('set-mobile-rows')
      Bus.$off('add-m-field')
      Bus.$off('delete-m-field')
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
      this.rowsData.push(field)
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
      console.log('rowsData', rowsData)
      this.rowsData.splice(0, this.rowsData.length)
      this.rowsData.push(
        ...rowsData
      )
    },
    // 节点 聚焦
    handleNodeFocus(field) {
      this.hideContextMenu()
      Bus.setFocusNodeKey(field.name)
    },
    // 内容 聚焦
    handleContentFocus(node, subIndex) {
      this.hideContextMenu()
      if (!this.editable) return
      this.subIndex = subIndex
      // immobilization: 表示固定字段
      if (!node.immobilization) {
        this.focusFieldIn = true
        this.focusField = node
      } else {
        this.focusFieldIn = false
        this.focusField = null
      }
    },
    // 字段点击编辑
    handleContentEdit(field) {
      Bus.$emit('edit-node', field)
    },
    // 菜单操作
    handleCommand(type) {
      if (type === 'editField') {
        this.focusField && Bus.$emit('edit-node', this.focusField)
      } else if (type === 'delField') {
        this.focusField && this.$confirm('是否删除此字段?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Bus.$emit('delete-field', { fieldKey: this.focusField.name })
          this.layout === 'vertical' && this.$emit('ver_del-field', this.focusField)
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
      Bus.setDraggingNode({
        type: 'col',
        data: this.rowsData[evt.oldIndex]
      })
    },
    // 添加元素
    handleDragAdd(evt) {
      if (!Bus.draggingNode) return
      setDraggableAttr(evt.item)
      const { type, data } = Bus.draggingNode
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
      Bus.setDraggingNode(null)
    },
    // 插入字段
    insertField(field, index) {
      if (this.layout === 'singleField') {
        Bus.$emit('empty-fields')
        this.rowsData.splice(0, this.rowsData.length)
      }
      if (field.type === 'subform') {
        if (this.layout === 'vertical') return this.$message.error('重复上报表单中无法创建明细子表')
        this.createSubFormBox(-1)
      } else {
        Bus.$emit('add-field', { field })
        Bus.$emit('edit-node', field)
      }
      this.layout === 'vertical' && this.$emit('ver_add-field', field)
    },
    getSubformRow(domKey) {
      const node = this.nodesMap.get(domKey)
      return node
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
