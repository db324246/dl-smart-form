<template>
  <el-select
    :style="reportStyle"
    v-model="fieldObj.value"
    clearable
    :multiple="true"
    :placeholder="fieldObj.attrs.placeholder"
  >
    <el-option v-for="item in fieldObj.options" :key="item.value" :value="item.key" :label="item.value"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'mulSelect-report',
  inject: ['customAttrs'],
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
  computed: {
    loadDictList() {
      const fn = () => Promise.resolve([])
      return this.customAttrs.loadDictList || fn
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

</style>
