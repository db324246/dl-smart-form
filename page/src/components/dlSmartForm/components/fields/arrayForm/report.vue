<template>
  <div class='arrayform-report citeform_box'
    :class="{
      'arrayform-report-border': hasBorder
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
            :field-val="row[item.name]">
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
              @click="handleEdit(row)">
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
      class="detail-dialog arrayform-dialog"
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
      class="arrayform-dialog"
      :visible.sync='formDialogVisible'
      append-to-body
      :width='dialogWidth'
      :close-on-click-modal='false'
      :before-close='() => handleClose(null)'>
      <smart-form-report
        v-if="formDialogVisible"
        ref="smartFormReport"
        :formId="fieldObj.name"
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
        <el-button @click='handleClose(null)'>取 消</el-button>
        <el-button type='primary' @click='handleSave'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableTag from './TableTag'
import Store from '../../../store'
import FieldTag from '../../FieldTag'
export default {
  name: 'arrayform-report',
  components: {
    TableTag,
    FieldTag,
    ...Store.fieldDetailComMap
  },
  inject: [
    'hasBorder',
    'isEditable',
    'arrayformSubmit'
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
        const field = this.modelFields.find(item => item.name === f.name)
        return field || f
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
      this.formDialogVisible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs.smartFormReport.initReportForm()
      })
    },
    // 编辑记录
    handleEdit(data) {
      this.reportData = data
      this.editFlag = true
      console.log('reportData', this.reportData)
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
      }).then(async() => {
        if (!this.arrayformSubmit) {
          this.fieldObj.value.splice(index, 1)
          return
        }
        await this.arrayformSubmit({
          done: this.handleClose.bind(this),
          field: this.fieldObj,
          data: {
            dataId: data.dataId,
            currentData: data,
            updateData: data
          },
          type: 'delete'
        })
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
        const data = await this.$refs.smartFormReport.getReportData(this.fieldObj.name)
        this.isDisabled = true
        if (!this.arrayformSubmit) return this.handleClose(data.reportData)
        await this.arrayformSubmit({
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
      } catch (error) {
        console.log(error)
      }
    },
    // 导入数据的选择
    handleChange(selection) {
      this.selectionData = selection
    },
    // 插入数据
    insertData(data) {
      this.fieldObj.value.unshift(data)
    },
    async handleClose(data) {
      if (data) {
        this.insertData(data)
      }
      this.formDialogVisible = false
      this.editFlag = false
      this.reportData = {}
    }
  }
}
</script>

<style scoped>
.arrayform-report {
  position: relative;
  line-height: 23px;
}
.arrayform-report .citeform_box__title {
  position: absolute;
  right: 10px;
  top: -38px;
  /* top: -45px; */
}
.el-table >>> .cell {
  display: flex;
}
.arrayform-dialog >>> .el-dialog__header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}
.detail-dialog >>> .el-dialog__body {
  padding: 10px 20px 30px;
}
</style>
