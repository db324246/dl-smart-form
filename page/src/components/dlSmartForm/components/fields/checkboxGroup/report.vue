<template>
  <el-checkbox-group v-model="fieldObj.value" :style="getMediumWidth">
    <el-checkbox
      :label="item.key" v-for="item in fieldObj.options" :key="item.key">
      {{ item.value }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'checkboxGroup-report',
  inject: ['loadDictList'],
  props: {
    fieldObj: {
      type: Object,
      required: true
    },
    getMediumWidth: {
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
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
