<template>
  <div class="divider-report"
    :class="{
      'divider-report-border': hasBorder
    }">
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: 'divider-report',
  inject: [
    'hasBorder'
  ]
}
</script>

<style scoped>
.el-divider {
  margin: 0;
}
.divider-report {
  margin: 0 0 20px;
}
.divider-report-border {
  margin: 10px 0;
}
</style>
