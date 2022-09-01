<template>
  <div class="detail-container">
    <div class="detail-header">
      <el-button @click="$refs.formUpload.click()">导入表单数据</el-button>
      <el-button @click="$refs.dataUpload.click()">导入上报数据</el-button>
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
    handleFormImport(e) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const formData = JSON.parse(reader.result)
          console.log(formData)
          this.formData = formData
          this.$refs.showForm.initShowForm()
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
          this.$refs.showForm.initShowForm()
        } catch (err) {
          this.$message.error('请导入正确的上报数据')
          console.log(err)
        }
      }
      reader.readAsText(file)
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
