<template>
  <div class="detail-container">
    <div class="detail-header">
      <el-button @click="handleLog">打印表单数据</el-button>
      <el-button @click="handleExport">导出表单数据</el-button>
      <el-button @click="handleImport">导入表单数据</el-button>
    </div>
    <div class="detail-body">
      <smart-form-show
        ref="showForm"
        :form-data="formData"
        :report-data="reportData">
      </smart-form-show>
    </div>
  </div>
</template>

<script>
// import formData from '@/uploader.json'
// import reportFormData from '@/uploaderReport.json'
import formData from '@/formData.json'
import reportFormData from '@/reportData.json'
export default {
  name: 'Home',
  data() {
    return {
      formData,
      reportData: reportFormData.reportData
    }
  },
  mounted() {
    this.$refs.showForm.initShowForm()
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
.detail-container {
  height: calc(100vh - 70px);
  padding: 0 10px 20px;
}
.detail-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 50px;
}
.detail-body {
  height: calc(100% - 50px);
  overflow-y: auto;
  padding-bottom: 100px;
  box-sizing: border-box;
}
</style>
