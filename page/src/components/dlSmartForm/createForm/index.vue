<template>
  <div
    class='smart_form-container'
    @click.stop="handleRemoveContextmenu"
    @contextmenu.prevent="handleRemoveContextmenu">
    <div class='smart_form-components'>
      <field-selection>
      </field-selection>
    </div>
    <div class='smart_form-wrapper'>
      <two-layout-tab v-if="layout === 'default'"/>
      <vertical-layout v-else ref="verticalLayout"></vertical-layout>
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
import { deepClone, hideContextMenu, generateKey, generateCreateSubFormFn } from './utils'

export default {
  name: 'smart-form-create',
  components: {
    FieldConfig,
    FieldSelection,
    TwoLayoutTab,
    VerticalLayout
  },
  props: {
    /**
     * default: 自定义布局
     * vertical: 垂直布局 - 针对于重复上报表单
     * singleField：单字段布局
     */
    layout: { // 布局方式
      type: String,
      default: 'default'
    },
    // 展示元字段
    showOriginFields: { // 创建模板时展示的元字段
      type: Array,
      // default: () => (['base', 'layout'])
      default: () => (['base', 'high', 'layout'])
    },
    // 是否可选择重复上报表单字段 (创建重复上报表单时这个设为false)
    hasCiteFormFie: {
      type: Boolean,
      default: true
    },
    /**
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
    // 编辑状态下的表单数据
    editFormOptions: {
      type: Object,
      default: () => ({})
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
    /**
     * 含选项的字段可绑定的字典数组
     *{
        dictName: '',
        constantId: 131315
      }
     */
    dictionaryArr: {
      type: Array,
      default: () => []
    },
    /**
     * 获取字典项的操作函数
     * 函数应返回一个resolve 状态的 Promise，并传递字典选项数组
     * 字典选项： {
     *   key: '2020-2021',
     *   value: '2020-2021学年'
     * }
     */
    loadDictList: {
      type: Function,
      default: () => Promise.resolve([])
    }
  },
  provide() {
    return {
      layout: this.layout,
      fieldsArr: this.fieldsArr,
      fieldAttachedRule: this.fieldAttachedRule,
      extendedAttrs: this.extendedAttrs,
      generateFieldName: this.generateFieldName,
      dictionaryArr: this.dictionaryArr,
      loadDictList: this.loadDictList,
      createSubFormBox: generateCreateSubFormFn(
        this.generateFieldName,
        this.extendedAttrs
      ),
      getCorrelativeRules: () => {
        return this.fieldCorrelativeRules
      },
      scopedSlots: (field) => {
        return this.$scopedSlots.tag && this.$scopedSlots.tag(field)
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
        mediumWidth: 0
      }
    }
  },
  created() {
    // 创建表单实例
    Bus.initFormer()
    Bus.$on('add-field', this.handleAddField)
    Bus.$on('add-subForm-field', this.handleAddSubFormField)
    Bus.$on('add-subForm-colField', this.handleAddSubFormColField)
    Bus.$on('delete-field', this.handleDelField)
    Bus.$on('delete-subForm-field', this.handleDelSubFormField)
    Bus.$on('delete-subForm-colField', this.handleDelSubFormColField)
    Bus.$on('update-correlativeRules', this.handleUpdateCorrelativeRules)
    Bus.$on('empty-fields', this.handleEmpty)

    this.$on('hook:destroyed', () => {
      Bus.$off('add-subForm-field')
      Bus.$off('add-subForm-colField')
      Bus.$off('add-field')
      Bus.$off('delete-field')
      Bus.$off('delete-subForm-field')
      Bus.$off('delete-subForm-colField')
      Bus.$off('update-correlativeRules')
    })
  },
  methods: {
    // 编辑初始化
    editInitForm() {
      if (!Object.keys(this.editFormOptions).length) return
      this.fieldsArr.splice(0, this.fieldsArr.length)
      const { layout, attachedRule, form } = this.editFormOptions
      this.fieldAttachedRule = Object.assign(this.fieldAttachedRule, attachedRule.fieldAttachedRule || {})
      this.fieldCorrelativeRules.push(
        ...(attachedRule.fieldCorrelativeRules || [])
      )
      const pcLayout = layout.pcLayout
      if (layout.layoutType === 'default') {
        Bus.$emit('set-layout-config', pcLayout.layoutConfig || {})
      }
      if (layout.layoutType !== 'singleField') {
        // rowsData 结构数据因为明细子表在垂直模式下也被需要
        Bus.$emit('set-pc-rows', pcLayout.rowsData || [])
        console.log('00000000000', layout.mobileLayout)
        Bus.$emit('set-mobile-rows', layout.mobileLayout || [])
      }
      this.fieldsArr.push(
        ...form.map(f => this.syncFieldInitTo(f))
      )
    },
    // 添加字段
    handleAddField({ field }, virtual = false) {
      if (!['title', 'divider'].includes(field.type)) {
        this.$set(this.fieldAttachedRule, field.name, deepClone(this.defaultAttachedRule))
      }
      this.fieldsArr.push(field)
      // 对于明细子表中的title则不应该添加到移动端布局数据
      !virtual && Bus.$emit('add-m-field', field)
    },
    // 添加明细子表字段
    handleAddSubFormField(field) {
      this.$set(this.fieldAttachedRule, field.name, deepClone(this.defaultAttachedRule))
      this.fieldsArr.push(field)
      Bus.$emit('add-m-field', field)
    },
    // 添加明细子表列表项字段
    handleAddSubFormColField({ field, fieldName }) {
      this.$set(this.fieldAttachedRule, field.name, deepClone(this.defaultAttachedRule))
      const subFormField = this.fieldsArr.find(f => f.name === fieldName)
      subFormField.columnFields.push(field)
    },
    // 删除字段
    handleDelField({ fieldKey }) {
      this.$delete(this.fieldAttachedRule, fieldKey)
      const index = this.fieldsArr.findIndex(f => f.name === fieldKey)
      if (index >= 0) {
        this.fieldsArr.splice(index, 1)
      }
      this.handleDelCorrelativeRule(fieldKey)
      Bus.$emit('delete-m-field', fieldKey)
    },
    // 删除明细子表
    handleDelSubFormField(fieldName) {
      this.$delete(this.fieldAttachedRule, fieldName)
      const index = this.fieldsArr.findIndex(f => f.name === fieldName)
      this.fieldsArr.splice(index, 1)
      this.handleDelCorrelativeRule(fieldName)
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
    // 删除明细子表列表项字段
    handleDelSubFormColField({ fieldName, fieldKey }) {
      this.$delete(this.fieldAttachedRule, fieldKey)
      const subFormField = this.fieldsArr.find(f => f.name === fieldName)
      const index = subFormField.findIndex(f => f.name === fieldKey)
      subFormField.splice(index, 1)
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
        if (this.layout === 'singleField') {
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

        if (this.layout === 'vertical') {
          return r({
            modelFields: form,
            name: this.generateFieldName('arrayform'),
            type: 'arrayform',
            ...deepClone(this.extendedAttrs),
            attrs: {
              ...this.$refs.verticalLayout.formConfig,
              fieldAttachedRule: this.fieldAttachedRule,
              fieldCorrelativeRules: this.fieldCorrelativeRules
            }
          })
        }
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

<style lang='scss' scoped>
.smart_form-container {
  display: flex;
  height: 100%;
  user-select: none;
  .smart_form-wrapper {
    flex: 1;
    height: 100%;
    margin: 0 auto;
    border: 1px solid #ebf0fe;
    min-height: 600px;
  }
  .smart_form-components {
    flex: 1;
    min-width: 145px;
    max-width: 300px;
    height: 100%;
    margin-right: 10px;
    border: 1px solid #ebf0fe;
  }
  .smart_form-config {
    flex: 1;
    min-width: 250px;
    max-width: 300px;
    height: 100%;
    margin-left: 10px;
    border: 1px solid #ebf0fe;
  }
}
.el-tabs {
  margin-top: -1px;
}
</style>
