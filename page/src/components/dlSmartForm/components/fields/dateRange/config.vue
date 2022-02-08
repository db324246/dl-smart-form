<template>
  <el-form class='dateRange-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="开始时间占位内容">
      <el-input v-model="form.attrs.startPlaceholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="结束时间占位内容">
      <el-input v-model="form.attrs.endPlaceholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="格式">
      <el-select v-model="form.attrs.comType" size="small" :disabled="disabled">
        <el-option value="daterange" label="年-月-日"></el-option>
        <el-option value="datetimerange" label="年-月-日 时:分"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'dateRange-config',
  props: {
    form: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'form.attrs.comType'(val) {
      switch (val) {
        case 'date':
          this.form.attrs.format = 'yyyy-MM-dd'
          break;
        case 'month':
          this.form.attrs.format = 'yyyy-MM'
          break;
        case 'datetime':
          this.form.attrs.format = 'yyyy-MM-dd HH:mm'
          break;
      }
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
