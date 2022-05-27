<template>
  <el-switch
    :style="getMediumWidth"
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
    getMediumWidth: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
