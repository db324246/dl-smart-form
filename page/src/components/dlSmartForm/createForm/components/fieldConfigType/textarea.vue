<template>
  <el-form class='textarea-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="占位内容">
      <el-input v-model="form.attrs.placeholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="最大输入长度">
      <el-input-number v-model="form.attrs.maxlength" :min="0" :max="9999" :step="1" :disabled="disabled"></el-input-number>
    </el-form-item>

    <el-form-item label="默认值">
      <el-input type="textarea" :rows="5" v-model="form.value" :disabled="disabled"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'textarea-config',
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
