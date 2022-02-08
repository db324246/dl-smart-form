<template>
  <div
    v-loading="loadingForm"
    class='custom_form-container'>
    <template v-if="!loadingForm">
      <flex-layout v-if="layout === 'default'"></flex-layout>
      <vertical-layout v-else-if="layout === 'vertical'"></vertical-layout>
    </template>
  </div>
</template>

<script>
import FlexLayout from './layout/FlexTableLayout/index'
import VerticalLayout from './layout/VerticalLayout'
import { computeCorrelativeRule, syncFieldInitTo } from '../utils'
export default {
  name: 'custom-form-show',
  components: {
    FlexLayout,
    VerticalLayout
  },
  provide() {
    return {
      queryImportArrayformData: this.queryImportArrayformData,
      arrayformWay: this.arrayformWay,
      fileCode: this.fileCode,
      isEditable: this.isEditable,
      arrayformSubmit: this.arrayformSubmit,
      isArrayformEdit: this.isArrayformEdit,
      isFieldShow: this.isFieldShow,
      loadDictList: this.loadDictList,
      getFormId: () => this.formId,
      getLayoutData: () => {
        return this.layoutData
      },
      getFieldsArr: () => {
        return this.form
      },
      getReportData: () => {
        return this.reportData
      },
      tagScopedSlots: (field) => {
        return this.$scopedSlots.tag && this.$scopedSlots.tag(field)
      },
      tableTagScopedSlots: (data) => {
        return this.$scopedSlots.tableTag && this.$scopedSlots.tableTag(data)
      }
    }
  },
  created() {
    console.log('111111获取isArrayformEdit', this.isArrayformEdit)
  },
  props: {
    /**
     * 获取重复上报的导入的分页数据
     * 函数应返回一个resolve 状态的 Promise，并传递导入的数据分页数组和统计
     * data： {
     *   records: [...],
     *   total: 10
     * }
     */
    queryImportArrayformData: {
      type: Function,
      default: () => Promise.resolve({
        records: [],
        total: 0
      })
    },
    // 重复上报表单使用 上报方式 true  选择方式 false
    arrayformWay: {
      type: Boolean,
      default: true
    },
    isEditable: {
      type: Function
    },
    arrayformSubmit: {
      type: Function,
      default: null
    },
    isArrayformEdit: { // 详情页面的重复上报是否可以编辑 默认 false -- 如果为true 测必须传fileCode、handleSubmit、isEditable、arrayformSubmit、arrayformWay字段
      type: Boolean,
      default: false
    },
    formId: {
      type: [String, Number],
      default: 'root'
    },
    covered: {
      type: Boolean,
      default: true
    },
    /**
     * default: 自定义布局
     * vertical: 垂直布局 - 针对于重复上报表单
     * singleField：单字段布局
     */
    layout: { // 布局方式
      type: String,
      default: 'default'
    },
    /**
     * mobileLayout: []
     * pcLayout: {
     *  layoutConfig: {}
        rowsData: []
     * }
     */
    layoutData: {
      type: Object
    },
    attachedRule: {
      type: Object,
      required: true
    },
    form: {
      type: Array,
      required: true
    },
    reportData: {
      type: Object
    },
    // 字段是否展示，返回布尔值
    isFieldShow: {
      type: Function
    },
    // 文件上传的标识符
    fileCode: {
      type: String
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
      default: null
    }
  },
  data() {
    return {
      fieldAttachedRule: {},
      fieldCorrelativeRules: [],
      loadingForm: true
    }
  },
  watch: {
    formId() {
      this.loadingForm = true
    },
    attachedRule: {
      handler(val) {
        this.fieldAttachedRule = val.fieldAttachedRule || {}
        this.fieldCorrelativeRules.push(
          ...(val.fieldCorrelativeRules || [])
        )
      },
      immediate: true
    }
  },
  methods: {
    initShowForm() {
      this.loadingForm = true
      this.$nextTick(() => {
        // 注册仓库表单实例
        this.$store.dispatch('customForm/registerCoutomFormer', {
          formId: this.formId,
          covered: this.covered
        })

        this.$store.commit('customForm/setReportData', {
          formId: this.formId,
          reportData: this.reportData
        })
        // 计算保存关联规则
        computeCorrelativeRule(this.formId, this.fieldCorrelativeRules)
        // 存储字段附属规则
        this.$store.commit('customForm/setAttachedRule', {
          formId: this.formId,
          fieldAttachedRule: this.fieldAttachedRule
        })

        this.form.forEach(f => {
          this.$store.dispatch('customForm/setField', {
            formId: this.formId,
            field: syncFieldInitTo(f)
          })
        })

        setTimeout(() => {
          this.loadingForm = false
        }, 300)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.custom_form-container {
  min-height: 100px;
}
</style>
