<template>
  <div
    v-show="!hideRowByNoData"
    class='flex-row'
    :class="{
      'row-has-border': hasBorder
    }">
    <template v-for="col in colsData">
      <div
        v-if="!hideColByNoData(col)"
        :key="col.key"
        class='flex-col'
        :class="{
          'col-has-border': hasBorder
        }">
        <template v-for="node in (col.children || [])">
          <flex-row
            v-if="node.domtype === 'row'"
            :key="node.key"
            :value="node"
            @rule-show="ruleShowCol($event, node.key, col.key)">
          </flex-row>
          <widget-item
            v-else-if="node.domtype === 'field'"
            :key="node.parentKey + node.key"
            :field-name="node.fieldName"
            @rule-show="ruleShowCol($event, node.key, col.key)">
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
    'hasBorder'
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
        return !this.hideColByNoData(col)
      })
      return showCols.length <= 0
    }
  },
  watch: {
    hideRowByNoData: {
      handler(val) {
        this.$emit('rule-show', val)
      },
      immediate: true
    }
  },
  methods: {
    ruleShowCol(val, nodeKey, colKey) {
      const mapObj = this.showColMap[colKey] || {}
      mapObj[nodeKey] = val
      this.$set(this.showColMap, colKey, mapObj)
    },
    hideColByNoData(col) {
      const mapObj = this.showColMap[col.key] || {}
      const showNodes = col.children.filter(node => {
        const flag = mapObj[node.key]
        return flag === undefined ? true : flag
      })
      return showNodes.length <= 0
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
