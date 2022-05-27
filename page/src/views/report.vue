<template>
  <div class="report-container">
    <div class="report-header">
      <el-button @click="handleSubmit">提交表单数据</el-button>
      <el-button @click="handleExport">导出上报数据</el-button>
      <el-button @click="handleImport">导入上报数据</el-button>
    </div>
    <div class="report-body">
      <smart-form-report
        ref="reportForm"
        :form-data="formData"
        :report-data="reportData">
      </smart-form-report>
    </div>
  </div>
</template>

<script>
import formData from '@/formData.json'
import reportFormData from '@/reportData.json'
export default {
  name: 'Home',
  data() {
    return {
      formData,
      reportData: {}
    }
  },
  mounted() {
    this.$refs.reportForm.initReportForm()
  },
  methods: {
    async handleSubmit() {
      try {
        const data = await this.$refs.reportForm.getReportData()
        console.log('data', data)
      } catch (err) {
        console.log(2222, err)
      }
    },
    handleImport() {
      this.reportData = reportFormData.reportData
      this.$refs.reportForm.initReportForm()
    },
    async handleExport() {
      const formData = await this.$refs.reportForm.getReportData()
      const element = document.createElement('a');
      element.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(
        JSON.stringify(formData)
      ));
      element.setAttribute('download', 'reportData.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
}
</script>

<style scoped>
.report-container {
  height: calc(100vh - 70px);
}
.report-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 50px;
}
.report-body {
  height: calc(100% - 50px);
  overflow-y: auto;
  padding-bottom: 100px;
  box-sizing: border-box;
}
</style>
