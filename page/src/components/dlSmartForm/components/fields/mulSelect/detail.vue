<template>
  <div class='mulSelect-detail'>
    {{computedOptionsValue}}
  </div>
</template>

<script>
export default {
  name: 'mulSelect-detail',
  inject: ['loadDictList'],
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
    computedOptionsValue() {
      const options = this.fieldObj.options
      if (!this.compVal || !this.compVal.length) return '空'
      if (Array.isArray(this.compVal)) {
        return options.filter(o => this.compVal.includes(o.key))
          .map(o => o.value)
          .join('，')
      } else {
        return options.find(o => this.compVal === o.key)
          .value
      }
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
