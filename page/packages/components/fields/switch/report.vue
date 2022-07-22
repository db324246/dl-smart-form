<template>
  <el-switch
    :style="reportStyle"
    v-model="fieldObj.value">
  </el-switch>
</template>

<script>
export default {
  name: 'switch-report',
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
