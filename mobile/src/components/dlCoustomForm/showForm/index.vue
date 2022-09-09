<template>
  <div class='custom_form-container'>
    <van-loading v-if="loadingForm" color="#1989fa" />
    <template v-else>
      <mobile-layout></mobile-layout>
    </template>

    <div class="fixed-box" v-show="flagScroll">
      <van-button type="default" class="go-top" @click="barsClick" v-if="arrayFormList.length > 0">
        <van-icon name="bars" size="20" class=""/>
      </van-button>
      <van-button type="default" class="go-top" @click="backTop">
        <van-icon name="back-top" size="20" class="top-icon"/>
      </van-button>

      <div class="arrayform-list" v-show="anchorFlag">
        <div class="arrayform-item" v-for="(item, index) in arrayFormList" :key="item.code" @click="anchorClick(index)">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MobileLayout from './layout/MobileLayout'
import { computeCorrelativeRule, syncFieldInitTo } from '../utils'
import { deepClone } from '@/utils'
export default {
  name: 'custom-form-show',
  components: {
    MobileLayout
  },
  provide() {
    return {
      queryImportArrayformData: this.queryImportArrayformData,
      arrayformWay: this.arrayformWay,
      fileCode: this.fileCode,
      isEditable: this.isEditable,
      arrayformSubmit: this.arrayformSubmit,
      isArrayformEdit: this.isArrayformEdit,
      layout: this.layout,
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
      },
      hdScopedSlots: (data) => {
        return this.$scopedSlots.handlers && this.$scopedSlots.handlers(data)
      }
    }
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
    // 文件上传的标识符
    fileCode: {
      type: String
    },
    isArrayformEdit: { // 详情页面的重复上报是否可以编辑 默认 false -- 如果为true 测必须传fileCode、handleSubmit、isEditable字段
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
     * 布局方式
     *    default：自定义布局
     *    vertical: 垂直布局（主要用于重复上报）
     */
    layout: {
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
      type: Object
    },
    // 字段是否展示，返回布尔值
    isFieldShow: {
      type: Function
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
  created() {
    
  },
  data() {
    return {
      fieldAttachedRule: {},
      fieldCorrelativeRules: [],
      loadingForm: true,
      flagScroll: false,
      arrayFormList: [],
      anchorFlag: false
    }
  },
  watch: {
    '$route'() {
      this.flagScroll = false
    },
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
    },
    form: {
      handler(val) {
        this.arrayFormList = deepClone(val).filter(f => {
          return f.type === 'arrayform'
        })
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll,true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll,);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll,);
  },
  methods: {
    barsClick() {
      this.anchorFlag = !this.anchorFlag
    },
    anchorClick(index) {
      let jump = document.querySelectorAll('.widget-arrayform')
      jump[index].scrollIntoView({ block: 'start', behavior: 'smooth' })
      this.anchorFlag = false
    },
    backTop() {
      document.getElementById('app').scrollTop = 0;
    },
    handleScroll(){
      let scrollTop = document.getElementById('app').scrollTop
      if(scrollTop > 200){
        this.flagScroll = true
      }else {
        this.anchorFlag = false
        this.flagScroll = false
      }
    },
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

<style lang='less' scoped>
.custom_form-container {
  min-height: 100px;
  .van-loading {
    padding-top: 20px;
    text-align: center;
  }
}
.fixed-box{
  position: fixed;
  bottom: 200px;
  right: 50px;
  z-index: 999;
}
.go-top + .go-top {
  margin-top: 5PX;
}
.go-top {
  width: 40PX;
  height: 40PX;
  border-radius: 50%;
  display: block;
  .top-icon{
    position: relative;
    top: 2PX;
    
  }
}
.arrayform-list {
  position: absolute;
  bottom: 55PX;
  right: 45PX;
  width: 100PX;
  border: 1px solid #dedede;
  text-align: center;
  font-size: 14px;
  box-shadow: 0px 0px 16PX 1PX rgba(6, 0, 1, 0.08);
  border-radius: 2PX;
  .arrayform-item + .arrayform-item {
    border-top: 1px solid #dedede;
  }
  .arrayform-item {
    background: #fff;
    padding: 2PX;
    -webkit-line-clamp: 1; 
    text-overflow: ellipsis; 
    overflow: hidden;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    word-break:break-all;
    text-align: left;
  }
}
</style>