<script>
export default {
  name: 'table-tag',
  inject: ['scopedSlotsMap'],
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
      this.scopedSlotsMap && this.scopedSlotsMap('table-tag', {
        field: this.field,
        rowData: this.rowData
      })
    )
  }
}
</script>

<style scoped>
.field-te-t-table-box {
  display: inline-block;
  min-width: fit-content;
  margin-left: 10px;
}
</style>
