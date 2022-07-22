<template>
  <div class='field-selection'>
    <smart-title title="字段选择"></smart-title>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="item in showOriginFields"
        :key="item.key"
        :title="item.title"
        :name="item.key">
        <div :ref="`drag-wrapper_${item.key}`" class="drag-wrapper">
          <div
            class="field-component drag-item"
            :class="{
              'array-com': com.field.type === 'arrayform'
            }"
            :key="'base' + index"
            v-for="(com, index) in item.components">
            <span>{{com.field.label}}</span>
          </div>
          <div class="field-component hide-com"></div>
        </div>
      </el-collapse-item>

      <el-collapse-item
        v-for="(item, index) in customFields"
        :key="index"
        :title="item.groupName" :name="item.groupName">
        <div
          :ref="`drag-wrapper_${item.groupKey}`"
          class="drag-wrapper">
          <div
            v-for="(com, index) in item.components"
            class="field-component drag-item"
            :class="{
              'array-com': com.field.type === 'arrayform'
            }"
            :key="item.groupKey + index">
            <span>{{com.field.label}}</span>
          </div>
          <div class="field-component hide-com"></div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Bus from '../Bus'
import store from '@pr/store'
import Sortable from 'sortablejs'
import { deepClone, syncFieldInitTo } from '../utils'
import smartTitle from '../../components/smartTitle'
import { basicComponents, advanceComponents, layoutComponents } from '../../components/fields'

export default {
  name: 'field-selection',
  components: {
    smartTitle
  },
  inject: [
    'layout',
    'fieldsArr',
    'extendedAttrs',
    'generateFieldName'
  ],
  data() {
    return {
      activeNames: '',
      originFieldsConfig: {
        base: {
          key: 'base',
          title: '基础字段',
          components: basicComponents
        },
        high: {
          key: 'high',
          title: '高阶字段',
          components: advanceComponents
        },
        layout: {
          key: 'layout',
          title: '布局字段',
          components: layoutComponents
        }
      },
      complexFields: [
        'arrayform'
      ]
    }
  },
  computed: {
    customFields() {
      return store.customFields
    },
    showOriginFields() {
      return this.$parent.showOriginFields.map(item => this.originFieldsConfig[item]).filter(item => item)
    }
  },
  created() {
    this.computedCoustomFields()
    store.$on('fields-register', this.computedCoustomFields)

    this.$on('hook:destroyed', () => {
      store.$off('fields-register')
    })
  },
  mounted() {
    this.draggInit()
  },
  methods: {
    // 计算字段字段
    computedCoustomFields() {
      this.$nextTick(() => {
        this.customFields.forEach(item => {
          Sortable.create(
            this.$refs['drag-wrapper_' + item.groupKey][0],
            this.genenrateConfig(item.components)
          )
        })
      })
    },
    draggInit() {
      this.showOriginFields.forEach(item => {
        Sortable.create(
          this.$refs[`drag-wrapper_${item.key}`][0],
          this.genenrateConfig(item.components)
        )
      })
    },
    // 开始拖拽
    handleDragStart(evt, components) {
      const field = components[evt.oldIndex].field
      Bus.setDraggingNode({
        type: 'field',
        data: {
          name: this.generateFieldName(field.type),
          ...syncFieldInitTo(field),
          ...deepClone(this.extendedAttrs)
        }
      })
    },
    // 结束拖拽
    handleDragEnd() {
      Bus.setDraggingNode(null)
    },
    genenrateConfig(components) {
      return {
        sort: false,
        group: {
          name: 'field',
          pull: 'clone',
          put: false
        },
        animation: 200,
        dragClass: 'field-gragged',
        draggable: '.drag-item',
        onStart: event => {
          this.handleDragStart(event, components)
        },
        onEnd: this.handleDragEnd.bind(this)
      }
    }
  }
}
</script>

<style scoped>
.field-selection {
  height: 100%;
  padding-bottom: 50px;
  overflow-y: auto;
  box-sizing: border-box;
}
.smart-title >>> .smart-title__name{
  font-size: 18px;
  color: #00bfc4;
}
.el-collapse {
  padding: 0 10px;
  border: none;
}
.el-collapse .drag-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.el-collapse .drag-wrapper .field-component {
  flex: 1;
  margin-bottom: 20px;
  font-size: 14px;
  font-size: 14px;
  color: #5F5F5F;
  text-align: left;
}
.el-collapse .drag-wrapper .field-component span {
  display: inline-block;
  width: 112px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background: #FFFFFF;
  border: 1px dashed #CBCBCB;
  border-radius: 4px;
  cursor: pointer;
}
.el-collapse .drag-wrapper .complex-com {
  min-width: 100%;
}
.el-collapse .drag-wrapper .complex-com span {
  width: 100%;
  max-width: 250px;
  padding-left: 15px;
  border-color: #00bfc4;
  color: #00bfc4;
  text-align: left;
}
.el-collapse .drag-wrapper .hide-com {
  min-width: 110px;
  margin-bottom: 0;
}
.custom-fields-button {
  padding: 0 10px;
  margin-bottom: 5px;
}
.field-gragged {
  border: 1px dashed #00bfc4;
  border-radius: 4px;
}
.ghost-row {
  border: 1px solid #00bfc4;
  border-radius: 4px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.disabled-tag {
  cursor: not-allowed;
}
.empty-tip {
  font-size: 14px;
  color: #b0b0b0;
  text-align: center;
}
.el-checkbox.is-bordered {
  border-style: dashed;
  margin-right: 0;
  margin-bottom: 10px;
}
.field-item{
  margin-left: 0px !important;
  margin-right: 10px !important;
}
</style>
