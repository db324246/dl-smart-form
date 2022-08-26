<template>
  <el-time-picker
    :style="reportStyle"
    v-model="fieldObj.value"
    :placeholder="fieldObj.attrs.placeholder"
    :format="fieldObj.attrs.format"
    :value-format="fieldObj.attrs.format"
  >
  </el-time-picker>
</template>

<script>
export default {
  name: 'time-report',
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
