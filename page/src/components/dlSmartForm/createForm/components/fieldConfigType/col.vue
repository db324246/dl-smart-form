<template>
  <el-form class='col-config' label-position="top" size="small">
    <el-form-item label="宽度：">
      <el-input-number style="width:100px;" v-model="form.width" @keyup.enter.native="saveCol" :min="0" :max="700" :controls="false" step-strictly />
        px(像素)
      <div class="col-config-tip">宽度为 0 时，单元格的宽度会自动撑开</div>
    </el-form-item>
    <el-form-item label="单元格对齐方式：">
      <el-radio-group v-model="form.align" size="mini">
        <!-- <el-radio label="top_left" style="margin-top: 8px;">靠上左对齐</el-radio>
        <el-radio label="top_center" style="margin-top: 8px;">靠上居中对齐</el-radio>
        <el-radio label="top_right" style="margin-top: 8px;">靠上右对齐</el-radio> -->
        <el-radio label="middle_left" style="margin-top: 8px;">左对齐</el-radio>
        <el-radio label="middle_center" style="margin-top: 8px;">水平居中&ensp;&ensp;&ensp;&ensp;</el-radio>
        <el-radio label="middle_right" style="margin-top: 8px;">右对齐</el-radio>
        <!-- <el-radio label="bottom_left" style="margin-top: 8px;">靠下左对齐</el-radio>
        <el-radio label="bottom_center" style="margin-top: 8px;">靠下居中对齐</el-radio>
        <el-radio label="bottom_right" style="margin-top: 8px;">靠下右对齐</el-radio> -->
      </el-radio-group>
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
  },
  data() {
    return {
      ft_list: [
        { label: '12', value: '12px' },
        { label: '14', value: '14px' },
        { label: '16', value: '16px' },
        { label: '18', value: '18px' },
        { label: '20', value: '20px' },
        { label: '24', value: '24px' },
        { label: '28', value: '28px' },
        { label: '32', value: '32px' },
        { label: '40', value: '40px' },
        { label: '48', value: '48px' }
      ]
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
    .col-config-tip {
      font-size: 12px;
      color: #b0b0b0;
    }
  }
}
</style>
