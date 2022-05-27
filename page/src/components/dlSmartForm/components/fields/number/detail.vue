<template>
  <div class='number-detail'>
    {{ compVal }}
  </div>
</template>

<script>
export default {
  name: 'number-detail',
  props: [
    'fieldObj',
    'fieldVal'
  ],
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
