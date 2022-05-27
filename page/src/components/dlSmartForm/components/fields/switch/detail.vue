<template>
  <div class='switch-detail'>
    <el-switch
      disabled
      v-model="compVal">
    </el-switch>
  </div>
</template>

<script>
export default {
  name: 'switch-detail',
  props: [
    'fieldObj',
    'fieldVal'
  ],
  computed: {
    compVal() {
      if (this.fieldVal === undefined || this.fieldVal === null || this.fieldVal === '') {
        return this.fieldObj.value
      } else {
        return this.fieldVal
      }
    }
  }
}
</script>

<style scoped>

</style>
