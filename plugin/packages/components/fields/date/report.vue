<template>
  <el-date-picker
    :style="reportStyle"
    v-model="fieldObj.value"
    :type="fieldObj.attrs.comType"
    :format="fieldObj.attrs.format"
    :placeholder="fieldObj.attrs.placeholder"
    :value-format="fieldObj.attrs.format">
  </el-date-picker>
</template>

<script>
export default {
  name: 'date-report',
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
