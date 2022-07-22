<template>
  <el-radio-group v-model="fieldObj.value" :style="reportStyle">
    <el-radio
      :label="item.key" v-for="item in fieldObj.options" :key="item.key">
      {{ item.value }}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'radioGroup-report',
  inject: ['loadDictList'],
  props: {
    fieldObj: {
      type: Object,
      required: true
    },
    reportStyle: {
      type: Object,
      default: () => ({})
    }
  },
  async created() {
    if (this.fieldObj.attrs.bindDicts &&
    this.fieldObj.attrs.constantId && this.loadDictList) {
      try {
        const data = await this.loadDictList(
          this.fieldObj.attrs.constantId
        )
        this.fieldObj.options = data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
.el-radio-group {
  display: flex;
  align-items: center;
  min-height: 40px;
}
</style>
