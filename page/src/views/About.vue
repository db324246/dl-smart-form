<template>
  <div class='page_container'>
    <div class="page-header">
      <el-button @click="handleLog">打印表单数据</el-button>
      <el-button @click="handleExport">导出表单数据</el-button>
      <el-button @click="handleImport">导入表单数据</el-button>
    </div>
    <div class="page-body">
      <smart-form-report
        ref="createForm"
        layout="vertical">
      </smart-form-report>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
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
