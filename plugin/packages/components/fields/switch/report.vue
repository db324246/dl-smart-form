<template>
  <div class="switch-report">
    <el-switch
      :style="reportStyle"
      v-model="fieldObj.value">
    </el-switch>
  </div>
</template>

<script>
export default {
  name: 'switch-report',
  props: {
    fieldObj: {
      type: Object,
      required: true
    },
    reportStyle: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.switch-report {
  height: 40px;
}
</style>
