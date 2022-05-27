<template>
  <div class="create-container">
    <div class="create-header">
      <el-button @click="handleLog">打印表单数据</el-button>
      <el-button @click="handleExport">导出表单数据</el-button>
      <el-button @click="handleImport">导入表单数据</el-button>
    </div>
    <div class="create-body">
      <smart-form-create
        ref="createForm"
        layout="default">
      </smart-form-create>
    </div>
  </div>
</template>

<script>
import formData from '@/formData.json'
export default {
  name: 'Home',
  created() {
    console.log('2222', formData)
  },
  methods: {
    async handleLog() {
      const formData = await this.$refs.createForm.getCustomFormData()
      console.log(formData)
      return formData
    },
    handleImport() {
      this.$refs.createForm.initFormData(formData)
    },
    async handleExport() {
      const formData = await this.handleLog()
      const element = document.createElement('a');
      element.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(
        JSON.stringify(formData)
      ));
      element.setAttribute('download', 'formData.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
}
</script>

<style scoped>
.create-container {
  height: calc(100vh - 70px);
}
.create-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 50px;
}
.create-body {
  height: calc(100% - 50px);
}
</style>
