<template>
  <div class='validate-value'>
    <!-- 条件为等于、不等于 -->
    <div
      v-if="equalList.includes(judge)"
      key="equal">
      <!-- select、radioGroup类型 -->
      <el-select
        v-if="singleSelect.includes(filedType)"
        v-model="condition.value"
        placeholder="请选择值">
        <el-option
          v-for="i in condition.optionsList"
          :key="i.value"
          :label="i.value"
          :value="i.key">
        </el-option>
      </el-select>
      <!-- input、textarea类型 -->
      <el-input
        v-else-if="textInput.includes(filedType)"
        v-model="condition.value"
        placeholder="请输入值">
      </el-input>
      <!-- number 类型 -->
      <el-input-number
        v-else-if="condition.filedType === 'number'"
        v-model="condition.value"
        label="请输入值">
      </el-input-number>
    </div>

    <!-- 包含、不包含 -->
    <div
      class="width200"
      v-else-if="containList.includes(condition.judge)"
      key="contains">
      <el-select
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
    </div>

    <!--大于、大于等于、小于、小于等于 -->
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
    }
  },
  data() {
    return {
      equalList: ['==', '!='],
      containList: ['contains', 'uncontains'],
      compareList: ['>', '<', '>=', '<='],
      singleSelect: ['select', 'radioGroup'],
      textInput: ['input', 'textarea']
    }
  },
  computed: {
    judge() {
      return this.condition.judge || ''
    },
    filedType() {
      return this.condition.filedType || ''
    }
  }
}
</script>

<style lang='scss' scoped>
.validate-value {
  margin-right: 0!important;
  ::v-deep .el-input-number--medium {
    width: 180px;
  }
}
</style>
