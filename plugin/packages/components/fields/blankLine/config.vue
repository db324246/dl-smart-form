<template>
  <el-form class='title-config' label-position="top" size="small">
    <el-form-item label="高度：">
      <el-input-number v-model="form.attrs.height" :min="0" step-strictly></el-input-number>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'title-config',
  props: {
    form: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 0 10px;
}
.el-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.el-form .el-form-item {
  margin-bottom: 10px;
}
</style>
