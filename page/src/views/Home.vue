<template>
  <div class="page-container">
    <div class="page-header">
      <el-button @click="handleExport">导出表单数据</el-button>
    </div>
    <div class="page-body">
      <smart-form-create
        ref="createForm">
      </smart-form-create>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    async handleExport() {
      const formData = await this.$refs.createForm.getCustomFormData()
      console.log(formData)
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
        JSON.stringify(formData)
      ));
      element.setAttribute('download', formData.json);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
}
</script>

<style scoped>
.page-container {
  height: 100vh;
}
.page-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 50px;
}
.page-body {
  height: calc(100% - 50px);
}
</style>
