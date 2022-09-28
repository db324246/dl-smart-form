<script>
export default {
  name: 'field-tag',
  inject: ['scopedSlotsMap'],
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  render(h) {
    return h(
      'div',
      {
        class: 'field-te-t-tag-box'
      },
      this.scopedSlotsMap && this.scopedSlotsMap('tag', this.field)
    )
  }
}
</script>

<style lang='scss' scoped>
.field-te-t-tag-box {
  min-width: fit-content;
}
</style>
