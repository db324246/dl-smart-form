<template>
  <el-input type="textarea" :rows="5"
    v-model="fieldObj.value"
    :style="templateStyle"
    :placeholder="fieldObj.attrs.placeholder"
  ></el-input>
</template>

<script>
export default {
  name: 'textarea-template',
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
