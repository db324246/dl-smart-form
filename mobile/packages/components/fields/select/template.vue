<template>
  <el-select
    :style="templateStyle"
    v-model="fieldObj.value"
    :placeholder="fieldObj.attrs.placeholder"
  >
    <el-option
      v-for="item in fieldObj.options"
      :key="item.value"
      :value="item.key"
      :label="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'select-template',
  props: {
    templateStyle: {
      type: Object,
      default: () => ({})
    },
    fieldObj: {
      type: Object,
      default: () => ({
        attrs: {},
        options: []
      })
    }
  }
}
</script>

<style scoped>
.el-select >>>.el-input__suffix-inner {
  pointer-events: none;
}
</style>
