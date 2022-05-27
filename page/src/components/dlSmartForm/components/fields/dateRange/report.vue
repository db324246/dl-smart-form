<template>
  <el-date-picker
    :style="getMediumWidth"
    v-model="fieldObj.value"
    :type="fieldObj.attrs.comType"
    :format="fieldObj.attrs.format"
    :value-format="fieldObj.attrs.format"
    :start-placeholder="fieldObj.attrs.startPlaceholder"
    :end-placeholder="fieldObj.attrs.endPlaceholder"
    range-separator="至">
  </el-date-picker>
</template>

<script>
export default {
  name: 'dateRange-report',
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
