<template>
  <div class="arrayform-template" :style="templateStyle">
    <el-table border>
      <el-table-column
        :label="item.label"
        :key="item.name"
        v-for="item in columnList">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'arrayform-template',
  props: {
    fieldObj: {
      type: Object,
      default: () => ({
        options: []
      })
    },
    templateStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    modelFields() {
      return this.fieldObj.modelFields || []
    },
    columnList() {
      return this.fieldObj.attrs.tableColumns.map(f => {
        const field = this.modelFields.find(item => item.name === f.name)
        return field || f
      })
    }
  }
}
</script>

<style scoped>
.arrayform-template {
  line-height: 23px;
}
</style>
