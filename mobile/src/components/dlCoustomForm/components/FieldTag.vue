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
      'span',
      {
        class: 'field-te-t-tag-box'
      },
      this.tagScopedSlots && this.tagScopedSlots(this.field)
    )
  }
}
</script>

<style lang='less' scoped>
.field-te-t-tag-box {
  min-width: fit-content;
}
</style>