<template>
  <div class='judge-value'>
    <!-- C_value修改值，字段filedType为'input', 'textarea', 'number' -->
    <template v-if="handleItem.type === 'C_value'">
      <!-- 数组 类型 -->
      <el-select
        v-if="handleItem.valueType === 'array'"
        multiple
        placeholder="请选择"
        v-model="handleItem.value">
        <el-option
          v-for="item in handleItem.optionsList"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
      <!-- 单选 类型 -->
      <el-select
        v-else-if="(handleItem.valueType === 'string') && handleItem.optionsList"
        placeholder="请选择"
        v-model="handleItem.value">
        <el-option
          v-for="item in handleItem.optionsList"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
      <!-- input、textarea类型 -->
      <el-input
        v-else-if="handleItem.valueType === 'string'"
        v-model="handleItem.value"
        placeholder="请输入值">
      </el-input>
      <!-- number 类型 -->
      <el-input-number
        v-else-if="handleItem.valueType === 'number'"
        v-model="handleItem.value"
        label="请输入值">
      </el-input-number>
      <!-- 开关 类型 -->
      <el-switch
        v-else-if="handleItem.valueType === 'boolean'"
        v-model="handleItem.value"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </template>

    <!-- C_show显示、隐藏 -->
    <el-radio-group v-model="handleItem.show" v-else-if="handleItem.type === 'C_show'">
      <el-radio :label="true">显示</el-radio>
      <el-radio :label="false">隐藏</el-radio>
    </el-radio-group>

    <!-- C_options显示、隐藏 -->
    <el-select
      multiple
      v-model="handleItem.options"
      placeholder="请选择"
      v-else-if="handleItem.type === 'C_options'"
      value-key="value">
      <el-option
        v-for="i in handleItem.optionsList"
        :key="i.key"
        :label="i.value"
        :value="i">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'judge-value',
  props: {
    handleItem: {
      props: Object,
      required: true
    }
  },
  data() {
    return {
      singleSelect: ['select', 'radioGroup'],
      multipleSelect: ['mulSelect', 'checkboxGroup'],
      textInput: ['input', 'textarea']
    }
  },
  computed: {
    filedType() {
      return this.handleItem.filedType || ''
    }
  },
  watch: {
    'handleItem.type'(val) {
      if (val === 'C_value' &&
      this.filedType === 'switch' &&
      typeof this.handleItem.value !== 'boolean') {
        this.handleItem.value = true
      }
    }
  }
}
</script>

<style scoped>
.judge-value {
  min-width: 120px;
}
.judge-value .el-switch {
  margin-top: 8px;
}
</style>
