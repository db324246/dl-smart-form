<template>
  <div class="black-line-detail"
    :style="{
      'height': fieldObj.attrs.height + 'px'
    }">
  </div>
</template>

<script>
export default {
  name: 'black-line-detail',
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
