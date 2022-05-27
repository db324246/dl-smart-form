<template>
  <div class='dateRange-detail'>
    {{computedDateRangeValue}}
  </div>
</template>

<script>
export default {
  name: 'dateRange-detail',
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
