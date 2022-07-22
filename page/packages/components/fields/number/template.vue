<template>
  <el-input-number
    v-model="fieldObj.value"
    :style="templateStyle"
  ></el-input-number>
</template>

<script>
export default {
  name: 'number-template',
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
