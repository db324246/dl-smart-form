<template>
  <el-input
    :style="templateStyle"
    v-model="fieldObj.value"
    :placeholder="fieldObj.attrs.placeholder"
  ></el-input>
</template>

<script>
export default {
  name: 'input-template',
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
