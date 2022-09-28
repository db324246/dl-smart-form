<template>
  <div class="subform-template" :style="templateStyle">
    <div
      ref="drag-wrapper"
      class="drag-wrapper subform_box__body">
      <div class="subform_box-field drag-field"
        v-for="f in modelFields"
        :key="f.name"
        @click.stop="handleContentEdit(f)">
        {{f.label}}
        <i class="el-icon-circle-close close-icon"
          @click.stop="handleDelete(f.name)"></i>
      </div>
      <div v-if="!modelFields.length" class="empty-tip info-color">
        请拖拽字段到此
      </div>
    </div>
  </div>
</template>

<script>
import {
  removeDragCloneDom,
  setDraggableAttr
} from '@pr/createForm/utils'
import Sortable from 'sortablejs'
export default {
  name: 'subform-template',
  inject: ['eventBus'],
  props: {
    fieldObj: {
      type: Object,
      default: () => ({
        options: []
      })
    },
    templateStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      sortableWrap: null
    }
  },
  computed: {
    modelFields() {
      return this.fieldObj.modelFields || []
    },
    tableColumns() {
      return this.fieldObj.attrs.tableColumns || []
    },
    fieldAttachedRule() {
      return this.fieldObj.attrs.fieldAttachedRule || {}
    }
  },
  mounted() {
    this.sortableWrap = Sortable.create(
      this.$refs['drag-wrapper'],
      {
        group: {
          name: 'field',
          pull: true,
          put: ['field']
        },
        animation: 200,
        handle: '.drag-field',
        ghostClass: 'ghost-field', // 实现行影子样式
        onStart: this.handleDragStart.bind(this),
        onRemove: this.handleDragRemove.bind(this),
        onAdd: this.handleDragAdd.bind(this),
        onUpdate: this.handleDragUpdate.bind(this),
        onEnd: this.handleDragEnd.bind(this)
      }
    )
  },
  methods: {
    // 字段点击编辑
    handleContentEdit(field) {
      this.eventBus.$emit('edit-node', field)
    },
    handleDelete(fieldName) {
      const index = this.modelFields.findIndex(f => f.name === fieldName)
      const index1 = this.tableColumns.indexOf(fieldName)
      if (index1 >= 0) {
        this.tableColumns.splice(index1, 1)
      }
      this.modelFields.splice(index, 1)
      this.$delete(this.fieldAttachedRule, fieldName)
      this.eventBus.$emit('delete-field', {
        fieldKey: fieldName,
        excludeMobile: true // 排除添加到移动端模板
      })
    },
    // 开始拖拽
    handleDragStart(evt) {
      this.eventBus.setDraggingNode({
        type: 'field',
        data: this.modelFields[evt.oldIndex]
      })
    },
    // 移除元素
    handleDragRemove(evt) {
      const f = this.modelFields[evt.oldIndex]
      const index = this.tableColumns.indexOf(f.name)
      this.modelFields.splice(evt.oldIndex, 1)
      this.$delete(this.fieldAttachedRule, f.name)
      if (index >= 0) {
        this.tableColumns.splice(index, 1)
      }
    },
    // 拖拽排序更新
    handleDragUpdate(evt) {
      const { oldIndex, newIndex } = evt
      const children = this.modelFields
      const cacheCol = children[oldIndex]
      this.$set(children, oldIndex, children[newIndex])
      this.$set(children, newIndex, cacheCol)
    },
    // 添加元素
    handleDragAdd(evt) {
      if (!this.eventBus.draggingNode) return
      setDraggableAttr(evt.item)
      const { type, data } = this.eventBus.draggingNode
      console.log(type, data)
      switch (type) {
        case 'field':
          this.modelFields.splice(evt.newIndex, 0, data)
          this.tableColumns.push(data.name)
          this.$set(this.fieldAttachedRule, data.name, {
            showLabel: true,
            required: false
          })
          this.eventBus.$emit('add-field', {
            field: data,
            excludeMobile: true // 排除添加到移动端模板
          })
          this.eventBus.$emit('edit-node', data)
          break;
      }
      removeDragCloneDom(
        this.$refs['drag-wrapper'],
        '.field-component'
      )
    },
    // 结束拖拽
    handleDragEnd() {
      this.eventBus.setDraggingNode(null)
    }
  }
}
</script>

<style lang='scss' scoped>
.subform-template {
  position: relative;
  line-height: 23px;
  z-index: 12;
  .subform_box__title {
    font-size: 14px;
    padding: 10px 0 10px 20px;
    &::before {
      display: none;
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .subform_box__body {
    position: relative;
    display: flex;
    overflow-x: auto;
    padding: 5px 10px;
    min-height: 40px;
    background-color: #fff;
    border-radius: 4px;
    .subform_box-field {
      position: relative;
      flex: 1;
      width: 0;
      min-width: 120px;
      max-width: 300px;
      height: 50px;
      padding: 0 10px;
      line-height: 50px;
      border: 1px solid #ebf0fe;
      background-color: #f9fbff;
      font-size: 14px;
      color: #909399;
      &:hover {
        .close-icon {
          display: block;
        }
      }
      .close-icon {
        position: absolute;
        top: 5px;
        right: 5px;
        color: #f9253e;
        font-size: 16px;
        cursor: pointer;
        display: none;
      }
    }
    .subform_box-field+.subform_box-field {
      margin-left: 5px;
    }
    .empty-tip {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      text-align: center;
      font-size: 14px;
      padding: 10px 0 20px;
    }
  }
}
</style>
<style >
.ghost-field {
  width: 120px;
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  font-size: 14px;
  color: #909399;
  margin: 0 10px;
}
</style>
