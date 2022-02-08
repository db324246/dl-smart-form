<template>
  <!-- @click.stop="handleSelectWidget()" -->
  <div class="widget-view "
    v-if="computedShowField">

    <!-- 重复上报 -->
    <template v-if="fieldType === 'arrayform'">
      <arrayform-field-edit v-if="isArrayformEdit"
        :field-obj="fieldObj"
        :show-label="showLabel">
      </arrayform-field-edit>

      <arrayform-field-show  v-else
        :field-obj="fieldObj"
        :show-label="showLabel">
      </arrayform-field-show>
    </template>

    <!-- 标题/段落 -->
    <div
      v-else-if="fieldType === 'title'"
      class="el-title"
      v-text="fieldObj.value"
      :style="{
        'font-size': fieldObj.attrs.fontSize,
        'font-weight': fieldObj.attrs.fontWeight,
        'color': fieldObj.attrs.color,
        'background-color': fieldObj.attrs.backgroundColor
      }">
    </div>

    <!-- 分割线 -->
    <el-divider v-else-if="fieldType === 'divider'"></el-divider>

    <!-- 基础字段 -->
    <template v-else>
      <span class="widge-field-item_divider" :style="{'left': labelWidth}" v-if="showLabel"></span>
      <el-form-item
        :label="showLabel ? fieldObj.label : ''"
        :label-width="showLabel ? labelWidth : '0'"
        class="widge-field-item"
        >
        <field-data-com :field-obj="fieldObj" :style="getMediumWidth"></field-data-com>
        <field-tag :field="fieldObj"></field-tag>
      </el-form-item>
    </template>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FieldTag from './FieldTag'
import FieldDataCom from './FieldDataCom'
import ArrayformFieldShow from './ArrayformField'
import ArrayformFieldEdit from '@/components/dlSmartForm/reportForm/components/ArrayformField'
export default {
  name: 'widget-item',
  components: {
    FieldTag,
    FieldDataCom,
    ArrayformFieldShow,
    ArrayformFieldEdit
  },
  inject: [
    'getFormId',
    'getReportData',
    'isFieldShow',
    'isArrayformEdit'
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
    return {
      baseFieldTypes: ['input', 'textarea', 'number', 'date', 'time'], // 基础类型字段
      rangeDataFields: ['dateRange', 'timeRange'],
      hasOptionsField: ['select', 'radioGroup', 'checkboxGroup', 'mulSelect']
    }
  },
  computed: {
    ...mapGetters('customForm', [
      'getRuleShow',
      'getFields',
      'fieldAttachedRule'
    ]),
    formId() {
      return this.getFormId()
    },
    fieldsMap() {
      return this.getFields(this.formId)
    },
    fieldObj() {
      return this.fieldData || this.fieldsMap[this.fieldName]
    },
    fieldType() {
      return this.fieldObj.type || ''
    },
    ruleShow() {
      return this.getRuleShow(this.formId)
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
      return this.fieldAttachedRule(this.formId)[this.fieldName] || {}
    },
    showLabel() {
      return this.curFieldAttachedRule.showLabel
    },
    labelWidth() {
      return `${this.curFieldAttachedRule.labelWidth || 100}px`
    },
    getMediumWidth() {
      if (this.curFieldAttachedRule.hasOwnProperty('mediumWidth') && this.curFieldAttachedRule.mediumWidth > 0) {
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
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #00bfc4;
$primary-background-color: rgba(0, 191, 196,.01);

.widget-view{
  height: 100%;
  position: relative;
  box-sizing: border-box;
  // overflow: hidden;
  .el-form-item {
    ::v-deep .el-form-item__content {
      display: flex;
    }
  }

  &.is_req{
    .el-form-item__label::before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .widget-view-description{
    height: 15px;
    line-height: 15px;
    font-size:13px;
    margin-top: 6px;
    color:#909399;
  }
}
.citeform_box {
  .citeform_box__title {
    display: flex;
    font-size: 14px;
    color: #606266;
    padding: 10px 0 10px 20px;
  }
}
.widget-view.is_req{
  ::v-deep .el-form-item__label::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.el-divider {
  margin: 10px 0;
}
.el-select {
  ::v-deep .el-input__suffix-inner {
    pointer-events: none;
  }
}
.el-title {
  padding: 5px 10px;
  background-color: #efdebb;
}
.upload-hint {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  .upload-btn {
    width: 90px;
    height: 65px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9CAYAAAAeYmHpAAAA5klEQVRoge3aIRJBURyF8e+hSOJ9ySgyS7ADRVRVyQYsSrEA1QYUybtBNALBXNpdwH/MnPObUW459ws3PQ2BupzLXr9ebFN6R96jFzkGzIBX9bsE3yE8+i84WoWjVThahaNVOFqFo1U4WoWjVThahaNVOFqFo1VIRjddzitgHbQ3AhbV2RM4Bu0XmwEwBZaBo7Vh8P7Wb1qFZHR50wfgFrQ3BvbV2R3YBe1/96L/iTAHztXxtU1pEnkPv2kVjlbhaBWOVuFoFY5W4WgVjlbhaBWOVuFoFY5WIftZJ9IDOFWDUZ+UfoAPv7EcqSgpZEQAAAAASUVORK5CYII=) no-repeat 50%;
    background-size: 37px;
    cursor: pointer;
  }
}
.widge-field-item{
  position: relative;
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
}
// .widge-field-item_divider {
//   position: absolute;
//   height: calc(100% + 10px);
//   width: 1px;
//   background: #999;
//   top: -5px;
//   margin-left: -5px;
// }
</style>
