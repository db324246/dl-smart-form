<template>
  <div
    class='flex-table-wr'
    :class="{ 'has-border': hasBorder }"
    :style="{
      width: boxWidth + 'px'
    }">
    <el-form :key="formId" :label-width="labelWidth + 'px'">
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
  inject: ['getFormId', 'getLayoutData'],
  provide() {
    return {
      hasBorder: this.hasBorder
    }
  },
  computed: {
    formId() {
      return this.getFormId()
    },
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
    },
    labelWidth() {
      return (this.layoutData.layoutConfig && this.layoutData.layoutConfig.labelWidth) || 100
    }
  }
}
</script>

<style lang='scss' scoped>
.flex-table-wr {
  margin: 0 auto;
}
.has-border {
  border: 1px solid #999;
  border-bottom: none;
}
</style>
