<template>
  <div class="create-container">
    <div class="create-header">
      <el-button @click="handleLog">打印表单数据</el-button>
      <el-button @click="handleExport">导出表单数据</el-button>
      <el-button @click="$refs.upload.click()">导入表单数据</el-button>
      <input style="visibility: hidden;"
        type="file"
        ref="upload"
        @change="handleImport"
        accept=".json" />
    </div>
    <div class="create-body">
      <smart-form-create
        ref="createForm">
      </smart-form-create>
    </div>
  </div>
</template>

<script>
// import formData from '@/formData.json'
export default {
  name: 'Home',
  mounted() {
    // this.$refs.createForm.initFormData(formData)
  },
  methods: {
    async handleLog() {
      const formData = await this.$refs.createForm.getCustomFormData()
      console.log(formData)
      return formData
    },
    handleImport(e) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const formData = JSON.parse(reader.result)
          console.log(formData)
          this.$refs.createForm.initFormData(formData)
        } catch (err) {
          this.$message.error('请导入正确表单数据')
          console.log(err)
        }
      }
      reader.readAsText(file)
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
  padding: 0 10px 20px;
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
