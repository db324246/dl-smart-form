<template>
  <el-upload class='uploader-report' :style="reportStyle"
    :multiple="!attrs.multiple"
    :accept="acceptFiles"
    action="https://jsonplaceholder.typicode.com/posts/"
    :file-list="fieldObj.value">
    <el-button size="small" type="primary">{{attrs.btnText}}</el-button>
    <div slot="tip" class="el-upload__tip">{{attrs.tips}}</div>
  </el-upload>
</template>

<script>
export default {
  name: 'uploader-report',
  props: {
    fieldObj: {
      type: Object,
      required: true
    },
    reportStyle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    attrs() {
      return this.fieldObj.attrs
    },
    acceptFiles() {
      return this.attrs.accept.join(',')
    }
  }
}
</script>

<style scoped>
.uploader-report {
  margin-bottom: 10px;
}
.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
  line-height: 1;
}
</style>
