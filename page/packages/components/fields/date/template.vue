<template>
  <el-date-picker
    :style="templateStyle"
    v-model="fieldObj.value"
    :type="fieldObj.type"
    :format="fieldObj.attrs.format"
    :placeholder="fieldObj.attrs.placeholder"
    :value-format="fieldObj.attrs.format"
  >
  </el-date-picker>
</template>

<script>
export default {
  name: 'date-template',
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
