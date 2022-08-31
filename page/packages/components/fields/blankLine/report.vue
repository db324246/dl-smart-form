<template>
  <div class="black-line-report"
    :style="{
      'height': fieldObj.attrs.height + 'px'
    }">
  </div>
</template>

<script>
export default {
  name: 'black-line-report',
  props: {
    fieldObj: {
      type: Object,
      default: () => ({
        options: []
      })
    }
  }
}
</script>
