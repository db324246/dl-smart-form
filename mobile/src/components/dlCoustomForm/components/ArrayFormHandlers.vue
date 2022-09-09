<script>
export default {
  name: 'ArrayFormHandlers',
  inject: ['hdScopedSlots'],
  props: {
    field: {
      type: Object,
      required: true
    },
    rowData: {
      type: Object,
      required: true
    }
  },
  render(h) {
    return h(
      'span',
      {
        class: 'field-te-t-tag-box'
      },
      this.hdScopedSlots && this.hdScopedSlots({
        field: this.field,
        rowData: this.rowData
      })
    )
  }
}
</script>

<style lang='scss' scoped>

</style>