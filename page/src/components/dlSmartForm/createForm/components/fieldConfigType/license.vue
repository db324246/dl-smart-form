<template>
  <el-form class='license-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="上传提示文本">
      <el-input v-model="form.attrs.tips" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="上传按钮文本">
      <el-input v-model="form.attrs.btnText" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="默认背景图">
      <el-radio-group v-model="form.attrs.defaultImg" :disabled="disabled">
        <el-radio :label="defaultPicUrl">默认图片</el-radio>
        <el-radio :label="defaultAvatarUrl">默认头像</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'license-config',
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

<style lang='scss' scoped>
.el-form {
  padding: 0 10px;
  ::v-deep .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
