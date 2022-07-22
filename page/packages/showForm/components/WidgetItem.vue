<template>
  <div class="widget-view "
    v-if="computedShowField">
    <!-- 非表单字段 -->
    <component
      v-if="!fieldObj.isFormField"
      :is='componentId'
      :field-obj="fieldObj"
      :show-label="showLabel"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :detail-style="getMediumWidth">
    </component>

    <template v-else>
      <span v-if="showLabel && labelPosition !== 'top'"
        class="widge-field-item_divider"
        :style="{
          'left': labelWidth
        }">
      </span>
      <el-form-item
        :label="showLabel ? fieldObj.label : ''"
        :label-width="showLabel ? labelWidth : '0'"
        class="widge-field-item"
        :class="`el-form-item--label-${labelPosition}`">
        <component
          :is='componentId'
          :field-obj="fieldObj"
          :show-label="showLabel"
          :label-width="labelWidth"
          :label-position="labelPosition"
          :detail-style="getMediumWidth">
        </component>
        <field-tag :field="fieldObj"></field-tag>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import Store from '@pr/store'
import Bus from '@pr/reportForm/Bus'
import FieldTag from '@pr/components/FieldTag'
import {
  fieldDetailComMap // 字段详情组件集合
} from '@pr/components/fields'

export default {
  name: 'widget-item',
  components: {
    FieldTag,
    ...fieldDetailComMap
  },
  inject: [
    'formId',
    'isFieldShow'
  ],
  props: {
    fieldName: {
      type: String,
      required: true
    },
    fieldData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    former() {
      return Bus.formerMap.get(this.formId)
    },
    customFields() {
      return Store.customFields
    },
    fieldsMap() {
      return this.former.formWatcher.fieldsMap
    },
    fieldAttachedRule() {
      return this.former.fieldAttachedRule
    },
    ruleShow() {
      return this.former.formWatcher.ruleShow
    },
    fieldObj() {
      return this.fieldData || this.fieldsMap[this.fieldName]
    },
    fieldType() {
      return this.fieldObj.type || ''
    },
    componentId() {
      return this.fieldObj.type + '-detail'
    },
    // 关联规则 - 是否展示字段
    fieldRuleShow() {
      const flag = this.ruleShow[this.fieldName]
      return flag === undefined ? true : flag
    },
    // 自定义函数 - 是否展示字段
    fieldIsShow() {
      return this.isFieldShow ? this.isFieldShow(this.fieldObj) : true
    },
    computedShowField() {
      return this.fieldObj &&
        this.fieldName &&
        this.fieldIsShow &&
        this.fieldRuleShow
    },
    curFieldAttachedRule() {
      return this.fieldAttachedRule[this.fieldName] || {}
    },
    showLabel() {
      return this.curFieldAttachedRule.showLabel
    },
    labelWidth() {
      return `${this.curFieldAttachedRule.labelWidth || 100}px`
    },
    labelPosition() {
      return this.curFieldAttachedRule.labelPosition
    },
    getMediumWidth() {
      if (this.curFieldAttachedRule.mediumWidth && this.curFieldAttachedRule.mediumWidth > 0) {
        return {
          width: this.curFieldAttachedRule.mediumWidth + 'px'
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    fieldRuleShow: {
      handler(val) {
        this.$emit('rule-show', val)
      },
      immediate: true
    }
  },
  created() {
    this.handleRegister()
    Store.$on('fields-register', this.handleRegister)
  },
  methods: {
    // 注册字段上报组件
    handleRegister() {
      this.customFields.forEach(item => {
        item.components.forEach(com => {
          const detailCom = com.detailComponent
          // 通过构造函数找到静态方法 component
          if (detailCom && !Vue.component(detailCom.name)) {
            Vue.component(detailCom.name, detailCom)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.widget-view {
  height: 100%;
  position: relative;
  box-sizing: border-box;
}
.widget-view .el-form-item {
  padding-right: 30px;
}
.widget-view >>> .el-form-item__content {
  /* display: flex; */
  position: relative;
  padding-left: 5px;
}
.widge-field-item_divider {
  display: none;
  position: absolute;
  height: calc(100% + 10px);
  width: 1px;
  background: #999;
  top: -5px;
  margin-left: -5px;
}
.widge-field-item {
  position: relative;
}
.widge-field-item >>> .el-form-item__label {
  font-weight: bold;
}
.el-form-item--label-left >>> .el-form-item__label {
  text-align: left;
}
.el-form-item--label-right >>> .el-form-item__label {
  text-align: right;
}
.el-form-item--label-justify >>> .el-form-item__label {
  text-align-last: justify;
}
.el-form-item--label-top {
  padding-top: 5px;
}
.el-form-item--label-top >>> .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 10px;
  line-height: 30px;
}
.el-form-item--label-top >>> .el-form-item__content {
  margin: 0!important;
  padding-left: 0;
}
</style>
