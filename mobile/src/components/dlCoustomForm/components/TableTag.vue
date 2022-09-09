<script>
export default {
  name: 'table-tag',
  inject: ['tableTagScopedSlots'],
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
      'div',
      {
        class: 'field-te-t-table-box'
      },
      this.tableTagScopedSlots && this.tableTagScopedSlots({
        field: this.field,
        rowData: this.rowData
      })
    )
  }
}
</script>

<style lang='less' scoped>
.field-te-t-table-box {
  display: inline-block;
  min-width: fit-content;
}
</style>