<template>
  <div class="black-line-template"
    :style="{
      'height': fieldObj.attrs.height + 'px'
    }">
  </div>
</template>

<script>
export default {
  name: 'black-line-template',
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

<style scoped>
.black-line-template {
  border-radius: 2px;
  background-color: #fff;
}
</style>
