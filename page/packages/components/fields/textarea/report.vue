<template>
  <el-input type="textarea" :rows="5"
    :style="reportStyle"
    v-model="fieldObj.value"
    :placeholder="fieldObj.attrs.placeholder">
  </el-input>
</template>

<script>
export default {
  name: 'textarea-report',
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
