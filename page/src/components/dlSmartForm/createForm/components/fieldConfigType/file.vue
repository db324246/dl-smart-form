<template>
  <el-form class='file-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="上传数量限制">
      <el-input-number v-model="form.attrs.upMaxNum" :min="0" :max="1000" :step="1" :disabled="disabled"></el-input-number>
    </el-form-item>

    <el-form-item label="绑定上传类型">
      <el-radio-group v-model="form.attrs.filetype" :disabled="disabled">
        <el-radio label="attachement">附件上传</el-radio>
        <el-radio label="image">图片上传</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="form.attrs.filetype === 'attachement'" label="自定义文件上传格式">
      <el-select v-model="form.attrs.customType" placeholder="请选择" multiple :disabled="disabled">
        <el-option
          v-for="(type, index) in fileTypes"
          :key="index"
          :label="type"
          :value="type">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'file-config',
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
  data() {
    return {
      fileTypes: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.psd', '.mp4', '.rmvb', '.mkv', '.wmv', '.flv', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.zip', '.rar', '.7z', '.mp3', '.avi', '.wps', '.asf', '.rm', '.mov', '.wav', '.ogg']
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
