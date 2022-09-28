<template>
  <div class='subform-report citeform_box'
    :class="{
      'subform-report-border': hasBorder
    }">
    <div class="citeform_box__title">
      <el-button
        type="primary" size="mini" icon="el-icon-plus"
        circle plain
        @click="handleAddData"
        ></el-button>
    </div>
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
      <el-table-column label="操作" width="205" fixed="right">
        <template slot-scope="{row, $index}">
          <el-button
            plain
            size="mini"
            type="primary"
            icon="el-icon-search"
            title="查看详情"
            @click="handleCheck(row)">
          </el-button>
          <template v-if="computedEditable(row)">
            <el-button
              plain
              size="mini"
              type="primary"
              title="编辑"
              icon="el-icon-edit"
              @click="handleEdit(row, $index)">
            </el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              title="删除"
              icon="el-icon-delete"
              @click="handleDelete(row, $index)">
            </el-button>
          </template>
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
      class="detail-dialog subform-dialog"
      :visible.sync='detailDialogVisible'
      :width='dialogWidth'
      append-to-body
      :close-on-click-modal='false'>
      <smart-form-show
        ref="smartFormShow"
        :formId="fieldObj.name"
        :form-data="{
          layout: {
            layoutType: 'vertical',
          },
          form: fieldObj.modelFields,
          attachedRule: attachedRule,
        }"
        :report-data="reportData">
      </smart-form-show>
    </el-dialog>

    <!-- 新增编辑对话框 -->
    <el-dialog
      :title='dialogTitle'
      class="subform-dialog"
      :visible.sync='formDialogVisible'
      append-to-body
      :width='dialogWidth'
      :close-on-click-modal='false'
      :before-close='handleClose'>
      <smart-form-report
        v-if="formDialogVisible"
        ref="smartFormReport"
        :formId="formId"
        :reportData="reportData"
        :form-data="{
          layout: {
            layoutType: 'vertical',
          },
          form: fieldObj.modelFields,
          attachedRule: attachedRule,
        }">
      </smart-form-report>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='handleClose'>取 消</el-button>
        <el-button type='primary' @click='handleSave'>确 定</el-button>
      </span>
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
  name: 'subform-report',
  components: {
    TableTag,
    FieldTag,
    ...fieldDetailComMap
  },
  inject: [
    'hasBorder',
    'isEditable'
  ],
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
      isDisabled: false, // 节流阀 防止重复保存
      editFlag: false,
      formDialogVisible: false,
      detailDialogVisible: false,
      formId: '',
      reportData: {},
      selectionData: []
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
      return this.fieldObj.attrs.dialogWidth + 'px'
    },
    dialogTitle() {
      return `${this.fieldObj.label}${this.editFlag ? '编辑' : '新增'}`
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
      let res = true
      if (this.isEditable) {
        res = this.isEditable(this.fieldObj, data)
      }
      return res
    },
    // 新建数据
    async handleAddData() {
      this.formId = this.fieldObj.name + '_' + Date.now()
      this.formDialogVisible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs.smartFormReport.initReportForm()
      })
    },
    // 编辑记录
    handleEdit(data, $index) {
      this.formId = this.fieldObj.name + '_' + Date.now()
      this.reportData = data
      this.editFlag = true
      this.formDialogVisible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs.smartFormReport.initReportForm()
      })
    },
    // 删除记录
    handleDelete(data, index) {
      this.$confirm('确认删除上报记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.arrayformSubmit) {
          this.arrayformSubmit({
            done: this.handleClose.bind(this),
            field: this.fieldObj,
            data: {
              dataId: data.dataId,
              currentData: data,
              updateData: data
            },
            type: 'delete'
          })
        } else {
          this.fieldObj.value.splice(index, 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查看记录
    handleCheck(data) {
      this.reportData = data
      this.detailDialogVisible = true
      this.$nextTick(() => {
        this.$refs.smartFormShow.initShowForm()
      })
    },
    // 新增/编辑保存
    async handleSave() {
      if (this.isDisabled) return
      try {
        const data = await this.$refs.smartFormReport.getReportData(this.formId)
        this.isDisabled = true
        if (this.arrayformSubmit) {
          return this.arrayformSubmit({
            done: this.handleClose.bind(this),
            field: this.fieldObj,
            data: {
              dataId: this.editFlag
                ? this.reportData.dataId
                : '',
              ...data
            },
            type: this.editFlag ? 'modify' : 'add'
          })
        }
        if (this.editFlag) {
          this.reportData = Object.assign(this.reportData, data.reportData)
        } else {
          // 插入数据
          this.fieldObj.value.unshift(data.reportData)
        }
        this.handleClose()
      } catch (error) {
        console.log(error)
      }
    },
    async handleClose() {
      this.formDialogVisible = false
      this.$nextTick(() => {
        this.editFlag = false
        this.reportData = {}
      })
    }
  }
}
</script>

<style scoped>
.subform-report {
  position: relative;
  line-height: 23px;
  width: 100%;
}
.subform-report .citeform_box__title {
  position: absolute;
  right: 10px;
  top: -38px;
  /* top: -45px; */
}
.el-table >>> .cell {
  display: flex;
}
.subform-dialog >>> .el-dialog__header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}
.detail-dialog >>> .el-dialog__body {
  padding: 10px 20px 30px;
}
</style>
