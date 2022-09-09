<template>
  <el-date-picker
    :style="templateStyle"
    v-model="fieldObj.value"
    type="daterange"
    :format="fieldObj.attrs.format"
    :start-placeholder="fieldObj.attrs.startPlaceholder"
    :end-placeholder="fieldObj.attrs.endPlaceholder"
    range-separator="至">
  </el-date-picker>
</template>

<script>
export default {
  name: 'dateRange-template',
  props: {
    templateStyle: {
      type: Object,
      default: () => ({})
    },
    fieldObj: {
      type: Object,
      default: () => ({
        attrs: {}
      })
    }
  }
}
</script>
