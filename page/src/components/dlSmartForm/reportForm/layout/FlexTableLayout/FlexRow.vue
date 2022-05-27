<template>
  <div
    v-show="!hideRowByNoData"
    class='flex-row'
    :class="{
      'row-has-border': hasBorder
    }">
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
          :key="node.key"
          :field-name="node.fieldName"
          @rule-show="ruleShowCol($event, col)">
        </widget-item>
      </template>
    </div>
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
        const flag = this.showColMap[col.key]
        return flag === undefined ? true : flag
      })
      return showCols.length <= 0
    }
  },
  methods: {
    ruleShowCol(val, col) {
      this.$set(this.showColMap, col.key, val)
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
.row-has-border {
  border-bottom: 1px solid #999;
}
.col-has-border {
  border-right: 1px solid #999;
}
.col-has-border:last-child {
  border-right: none
}
</style>
