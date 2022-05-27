<template>
  <!-- @click.stop="handleSelectWidget()" -->
  <div class="widget-view "
    v-if="computedShowField">

    <!-- 非表单字段 -->
    <component
      v-if="!fieldObj.isFormField"
      :is='componentId'
      :field-obj="fieldObj">
    </component>

    <!-- 禁止编辑 -->
    <template v-else-if="!fieldIsEditable">
      <span v-if="showLabel && labelPosition !== 'top'"
        class="widge-field-item_divider"
        :style="{
          'left': labelWidth
        }">
      </span>
      <el-form-item
        class="widge-field-item"
        :label="showLabel && fieldObj.label"
        :label-width="showLabel ? labelWidth : '0'"
        :required="curFieldAttachedRule.required"
        :class="`el-form-item--label-${labelPosition}`">
        <component :is='detailComId' :field-obj="fieldObj">
        </component>
        <field-tag :field="fieldObj"></field-tag>
      </el-form-item>
    </template>

    <!-- 可编辑 -->
    <template v-else>
      <span v-if="showLabel && labelPosition !== 'top'"
        class="widge-field-item_divider"
        :style="{
          'left': labelWidth
        }">
      </span>
      <el-form-item
        class="widge-field-item"
        :label="showLabel ? fieldObj.label : ''"
        :label-width="showLabel ? labelWidth : '0'"
        :prop="fieldObj.name"
        :required="curFieldAttachedRule.required"
        :class="`el-form-item--label-${labelPosition}`">
        <component
          :is='componentId'
          :field-obj="fieldObj"
          :get-medium-width="getMediumWidth">
        </component>
        <field-tag :field="fieldObj"></field-tag>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import Bus from '../Bus'
import FieldTag from '../../components/FieldTag'
import { fieldReportComMap, fieldDetailComMap } from '../../components/fields'

export default {
  name: 'widget-item',
  components: {
    FieldTag,
    ...fieldDetailComMap,
    ...fieldReportComMap
  },
  inject: [
    'formId',
    'isEditable',
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
    busFormer() {
      return Bus.formerMap.get(this.formId)
    },
    fieldAttachedRule() {
      return this.busFormer.fieldAttachedRule
    },
    fieldsMap() {
      return this.busFormer.formWatcher.fieldsMap
    },
    ruleShow() {
      return this.busFormer.formWatcher.ruleShow
    },
    fieldObj() {
      return this.fieldData || this.fieldsMap[this.fieldName]
    },
    fieldType() {
      return this.fieldObj.type
    },
    componentId() {
      return this.fieldObj.type + '-report'
    },
    detailComId() {
      return this.fieldObj.type + '-detail'
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
    // 自定义函数 - 字段是否可编辑
    fieldIsEditable() {
      if (this.isEditable) {
        return this.isEditable(this.fieldObj)
      } else {
        return true
      }
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
.widge-field-item_divider {
  display: none;
  position: absolute;
  height: calc(100% + 10px);
  width: 1px;
  background: #999;
  top: -5px;
  margin-left: -5px;
}
.widget-view >>> .el-form-item__content {
  /* display: flex; */
  position: relative;
  padding-left: 5px;
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
