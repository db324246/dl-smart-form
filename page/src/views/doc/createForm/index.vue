<template>
  <read-me v-model="readme"></read-me>
</template>

<script>
import readme from './readme.md'
export default {
  data() {
    return {
      readme
    }
  },
  mounted() {
    const hash = location.hash
    if (hash) {
      document.querySelector(decodeURIComponent(hash)).scrollIntoView(true)
    }
  }
}
</script>
