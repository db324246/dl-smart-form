<script>
export default {
  name: 'field-tag',
  inject: ['scopedSlots'],
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
      this.scopedSlots && this.scopedSlots(this.field)
    )
  }
}
</script>

<style scoped>
.field-te-t-tag-box {
  position: absolute;
  left: 10px;
  bottom: 0;
  z-index: 1;
}
</style>
