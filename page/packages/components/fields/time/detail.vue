<template>
  <div class='time-detail' :style="detailStyle">
    {{compVal}}
  </div>
</template>

<script>
export default {
  name: 'time-detail',
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
        return this.fieldObj.value || '空'
      } else {
        return this.fieldVal
      }
    }
  }
}
</script>

<style scoped>

</style>
