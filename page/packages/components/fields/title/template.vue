<template>
  <div
    class="el-title"
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
  name: 'title-template',
  props: {
    fieldObj: {
      type: Object,
      default: () => ({
        options: []
      })
    }
  }
}
</script>

<style scoped>
.el-title {
  padding: 5px 10px;
  user-select: auto;
  background-color: #efdebb;
}
</style>
