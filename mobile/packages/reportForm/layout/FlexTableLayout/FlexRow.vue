<template>
  <div
    v-show="!hideRowByNoData"
    class='flex-row'
    :class="{
      'row-has-border': hasBorder
    }">
    <template v-for="col in colsRenderData">
      <div
        v-show="!hideColByNoData(col)"
        :key="col.key"
        class='flex-col'
        :class="{
          'col-has-border': hasBorder
        }"
        :style="col.style">
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
    colsRenderData() {
      return this.colsData.map(col => {
        const width = col.width
        return {
          ...col,
          style: {
            'max-width': width ? width + 10 + 'px' : '100%',
            'min-width': width ? width + 10 + 'px' : 'auto',
            width: width ? width + 10 + 'px' : '100%'
          }
        }
      })
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
        this.$emit('rule-show', !val)
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

<style scoped>
.flex-row {
  position: relative;
  display: flex;
}
.flex-col {
  width: 100%;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.flex-col .flex-row {
  flex: 1;
}
.row-has-border {
  border-bottom: 1px solid #999;
}
.flex-col .row-has-border {
  border: none;
}
.flex-col .row-has-border:not(:last-child) {
  border-top: 1px solid #999;
}

.col-has-border {
  border-right: 1px solid #999;
}
.col-has-border:last-child {
  border-right: none
}
</style>
