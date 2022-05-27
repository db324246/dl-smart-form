<template>
  <el-input-number
    :style="getMediumWidth"
    v-model="fieldObj.value"
    :min="fieldObj.attrs.min"
    :max="fieldObj.attrs.max"
    :step="fieldObj.attrs.step">
  </el-input-number>
</template>

<script>
export default {
  name: 'number-report',
  props: {
    fieldObj: {
      type: Object,
      required: true
    },
    getMediumWidth: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
