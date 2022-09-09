<template>
  <el-input-number
    :style="reportStyle"
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
    reportStyle: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
