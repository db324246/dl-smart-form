<template>
  <div
    v-show="!hideRowByNoData"
    class='flex-row'
    :class="{
      'row-has-border': hasBorder
    }">
    <template v-if="isSubformRow">
      <el-table :data="subformField.value" border style='width: 100%'>
        <el-table-column
          v-for="field in subformField.columnFields"
          :key="field.name"
          :prop='field.name' :label='field.label'>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <div
        v-for="col in colsData"
        :key="col.key"
        class='flex-col'
        :class="{
          'col-has-border': hasBorder
        }">
        <template v-for="node in (col.children || [])">
          <flex-row
            v-if="node.domtype === 'row'"
            :key="node.key"
            :value="node">
          </flex-row>
          <widget-item
            v-else-if="node.domtype === 'field'"
            :key="node.parentKey + node.key"
            :field-name="node.fieldName"
            @rule-show="ruleShowCol($event, col)">
          </widget-item>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import WidgetItem from '../../components/WidgetItem'
export default {
  name: 'flex-row',
  components: { WidgetItem },
  inject: [
    'hasBorder',
    'getFieldsArr',
    'getReportData'
  ],
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showColMap: {}
    }
  },
  computed: {
    colsData() {
      return this.value.children || []
    },
    hideRowByNoData() {
      const showCols = this.colsData.filter(col => {
        const flag = this.showColMap[col.key]
        return flag === undefined ? true : flag
      })
      return showCols.length <= 0
    },
    fieldsArr() {
      return this.getFieldsArr() || []
    },
    isSubformRow() {
      return this.value.isSubForm && this.value.subFormCol
    },
    subformField() {
      if (!this.isSubformRow) return {}
      return this.fieldsArr.find(f => f.name === this.value.fieldName)
    }
  },
  methods: {
    ruleShowCol(val, col) {
      this.$set(this.showColMap, col.key, val)
    },
    computedValue(field) {
      const reportData = this.getReportData()
      console.log(reportData)
      return reportData[field.name] || '空'
    },
    showLabel(fieldName) {
      const rule = this.fieldAttachedRule[fieldName]
      return rule && rule.showLabel
    }
  }
}
</script>

<style lang='scss' scoped>
.flex-row {
  position: relative;
  display: flex;
}
.flex-col {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5px;
  .widget-view {
    padding-bottom: 0;
  }
  ::v-deep .widge-field-item_divider {
    position: absolute;
    height: calc(100% + 10px);
    width: 1px;
    background: #999;
    top: -5px;
    margin-left: -5px;
  }
}
.row-has-border {
  border-bottom: 1px solid #999;
}
.col-has-border {
  border-right: 1px solid #999;
  &:last-child {
    border-right: none
  }
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
</style>
