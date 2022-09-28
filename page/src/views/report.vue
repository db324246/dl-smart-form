<template>
  <div class="report-container">
    <div class="report-header">
      <el-button @click="$refs.formUpload.click()">导入表单数据</el-button>
      <el-button @click="$refs.dataUpload.click()">导入上报数据</el-button>
      <el-button @click="handleSubmit">提交表单数据</el-button>
      <el-button @click="handleExport">导出上报数据</el-button>
      <input style="visibility: hidden;"
        type="file"
        ref="formUpload"
        @change="handleFormImport"
        accept=".json" />
      <input style="visibility: hidden;"
        type="file"
        ref="dataUpload"
        @change="handleDataImport"
        accept=".json" />
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
import formData from '@/data/formData.json'
// import formData from '@/data/date.json'
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
    handleFormImport(e) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const formData = JSON.parse(reader.result)
          console.log(formData)
          this.formData = formData
          this.$refs.reportForm.initReportForm()
        } catch (err) {
          this.$message.error('请导入正确的表单数据')
          console.log(err)
        }
      }
      reader.readAsText(file)
    },
    handleDataImport(e) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const reportFormData = JSON.parse(reader.result)
          console.log(reportFormData)
          this.reportData = reportFormData.reportData
          this.$refs.reportForm.initReportForm()
        } catch (err) {
          this.$message.error('请导入正确的上报数据')
          console.log(err)
        }
      }
      reader.readAsText(file)
    },
    async handleSubmit() {
      try {
        const data = await this.$refs.reportForm.getReportData()
        console.log('data', data)
      } catch (err) {
        console.log(2222, err)
      }
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
  padding: 0 10px 20px;
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
