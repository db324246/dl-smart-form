<template>
  <div class="widget-view van-hairline--bottom"
    :class="'widget-' + fieldObj.type"
    v-if="computedShowField">

    <!-- 重复上报 -->
    <template v-if="fieldType === 'arrayform'">
      <arrayform-field-edit v-if="isArrayformEdit"
        :field="fieldObj"
        :show-label="showLabel">
      </arrayform-field-edit>

      <arrayform-field-show  v-else
        :field="fieldObj"
        :show-label="showLabel">
      </arrayform-field-show>
    </template>
    
    <!-- <arrayform-field
      v-if="fieldType === 'arrayform'"
      :field="fieldObj"
      :show-label="showLabel">
    </arrayform-field> -->

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
    <van-field
      v-else
      :name="fieldObj.name"
      input-align="right">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
      <template #input>
        <field-data-com :field-obj="fieldObj"></field-data-com>
      </template>
    </van-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FieldTag from '@/components/dlCoustomForm/components/FieldTag'
import FieldDataCom from '@/components/dlCoustomForm/components/FieldDataCom'
export default {
  name: 'widget-item',
  components: {
    FieldTag,
    FieldDataCom
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
    // 计算关联规则 - 是否展示字段
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
    }
  }
}
</script>

<style lang="less" scoped>
.widget-view{
  position: relative;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
  &::after {
    border-color: @border-color;
  }
  .el-form-item {
    padding-right: 30px;
    /deep/.el-form-item__content {
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
  /deep/ .el-form-item__label::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.el-divider {
  margin: 10px 0;
}
.el-select {
  /deep/.el-input__suffix-inner {
    pointer-events: none;
  }
}
.el-title {
  padding: 5px 10px;
  user-select: auto;
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

.widget-license {
  /deep/ .van-cell__value {
    margin-bottom: 1px;
  }
}
.widget-arrayform {
  margin-top: 10px;
}
</style>