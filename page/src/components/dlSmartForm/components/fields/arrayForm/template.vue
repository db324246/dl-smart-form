<template>
  <div class="citeform_box" v-if="fieldObj.type === 'arrayform'">
    <div
      class="citeform_box__title"
      v-if="showLabel">
      {{ fieldObj.label }}
    </div>
    <el-table border>
      <el-table-column
        :label="item.label"
        :key="item.name"
        v-for="item in fieldObj.attrs.tableColumns">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'arrayform-template',
  props: {
    showLabel: {
      type: Boolean,
      default: false
    },
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
.citeform_box .citeform_box__title {
  font-size: 14px;
  padding: 10px 0 10px 20px;
}
.citeform_box .citeform_box__title::before {
  display: none;
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>
