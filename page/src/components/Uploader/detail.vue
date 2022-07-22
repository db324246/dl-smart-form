<template>
  <ul class="el-upload-list el-upload-list--text" :style="reportStyle">
    <li class="el-upload-list__item is-success"
      v-for="(item, index) in fieldObj.value"
      :key="index">
      <a class="el-upload-list__item-name" :href="item.url" target="_blank">
        <i class="el-icon-document"></i>
        {{item.name}}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'uploader-detail',
  props: {
    fieldObj: {
      type: Object,
      required: true
    },
    reportStyle: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
