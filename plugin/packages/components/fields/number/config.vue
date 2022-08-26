<template>
  <el-form class='number-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="占位内容">
      <el-input v-model="form.attrs.placeholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="最小值">
      <el-input-number v-model="form.attrs.min" :step="1" :disabled="disabled"></el-input-number>
    </el-form-item>

    <el-form-item label="最大值">
      <el-input-number v-model="form.attrs.max" :step="1" :disabled="disabled"></el-input-number>
    </el-form-item>

    <el-form-item label="步长">
      <el-input-number v-model="form.attrs.step" :min="0" :step="1" :disabled="disabled"></el-input-number>
    </el-form-item>

    <el-form-item label="默认值">
      <el-input type="number" v-model.number="form.value" :disabled="disabled"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'number-config',
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
