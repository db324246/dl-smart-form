<template>
  <div class='judge-value'>
    <!-- C_value修改值，字段filedType为'input', 'textarea', 'number' -->
    <template v-if="handleItem.type === 'C_value'">
      <component
        :is='componentId'
        :field-obj="copyField">
      </component>
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
import Store from '../../../../store'
import { deepClone } from '../../../../utils'
export default {
  name: 'judge-value',
  components: {
    ...Store.fieldReportComMap
  },
  props: {
    handleItem: {
      props: Object,
      required: true
    },
    fieldList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      copyField: {}
    }
  },
  computed: {
    fieldType() {
      return this.handleItem.fieldType || ''
    },
    componentId() {
      return this.fieldType + '-report'
    }
  },
  watch: {
    'handleItem.fieldName': {
      handler(val) {
        this.copyField = deepClone(this.fieldList.find(f => f.name === this.handleItem.fieldName) || {})
      },
      immediate: true
    },
    'copyField.value'(val) {
      this.handleItem.value = val
    },
    'handleItem.type'(val) {
      if (val === 'C_value' &&
      this.fieldType === 'switch' &&
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
.judge-value>div {
  max-width: 100%;
}
.judge-value .el-switch {
  margin-top: 8px;
}
.el-radio-group {
  padding-top: 10px;
}
</style>
