<template>
  <el-time-picker
    :style="templateStyle"
    v-model="fieldObj.value"
    :placeholder="fieldObj.attrs.placeholder"

    :value-format="fieldObj.attrs.format"
  >
  </el-time-picker>
</template>

<script>
export default {
  name: 'time-template',
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
