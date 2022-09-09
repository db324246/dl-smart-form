<template>
  <div class="title-report el-title"
    :class="{
      'title-report-border': hasBorder
    }"
    v-text="fieldObj.value"
    :style="{
      'font-size': fieldObj.attrs.fontSize,
      'font-weight': fieldObj.attrs.fontWeight,
      'color': fieldObj.attrs.color,
      'background-color': fieldObj.attrs.backgroundColor
    }">
  </div>
</template>

<script>
export default {
  name: 'title-report',
  inject: [
    'hasBorder'
  ],
  props: {
    fieldObj: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.el-title {
  padding: 5px 10px;
  margin: 10px 5px 20px;
  background-color: #efdebb;
}
.title-report-border {
  margin: 0;
}
</style>
