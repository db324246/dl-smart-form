<template>
  <div
    class='smart_form-container'
    @click.stop="handleRemoveContextmenu"
    @contextmenu.prevent="handleRemoveContextmenu">
    <div class='smart_form-components'>
      <field-selection></field-selection>
      <!-- 字段插入对话框 -->
      <field-insert-dialog></field-insert-dialog>
    </div>
    <div class='smart_form-wrapper'>
      <two-layout-tab v-if="layout === 'default'"/>
      <vertical-layout v-else-if="layout === 'single'" ref="verticalLayout"></vertical-layout>
    </div>
    <div class='smart_form-config'>
      <field-config></field-config>
    </div>
  </div>
</template>

<script>
import Bus from './Bus'
import TwoLayoutTab from './layout/TwoLayoutTab'
import VerticalLayout from './layout/VerticalLayout'
import FieldConfig from './components/FieldConfig'
import FieldSelection from './components/FieldSelection'
import FieldInsertDialog from './components/FieldSelection/FieldInsertDialog'
import { deepClone, hideContextMenu, generateKey, syncFieldInitTo } from './utils'

export default {
  name: 'smart-form-create',
  components: {
    FieldConfig,
    FieldSelection,
    TwoLayoutTab,
    VerticalLayout,
    FieldInsertDialog
  },
  props: {
    /**
     * default: 自定义布局
     * single：单字段布局
     */
    layout: { // 布局方式
      type: String,
      default: 'default'
    },
    // 展示元字段
    showOriginFields: { // 创建模板时展示的元字段
      type: Array,
      default: () => (['base', 'high', 'layout'])
    },
    // 字段扩展属性
    extendedAttrs: {
      type: Object,
      default: () => ({})
    },
    // 字段name 前缀
    prefixName: {
      type: String
    },
    // 自定义的组件参数对象
    customAttrs: {
      type: Object
    }
  },
  provide() {
    return {
      eventBus: Bus,
      layout: this.layout,
      fieldsArr: this.fieldsArr,
      extendedAttrs: this.extendedAttrs,
      generateFieldName: this.generateFieldName,
      customAttrs: this.customAttrs,
      getCorrelativeRules: () => {
        return this.fieldCorrelativeRules
      },
      getFieldAttachedRules: () => {
        return this.fieldAttachedRule
      },
      scopedSlotsMap: (slotName, data) => {
        return this.$scopedSlots[slotName] && this.$scopedSlots[slotName](data)
      }
    }
  },
  data() {
    return {
      generateFieldName: (type = '') => {
        return `${this.prefixName || type}_${generateKey('field_')}`
      },
      fieldsArr: [], // 字段集合
      fieldAttachedRule: {}, // 字段附属规则
      fieldCorrelativeRules: [], // 字段关联规则
      defaultAttachedRule: { // 默认的模板附属规则
        showLabel: true,
        required: false,
        labelWidth: 100,
        mediumWidth: 0,
        labelPosition: 'right'
      }
    }
  },
  created() {
    Bus.$on('add-field', this.handleAddField)
    Bus.$on('delete-field', this.handleDelField)
    Bus.$on('update-correlativeRules', this.handleUpdateCorrelativeRules)
    Bus.$on('empty-fields', this.handleEmpty)

    this.$on('hook:destroyed', () => {
      Bus.$off('add-field')
      Bus.$off('delete-field')
      Bus.$off('update-correlativeRules')
    })
  },
  methods: {
    /**
     * 编辑初始化
     * formData:
     * {
        form: [],
        layout: {
          layoutType: 'default',
          pcLayout: {
            layoutConfig: {}
            rowsData: []
          }
        },
        attachedRule: {
          fieldAttachedRule: {},
          fieldCorrelativeRules: []
        }
      }
     */
    initFormData(formData) {
      if (!Object.keys(formData).length) return
      // 重置表单实例
      Bus.initFormer()
      this.fieldsArr.splice(0, this.fieldsArr.length)
      const { layout, attachedRule, form } = formData
      this.fieldAttachedRule = attachedRule.fieldAttachedRule || {}
      this.fieldCorrelativeRules = attachedRule.fieldCorrelativeRules || []
      const pcLayout = layout.pcLayout
      if (layout.layoutType === 'default') {
        Bus.$emit('set-layout-config', pcLayout.layoutConfig || {})
      }
      if (layout.layoutType !== 'single') {
        Bus.$emit('set-pc-rows', pcLayout.rowsData || [])
        Bus.$emit('set-mobile-rows', layout.mobileLayout || [])
      }
      this.fieldsArr.push(
        ...form.map(f => syncFieldInitTo(f))
      )
    },
    // 添加字段
    handleAddField({ field, excludeMobile }) {
      if (!['title', 'divider'].includes(field.type)) {
        this.$set(this.fieldAttachedRule, field.name, deepClone(this.defaultAttachedRule))
      }
      this.fieldsArr.push(field)
      // excludeMobile 排除添加到移动端模板
      !excludeMobile && Bus.$emit('add-m-field', field)
    },
    // 删除字段
    handleDelField({ fieldKey, excludeMobile }) {
      // excludeMobile 排除到移动端模板删除
      !excludeMobile && Bus.$emit('delete-m-field', fieldKey)
      // 微任务异步删除
      this.$nextTick(() => {
        this.$delete(this.fieldAttachedRule, fieldKey)
        const index = this.fieldsArr.findIndex(f => f.name === fieldKey)
        if (index >= 0) {
          this.fieldsArr.splice(index, 1)
        }
        this.handleDelCorrelativeRule(fieldKey)
      })
    },
    // 删除字段相关关联规则
    handleDelCorrelativeRule(fieldName) {
      this.fieldCorrelativeRules.forEach((item, index) => {
        item.conditions = item.conditions.filter(c => {
          return (c.fieldName !== fieldName)
        })
        item.T_handle = item.T_handle.filter(h => {
          return (h.fieldName !== fieldName)
        })
        item.F_handle = item.F_handle.filter(h => {
          return (h.fieldName !== fieldName)
        })
      })
      this.fieldCorrelativeRules = this.fieldCorrelativeRules
        .filter(item => item.conditions.length > 0)
    },
    // 更新字段关联规则
    handleUpdateCorrelativeRules(fieldCorrelativeRules) {
      this.fieldCorrelativeRules = fieldCorrelativeRules
    },
    // 清空字段
    handleEmpty() {
      this.fieldsArr.forEach(f => {
        this.$delete(this.fieldAttachedRule, f.name)
      })
      this.fieldsArr.splice(0, this.fieldsArr.length)
    },
    // 移除右击菜单
    handleRemoveContextmenu(e) {
      hideContextMenu()
    },
    // 获取整个表单的数据
    getCustomFormData() {
      return new Promise(r => {
        if (this.layout === 'single') {
          return r(
            this.fieldsArr[0]
          )
        }
        // 附属规则
        const attachedRule = {
          fieldAttachedRule: this.fieldAttachedRule,
          fieldCorrelativeRules: this.fieldCorrelativeRules
        }
        // 字段集合
        const form = this.fieldsArr.slice()
        Bus.$emit('get-layout', (data) => {
          // 布局字段
          const layout = {
            ...data,
            layoutType: this.layout
          }
          r({ layout, form, attachedRule })
        })
      })
    }
  }
}
</script>

<style scoped>
.smart_form-container {
  display: flex;
  height: 100%;
  user-select: none;
}
.smart_form-container .smart_form-wrapper {
  flex: 1;
  height: 100%;
  margin: 0 auto;
  border: 1px solid #ebf0fe;
  min-height: 600px;
}
.smart_form-container .smart_form-components {
  flex: 1;
  min-width: 145px;
  max-width: 300px;
  height: 100%;
  margin-right: 10px;
  border: 1px solid #ebf0fe;
}
.smart_form-container .smart_form-config {
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  height: 100%;
  margin-left: 10px;
  border: 1px solid #ebf0fe;
}
.el-tabs {
  margin-top: -1px;
}
</style>
