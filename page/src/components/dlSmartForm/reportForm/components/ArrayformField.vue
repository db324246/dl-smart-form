<template>
  <div class='arrayform-field citeform_box'>
    <div
      class="citeform_box__title">
      <div class="citeform_box__title-box">
        <span v-if="showLabel">{{ fieldObj.label }}</span>
        <span v-else></span>
        <field-tag :field="fieldObj"></field-tag>
      </div>
      <el-button
        type="primary" size="mini" icon="el-icon-plus"
        circle plain
        :title="buttonTitle"
        @click="handleAddData"
        ></el-button>
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
      <el-table-column label="操作" width="205" fixed="right">
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
              @click="handleDelete(row)">
            </el-button>
          </template>
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

    <!-- 新增编辑对话框 -->
    <el-dialog
      :title='dialogTitle'
      :visible.sync='formDialogVisible'
      append-to-body
      width='580px'
      :close-on-click-modal='false'
      :before-close='() => handleClose(null)'>
      <custom-form-report
        v-if="formDialogVisible"
        ref="customFormReport"
        :formId="fieldObj.name"
        :reportData="reportData"
        layout="vertical"
        :form="fieldObj.modelFields"
        :attachedRule="attachedRule"
        :fileCode="fileCode">
      </custom-form-report>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='handleClose(null)'>取 消</el-button>
        <el-button type='primary' @click='handleSave'>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      :title='fieldObj.label'
      :visible.sync='importDialogVisible'
      width='580px'
      :close-on-click-modal='false'
      :before-close='handleImportClose'>
      <div class="edu-toolbars__btns">
        <el-button class="edu-toolbars__item">
          <!-- <svg-icon icon-class="add" /> -->
          新建记录
        </el-button>
      </div>
      <el-table
        :data='importTableData'
        style='width: 100%'
        @selection-change="handleChange">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          :label="item.label"
          :key="item.name"
          v-for="item in fieldObj.attrs.tableColumns">
        </el-table-column>
      </el-table>

      <div class='pagination-container'>
        <el-pagination
          @size-change='handleSizeChange'
          @current-change='handleCurrentChange'
          :current-page='queryPage.pageNumber'
          :page-sizes='[10, 20, 50, 100]'
          :page-size='queryPage.pageSize'
          layout='total, sizes, prev, pager, next, jumper'
          :total='total'>
        </el-pagination>
      </div>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='handleImportClose'>取 消</el-button>
        <el-button type='primary' @click='handleSaveImport' :disabled="isDisabled">确 定</el-button>
      </span>
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
  inject: [
    'fileCode',
    'isEditable',
    'arrayformWay',
    'arrayformSubmit',
    'queryImportArrayformData'
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
      isDisabled: false,
      queryPage: {
        pageNumber: 1,
        pageSize: 10
      },
      importFlag: false,
      editFlag: false,
      formDialogVisible: false,
      importDialogVisible: false,
      detailDialogVisible: false,
      detailData: {},
      reportData: {},
      importTableData: [],
      total: 0,
      selectionData: []
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
    buttonTitle() {
      return this.arrayformWay
        ? `新建${this.fieldObj.label}`
        : `选择${this.fieldObj.label}`
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
      if (this.arrayformWay) {
        this.formDialogVisible = true
        this.isDisabled = false
        this.$nextTick(() => {
          this.$refs.customFormReport.initReportForm()
        })
      } else {
        await this.getList()
        this.importDialogVisible = true
        this.importFlag = true
      }
    },
    // 编辑记录
    handleEdit(data) {
      this.reportData = data
      this.editFlag = true
        console.log('reportData', this.reportData)
      this.formDialogVisible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs.customFormReport.initReportForm()
      })
    },
    // 删除记录
    handleDelete(data) {
      this.$confirm('确认删除上报记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
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
      this.detailData = data
      this.detailDialogVisible = true
      this.$nextTick(() => {
        this.$refs.customFormShow.initShowForm()
      })
    },
    // 新增/编辑保存
    async handleSave() {
      if (this.isDisabled) return
      try {
        const data = await this.$refs.customFormReport.getReportData(this.fieldObj.name)
        this.isDisabled = true
        await this.arrayformSubmit({
          done: this.handleClose.bind(this),
          field: this.fieldObj,
          data: {
            dataId: this.editFlag
              ? this.reportData.dataId
              : '',
            ...data
          },
          type: this.importFlag
            ? 'import'
            : (this.editFlag ? 'modify' : 'add')
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 导入数据的选择
    handleChange(selection) {
      this.selectionData = selection
    },
    // 保存导入
    handleSaveImport() {
      this.selectionData.forEach(
        this.insertData
      )
      this.handleImportClose()
    },
    // 操作数据
    insertData(data) {
      this.fieldObj.value.unshift(data)
    },
    handleImportClose() {
      this.importDialogVisible = false
    },
    async handleClose(data) {
      if (this.importFlag) {
        await this.getList()
      } else if (data) {
        this.insertData(data)
      }
      this.formDialogVisible = false
      this.importFlag = false
      this.editFlag = false
      this.reportData = {}
    },
    // 获取重复上报的导入的分页数据
    async getList() {
      try {
        const { records, total } = await this.queryImportArrayformData(
          this.queryPage
        )
        this.importTableData = records
        this.total = total
      } catch (error) {
        console.log(error)
      }
    },
    // 导入的数据分页
    handleSizeChange(val) {
      this.queryPage.pageSize = val
      this.queryPage.pageNumber = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryPage.pageNumber = val
      this.getList()
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
.citeform_box__title-box {
  display: flex;
}
.el-table {
  ::v-deep .cell {
    display: flex;
  }
}
.el-button {
  margin-right: 5px;
}

</style>
