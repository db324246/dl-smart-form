<template>
  <el-form class='col-config' label-position="top" size="small">
    <el-form-item label="宽度：">
      <el-input-number style="width:100px;" v-model="form.width" @keyup.enter.native="saveCol" :min="0" :max="700" :controls="false" step-strictly />
        px(像素)
      <div class="col-config-tip">宽度为 0 时，单元格的宽度会自动撑开</div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'col-config',
  props: {
    form: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 0 10px;
}
.el-form .el-form-item {
  margin-bottom: 10px;
}
.el-form .el-form-item .col-config-tip {
  font-size: 12px;
  color: #b0b0b0;
}
.el-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
</style>
