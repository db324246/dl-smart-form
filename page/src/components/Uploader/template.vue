<template>
  <div class='uploader-template'>
    <el-upload action="">
      <el-button size="small" type="primary">{{attrs.btnText}}</el-button>
      <div slot="tip" class="el-upload__tip">{{attrs.tips}}</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'uploader-template',
  props: {
    fieldObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    attrs() {
      return this.fieldObj.attrs
    }
  }
}
</script>

<style scoped>
.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
  line-height: 1;
}
</style>
