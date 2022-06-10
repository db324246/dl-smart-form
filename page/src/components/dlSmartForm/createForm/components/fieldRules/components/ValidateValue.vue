<template>
  <div class='validate-value'>
    <!-- 条件为等于、不等于 -->
    <div
      v-if="equalList.includes(judge)"
      key="equal">
      <!-- 有选项的 -->
      <el-select
        v-if="condition.optionsList"
        v-model="condition.value"
        placeholder="请选择值">
        <el-option
          v-for="i in condition.optionsList"
          :key="i.value"
          :label="i.value"
          :value="i.key">
        </el-option>
      </el-select>
      <!-- 字符串 类型 -->
      <el-input
        v-else-if="condition.valueType === 'string'"
        v-model="condition.value"
        placeholder="请输入值">
      </el-input>
      <!-- 数字 类型 -->
      <el-input-number
        v-else-if="condition.valueType === 'number'"
        v-model="condition.value"
        label="请输入值">
      </el-input-number>
      <!-- 开关 类型 -->
      <el-switch
        v-else-if="condition.valueType === 'boolean'"
        v-model="condition.value"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </div>

    <!-- 包含、不包含 -->
    <div
      class="width200"
      v-else-if="containList.includes(condition.judge)"
      key="contains">
      <el-date-picker
        v-if="condition.fieldType === 'dateRange'"
        v-model="condition.value"
        :type="dateType"
        :format="curFieldAttrs.format"
        :value-format="curFieldAttrs.format"
        placeholder="请选择日期">
      </el-date-picker>
      <el-select
        v-else-if="condition.optionsList"
        multiple
        v-model="condition.value"
        placeholder="请选择值"
        value-key="value">
        <el-option
          v-for="i in condition.optionsList"
          :key="i.value"
          :label="i.value"
          :value="i.key">
        </el-option>
      </el-select>
      <el-input
        v-else-if="condition.valueType === 'string'"
        v-model="condition.value"
        placeholder="请输入值">
      </el-input>
      <el-input-number
        v-else-if="condition.valueType === 'number'"
        v-model="condition.value"
        label="请输入值">
      </el-input-number>
    </div>

    <!-- 数字类型 大于、大于等于、小于、小于等于 -->
    <div
      class="width200"
      v-else-if="compareList.includes(condition.judge)"
      key="compare">
      <el-input-number
        v-model="condition.value"
        label="请输入值">
      </el-input-number>
    </div>

    <!-- 空位、不为空 -->
    <div v-else></div>
  </div>
</template>

<script>
export default {
  name: 'validate-value',
  props: {
    condition: {
      type: Object,
      default: () => ({})
    },
    fieldList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      equalList: ['==', '!='],
      containList: ['contains', 'uncontains'],
      compareList: ['>', '<', '>=', '<=']
    }
  },
  computed: {
    judge() {
      return this.condition.judge || ''
    },
    fieldType() {
      return this.condition.fieldType || ''
    },
    curField() {
      return this.fieldList.find(f => f.name === this.condition.fieldName) || {}
    },
    curFieldAttrs() {
      return this.curField.attrs || {}
    },
    dateType() {
      if (this.condition.fieldType !== 'dateRange') return ''
      return this.curFieldAttrs.comType.replace('range', '')
    }
  }
}
</script>

<style scoped>
.validate-value {
  min-width: 120px;
  margin-right: 0!important;
}
.validate-value >>> .el-input-number--medium {
  width: 180px;
}
.el-switch {
  padding-top: 10px;
  margin-right: 50px;
}
.el-date-picker >>> .el-date-editor.el-input__inner {
  width: 190px;
}
</style>
