<template>
  <el-form class='date-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="占位内容">
      <el-input v-model="form.attrs.placeholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="格式">
      <el-select v-model="form.attrs.comType" size="small" :disabled="disabled">
        <el-option value="date" label="年-月-日"></el-option>
        <el-option value="month" label="年-月"></el-option>
        <el-option value="year" label="年"></el-option>
        <el-option value="datetime" label="年-月-日 时:分"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'date-config',
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
        case 'year':
          this.form.attrs.format = 'yyyy'
          break;
        case 'datetime':
          this.form.attrs.format = 'yyyy-MM-dd HH:mm'
          break;
      }
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
