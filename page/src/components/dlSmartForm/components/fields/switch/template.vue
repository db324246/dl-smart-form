<template>
  <el-switch
    :style="templateStyle"
    v-model="fieldObj.value"
  >
  </el-switch>
</template>

<script>
export default {
  name: 'switch-template',
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
