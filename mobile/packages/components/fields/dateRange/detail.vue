<template>
  <div class='dateRange-detail' :style="detailStyle">
    {{computedDateRangeValue}}
  </div>
</template>

<script>
export default {
  name: 'dateRange-detail',
  props: {
    detailStyle: {
      type: Object,
      default: () => ({})
    },
    fieldObj: {
      type: Object,
      required: true
    },
    fieldVal: {}
  },
  computed: {
    compVal() {
      if (this.fieldVal === undefined || this.fieldVal === null || this.fieldVal === '') {
        return this.fieldObj.value
      } else {
        return this.fieldVal
      }
    },
    computedDateRangeValue() {
      if (!this.compVal || !this.compVal.length) return '空'

      return `${this.compVal[0]} 至 ${this.compVal[1]}`
    }
  }
}
</script>

<style scoped>

</style>
