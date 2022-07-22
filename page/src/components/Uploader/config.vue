<template>
  <el-form :model='form' ref='form' label-position="top">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>
    <el-form-item label='按钮文本' prop='btnText'>
      <el-input v-model='form.attrs.btnText' :disabled="disabled"></el-input>
    </el-form-item>
    <el-form-item label='上传提示文本' prop='tips'>
      <el-input v-model='form.attrs.tips' :disabled="disabled"></el-input>
    </el-form-item>
    <el-form-item label='上传类型' prop='accept'>
      <el-select v-model="form.attrs.accept" multiple placeholder="请选择" :disabled="disabled">
        <el-option
          v-for="item in acceptOpt"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label='是否单传' prop='multiple'>
      <el-switch
        v-model="form.attrs.multiple"
        :active-value="false"
        :inactive-value="true" :disabled="disabled">
      </el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'uploader-config',
  props: {
    form: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      acceptOpt: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.psd', '.mp4', '.rmvb', '.mkv', '.wmv', '.flv', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.zip', '.rar', '.7z', '.mp3', '.avi', '.wps', '.asf', '.rm', '.mov', '.wav', '.ogg']
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 0 10px;
}
.el-form >>> .el-form-item__label {
  padding: 0;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
