<template>
  <div
    class='flex-table-wr'
    :class="{
      'has-border': hasBorder,
      'no-border': !hasBorder
    }"
    :style="{
      width: boxWidth + 'px'
    }">
    <el-form :key="formId">
      <flex-row
        v-for="row in rowsData"
        :key="row.key"
        :value="row">
      </flex-row>
    </el-form>
  </div>
</template>

<script>
import FlexRow from './FlexRow'
export default {
  name: 'flex-layout',
  components: { FlexRow },
  inject: ['formId', 'getLayoutData'],
  provide() {
    return {
      hasBorder: this.hasBorder
    }
  },
  computed: {
    layoutData() {
      const layout = this.getLayoutData() || {}
      return layout.pcLayout || {}
    },
    rowsData() {
      return this.layoutData.rowsData || []
    },
    hasBorder() {
      return this.layoutData.layoutConfig && this.layoutData.layoutConfig.hasBorder
    },
    boxWidth() {
      return (this.layoutData.layoutConfig && this.layoutData.layoutConfig.width) || 1000
    }
  }
}
</script>

<style scoped>
.flex-table-wr {
  margin: 0 auto;
}
.no-border >>> .el-form-item {
  margin-bottom: 0;
}
.has-border >>> .widge-field-item_divider {
  display: block;
}
.no-border >>> .el-form-item__content,
.no-border >>> .el-form-item__label {
  line-height: 28px;
}
.has-border {
  border: 1px solid #999;
  border-bottom: none;
}
</style>
