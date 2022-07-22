<template>
  <div class='title-detail'
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
  name: 'title-detail',
  props: [
    'fieldObj'
  ]
}
</script>

<style scoped>
.title-detail {
  padding: 5px 10px;
  margin: 20px 5px 10px;
  background-color: #efdebb;
}
</style>
