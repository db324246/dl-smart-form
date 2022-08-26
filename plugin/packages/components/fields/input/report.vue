<template>
  <el-input
    v-model="fieldObj.value"
    :style="reportStyle"
    :placeholder="fieldObj.attrs.placeholder"
    :maxlength="fieldObj.attrs.maxlength">
  </el-input>
</template>

<script>
export default {
  name: 'input-report',
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
