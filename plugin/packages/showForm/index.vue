<template>
  <div
    v-loading="loadingForm"
    class='custom_form-container'>
    <template v-if="!loadingForm">
      <flex-layout v-if="layoutType === 'default'"></flex-layout>
      <vertical-layout v-else-if="layoutType === 'vertical'"></vertical-layout>
    </template>
  </div>
</template>

<script>
import Bus from '../reportForm/Bus'
import FlexLayout from './layout/FlexTableLayout/index'
import VerticalLayout from './layout/VerticalLayout'
import { syncFieldInitTo, computeCorrelativeRule } from '../utils'
export default {
  name: 'smart-form-show',
  components: {
    FlexLayout,
    VerticalLayout
  },
  provide() {
    return {
      formId: this.formId,
      isEditable: this.isEditable,
      isFieldShow: this.isFieldShow,
      customAttrs: this.customAttrs,
      getLayoutData: () => {
        return this.layout
      },
      scopedSlotsMap: (slotName, data) => {
        return this.$scopedSlots[slotName] && this.$scopedSlots[slotName](data)
      }
    }
  },
  props: {
    formId: {
      type: String,
      default: Date.now().toString()
    },
    /**
     * 表单数据对象
     * {
     *  attachedRule 表单规则对象
     *  form 表单字段集合
     *  layout 表单布局对象
     * }
     */
    formData: {
      type: Object,
      required: true
    },
    // 上报数据
    reportData: {
      type: Object,
      default: () => ({})
    },
    // 字段是否展示，返回布尔值
    isFieldShow: {
      type: Function
    },
    // 自定义的组件参数对象
    customAttrs: {
      type: Object
    }
  },
  data() {
    return {
      loadingForm: true
    }
  },
  computed: {
    // 表单布局对象
    layout() {
      return this.formData.layout
    },
    /**
     * default: 自定义布局
     * vertical: 垂直布局 - 针对于重复上报表单
     * singleField：单字段布局
     */
    layoutType() {
      return this.layout.layoutType
    },
    // 表单规则对象
    attachedRule() {
      return this.formData.attachedRule || {}
    },
    // 字段附属规则
    fieldAttachedRule() {
      return this.attachedRule.fieldAttachedRule || {}
    },
    // 字段关联规则
    fieldCorrelativeRules() {
      return this.attachedRule.fieldCorrelativeRules || []
    },
    // 表单字段集合
    form() {
      return this.formData.form || []
    }
  },
  methods: {
    initShowForm() {
      this.loadingForm = true
      // 注册表单实例
      Bus.registerCoutomFormer(this.formId)
      this.$nextTick(() => {
        Bus.setReportData(this.formId, this.reportData)
        // 计算保存关联规则
        const correlativeRuleMap = computeCorrelativeRule(this.fieldCorrelativeRules)
        Bus.setCorrelativeRuleMap(this.formId, correlativeRuleMap)
        // 存储字段附属规则
        Bus.setAttachedRule(this.formId, this.fieldAttachedRule)

        this.form.forEach(f => {
          Bus.setField(this.formId, syncFieldInitTo(f))
        })
        setTimeout(() => {
          this.loadingForm = false
        }, 300)
      })
    }
  }
}
</script>

<style scoped>
.custom_form-container {
  min-height: 100px;
}
</style>
