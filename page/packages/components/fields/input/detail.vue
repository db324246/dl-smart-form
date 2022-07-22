<template>
  <div class='input-detail' :style="detailStyle">
    <span class="field-data-com_textarea" :title="compVal">
      {{ compVal }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'input-detail',
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
.field-data-com_textarea {
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  word-break: break-all;
}
</style>
