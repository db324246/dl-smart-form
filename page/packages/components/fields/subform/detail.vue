<template>
  <div class='subform-detail' :style="detailStyle">
    <el-table :data="fieldObj.value" border>
      <el-table-column
        :label="item.label"
        :key="item.name"
        v-for="item in tableColumns">
        <template slot-scope="{row}">
          <component
            :field-obj="item"
            :is="item.type + '-detail'"
            :field-val="row[item.key]">
          </component>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
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
      class="detail-dialog subform-dialog"
      title='查看详情'
      :visible.sync='detailDialogVisible'
      :width='dialogWidth'
      append-to-body
      :close-on-click-modal='false'>
      <smart-form-show
        ref="smartFormShow"
        :formId="fieldObj.name"
        :report-data="detailData"
        :form-data="{
          layout: {
            layoutType: 'vertical',
            mobileLayout: fieldObj.modelFields
          },
          form: fieldObj.modelFields,
          attachedRule: attachedRule,
        }">
      </smart-form-show>
    </el-dialog>
  </div>
</template>

<script>
import TableTag from './TableTag'
import FieldTag from '../../FieldTag'
import {
  fieldDetailComMap // 字段详情组件集合
} from '@pr/components/fields'

export default {
  name: 'subform-detail',
  components: {
    TableTag,
    FieldTag,
    ...fieldDetailComMap
  },
  props: {
    detailStyle: {
      type: Object,
      default: () => ({})
    },
    fieldObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      detailDialogVisible: false,
      detailData: {}
    }
  },
  computed: {
    modelFields() {
      return this.fieldObj.modelFields || []
    },
    tableColumns() {
      return this.fieldObj.attrs.tableColumns.map(f => {
        return this.modelFields.find(item => item.name === f)
      })
    },
    dialogWidth() {
      const width = this.fieldObj.attrs.dialogWidth
      return width > window.innerWidth ? window.innerWidth + 'px' : width + 'px'
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
    // 查看记录
    handleCheck(data) {
      this.detailData = data
      this.detailDialogVisible = true
      this.$nextTick(() => {
        this.$refs.smartFormShow.initShowForm()
      })
    }
  }
}
</script>

<style scoped>
.subform-detail {
  line-height: 23px;
  width: 100%;
}
.el-table >>> .cell {
  display: flex;
}
.subform-dialog >>> .el-dialog__header {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}
.subform-dialog >>> .el-dialog__headerbtn {
  top: 15px;
}
.detail-dialog >>> .el-dialog__body {
  padding: 10px 20px 30px;
}
</style>
