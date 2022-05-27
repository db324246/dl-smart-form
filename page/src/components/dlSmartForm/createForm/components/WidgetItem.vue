<template>
  <div class="widget-view "
    v-if="fieldObj && fieldObj.name">

    <el-form-item
      v-if="fieldObj.isFormField"
      :label="showLabel ? fieldObj.label : ''"
      :label-width="showLabel ? labelWidth : '0'"
      :class="`el-form-item--label-${labelPosition}`"
      :required="curFieldAttachedRule.required">
      <component
        :field-obj="fieldObj"
        :show-label="showLabel"
        :template-style="getMediumWidth"
        :is="componentId">
      </component>
    </el-form-item>

    <component
      v-else
      :show-label="showLabel"
      :field-obj="fieldObj"
      :template-style="getMediumWidth"
      :label-width="labelWidth"
      :is="componentId">
    </component>

    <field-tag :field="fieldObj"></field-tag>
  </div>
</template>

<script>
import store from '../../store'
import FieldTag from './FieldTag'
import { fieldTempComMap } from '../../components/fields'

export default {
  name: 'widget-item',
  components: {
    FieldTag,
    ...fieldTempComMap,
    ...store.customFieldTempMap
  },
  inject: ['getFieldAttachedRules', 'fieldsArr'],
  props: {
    fieldName: {
      type: String,
      required: true
    }
  },
  computed: {
    fieldObj() {
      return this.fieldsArr.find(f => f.name === this.fieldName)
    },
    componentId() {
      return this.fieldObj.type + '-template'
    },
    fieldAttachedRule() {
      return this.getFieldAttachedRules()
    },
    curFieldAttachedRule() {
      const json = (this.fieldObj.name && this.fieldAttachedRule[this.fieldObj.name]) || {}
      if (!Reflect.has(json, 'mediumWidth')) {
        this.$set(json, 'mediumWidth', 0)
      }
      return json
    },
    labelWidth() {
      return `${this.curFieldAttachedRule.labelWidth || 100}px`
    },
    showLabel() {
      return this.curFieldAttachedRule.showLabel
    },
    labelPosition() {
      return this.curFieldAttachedRule.labelPosition
    },
    getMediumWidth() {
      if (this.curFieldAttachedRule.mediumWidth > 0) {
        return {
          width: this.curFieldAttachedRule.mediumWidth + 'px'
        }
      } else {
        return {}
      }
    }
  }
}
</script>

<style scoped>
.widget-view {
  position: relative;
  padding-bottom: 10px;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
}
.widget-view::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: block;
  z-index: 10;
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
.el-form-item--label-top >>> .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 10px;
  line-height: 20px;
}
.el-form-item--label-top >>> .el-form-item__content {
  margin: 0!important;
}
</style>
