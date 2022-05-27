<template>
  <el-input
    v-model="fieldObj.value"
    :style="getMediumWidth"
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
    getMediumWidth: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

</style>
