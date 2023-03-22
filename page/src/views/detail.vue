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
        v-if="isMobile"
        class="mobile-detail"
        ref="showForm"
        :form-data="formData"
        :report-data="reportData">
      </smart-form-show>
      <smart-form-show
        v-else
        ref="showForm"
        :form-data="formData"
        :report-data="reportData">
      </smart-form-show>
    </div>
  </div>
</template>

<script>
import formData from '@/data/formData.json'
import reportFormData from '@/data/reportData.json'
export default {
  name: 'Home',
  data() {
    return {
      formData,
      reportData: reportFormData.reportData
    }
  },
  watch: {
    isMobile: {
      handler(val) {
        this.formData.layout.layoutType = val ? 'vertical' : 'default'
        this.$nextTick(() => {
          this.$refs.showForm.initShowForm()
        })
      },
      immediate: true
    }
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

<style scoped lang="scss">
.detail-container {
  height: calc(100vh - 70px);
  padding: 0 10px 20px;
  overflow-y: auto;
}
.detail-header {
  display: flex;
  align-items: center;
  padding: 5px 20px 0;
  flex-wrap: wrap;
  .el-button {
    margin-bottom: 5px;
  }
  input {
    height: 0;
  }
}
.detail-body {
  padding-bottom: 100px;
  box-sizing: border-box;
}
</style>
