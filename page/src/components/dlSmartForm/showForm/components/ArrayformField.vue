<template>
  <div class='arrayform-field citeform_box'>
    <div
      class="citeform_box__title">
      <div class="citeform_box__title-box">
        <span v-if="showLabel">{{ fieldObj.label }}</span>
        <span v-else></span>
        <field-tag :field="fieldObj"></field-tag>
      </div>
    </div>
    <el-table :data="fieldObj.value" border>
      <el-table-column
        :label="item.label"
        :key="item.name"
        v-for="item in tableColumns">
        <template slot-scope="{row}">
          <field-data-com
            :field-obj="item"
            :is-table="true"
            :field-val="row[item.name]">
          </field-data-com>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="{row}">
          <el-button
            plain
            size="mini"
            type="primary"
            icon="el-icon-search"
            title="查看详情"
            @click="handleCheck(row)">
          </el-button>
          <table-tag
            :field="fieldObj"
            :row-data="row">
          </table-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 记录详情对话框 -->
    <el-dialog
      title='查看详情'
      :visible.sync='detailDialogVisible'
      width='580px'
      append-to-body
      :close-on-click-modal='false'>
      <custom-form-show
        ref="customFormShow"
        :form="fieldObj.modelFields"
        :formId="fieldObj.name"
        layout="vertical"
        :attached-rule="attachedRule"
        :report-data="detailData">
      </custom-form-show>
    </el-dialog>
  </div>
</template>

<script>
import TableTag from './TableTag'
import FieldTag from './FieldTag'
import FieldDataCom from '@/components/dlSmartForm/showForm/components/FieldDataCom'
export default {
  name: 'arrayform-field',
  components: {
    TableTag,
    FieldTag,
    FieldDataCom
  },
  props: {
    fieldObj: {
      type: Object
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      detailDialogVisible: false,
      detailData: {}
    }
  },
  computed: {
    tableColumns() {
      if (this.fieldObj.attrs.tableColumns.length) {
        return this.fieldObj.attrs.tableColumns
      } else {
        return this.fieldObj.modelFields
      }
    },
    attachedRule() {
      const {
        fieldAttachedRule,
        fieldCorrelativeRules
      } = this.fieldObj.attrs
      return { fieldAttachedRule, fieldCorrelativeRules }
    }
  },
  methods: {
    computedEditable(data) {
      if (this.isEditable) {
        return this.isEditable(this.fieldObj, data)
      } else {
        return true
      }
    },
    // 查看记录
    handleCheck(data) {
      this.detailData = data
      this.detailDialogVisible = true
      this.$nextTick(() => {
        this.$refs.customFormShow.initShowForm()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.citeform_box {
  .citeform_box__title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #606266;
    padding: 10px 20px;
    span {
      font-weight: bold;
      &::before {
        display: none;
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
}
.el-table {
  ::v-deep .cell {
    display: flex;
  }
}
.el-button {
  margin-right: 5px;
}

.citeform_box__title-box {
  display: flex;
}
</style>
