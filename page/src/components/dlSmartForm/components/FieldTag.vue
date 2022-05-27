<script>
export default {
  name: 'field-tag',
  inject: ['tagScopedSlots'],
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
      this.tagScopedSlots && this.tagScopedSlots(this.field)
    )
  }
}
</script>

<style lang='scss' scoped>
.field-te-t-tag-box {
  min-width: fit-content;
}
</style>
