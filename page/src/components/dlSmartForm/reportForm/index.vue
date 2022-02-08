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
import Bus from './Bus'
import { mapGetters } from 'vuex'
import FlexLayout from './layout/FlexTableLayout/index'
import VerticalLayout from './layout/VerticalLayout'
import { syncFieldInitTo, computeCorrelativeRule, diffValue } from '../utils'

export default {
  name: 'custom-form-report',
  components: {
    FlexLayout,
    VerticalLayout
  },
  provide() {
    return {
      fileCode: this.fileCode,
      isEditable: this.isEditable,
      isFieldShow: this.isFieldShow,
      loadDictList: this.loadDictList,
      arrayformWay: this.arrayformWay,
      arrayformSubmit: this.arrayformSubmit,
      queryImportArrayformData: this.queryImportArrayformData,
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
  props: {
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
      layoutConfig: {}
      rowsData: []
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
      type: Object,
      default: () => ({})
    },
    // 字段是否可编辑，返回布尔值
    isEditable: {
      type: Function
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
    },
    // 重复上报表单使用 上报方式 true  选择方式 false
    arrayformWay: {
      type: Boolean,
      default: true
    },
    /**
     * 重复上报提交函数 返回一个Promise
     * 一个默认参数 { done(), field, data, type }
     *    done: 结束操作的回调函数
     *    field: 重复上报的字段
     *    data: 重复上报的填报数据
     *    type: 'add' 新增记录，'modify' 更新记录, 'delete' 删除记录, 'import' 同步导入记录
     */
    arrayformSubmit: {
      type: Function,
      default: null
    },
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
    }
  },
  data() {
    return {
      fieldAttachedRule: {},
      fieldCorrelativeRules: [],
      loadingForm: true,
      unReportFieldsType: ['title', 'divider', 'objectform', 'arrayform']
    }
  },
  computed: {
    ...mapGetters('customForm', [
      'getFields',
      'getRuleShow'
    ]),
    fieldsMap() {
      return this.getFields(this.formId)
    },
    ruleShow() {
      return this.getRuleShow(this.formId)
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
    initReportForm() {
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
    },
    getReportData(formId) {
      return new Promise(r => {
        Bus.$emit('valide-form', formId, () => {
          const result = {}
          console.log('获取this.fieldsMap', this.fieldsMap)
          const fieldsMap = this.fieldsMap
          for (const key in fieldsMap) {
            const field = fieldsMap[key]
            const flag = this.ruleShow[key] === undefined
              ? true
              : this.ruleShow[key]
            if (!this.unReportFieldsType.includes(field.type) && flag) {
              result[key] = field.value
            }
          }
          console.log('000000000', result)
          r({
            currentData: this.reportData,
            reportData: result,
            updateData: diffValue(result, this.reportData)
          })
        })
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
