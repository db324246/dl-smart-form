<template>
  <div class="smart-title">
    <h3 class="smart-title__name">{{ title }}</h3>
    <router-link v-if="toMore !== null" :to="toMore" class="smart-title__more">更多&gt;&gt;</router-link>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'smartTitle',
  props: {
    title: {
      type: String
    },
    toMore: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.smart-title {
  padding: 10px;
}
.smart-title__name {
  display: inline-block;
  padding: 0 6px;
  margin: 0 0 -1px;
  font-size: 14px;
  border-left: 3px solid #00bfc4;
}
.smart-title__more {
  // display: inline-block;
  float: right;
  padding-top: 2px;
  color: #00bfc4;
  font-size: 12px;
}
</style>
