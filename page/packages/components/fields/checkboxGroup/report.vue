<template>
  <el-checkbox-group v-model="fieldObj.value" :style="reportStyle">
    <el-checkbox
      :label="item.key" v-for="item in fieldObj.options" :key="item.key">
      {{ item.value }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'checkboxGroup-report',
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
  },
  methods: {

  }
}
</script>

<style scoped>
.el-checkbox-group {
  display: flex;
  align-items: center;
  min-height: 40px;
  flex-wrap: wrap;
  line-height: 1;
}
</style>
