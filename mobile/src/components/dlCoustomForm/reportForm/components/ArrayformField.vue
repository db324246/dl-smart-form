<template>
  <div :title="label" class='arrayform-field'>
    <common-title
      :title="showLabel ? label : ''"
      style="color: #48A6FD; min-height: 20px;">
      <field-tag :field="field"></field-tag>
      <span class="arrayform-addbtn" slot="right" @click="handleAddData">+</span>
    </common-title>

    <div class="arrayform-nodata" v-if="!tableData || !tableData.length">
      <div class="not_data">
          <img :src="require('@/components/dlCoustomForm/assets/noData.png')">
          <span>暂无数据</span>
        </div>
    </div>

    <div class="arrayform-box" v-else>
      <template >
        <div
          class="arrayform-data-item"
          v-for="row in showList"
          :key="row.dataId"
          @click="handleCheck(row)">
          <div class="arrayform-data_content">
            <div
              class="arrayform-data_col"
              v-for="col in tableColumns"
              :key="col.name">
              <div class="col-label">{{ col.label }}：</div>
              <div class="col-content">
                <field-data-com
                  :field-obj="col"
                  :field-val="row[col.name]">
                </field-data-com>
              </div>
            </div>
          </div>
          <div class="arrayform-data_tool">
            <table-tag
              :field="field"
              :row-data="row">
            </table-tag>
            <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
          </div>
        </div>
        <div class="show-more" v-if="showList.length < tableData.length" @click="showMore">
          展开查看更多
          <svg-icon class="more-icon" icon-class='showMore' />
        </div>

        <div class="show-more" v-if="showList.length === tableData.length && tableData.length > 3" @click="hideMore">
          收起更多数据
          <svg-icon class="more-icon" icon-class='hideMore' />
        </div>

      </template>
    </div>

    <!-- 数据记录详情弹框 -->
    <!-- close-on-popstate -->
    <van-popup v-model="dataDialogVisible"
      close-on-popstate
      class="full-screen-popup"
      position="right"
      :duration="0.2"
      get-container="body">
      <custom-form-show
        ref="customFormShow"
        :form="field.modelFields"
        :formId="field.name"
        layout="vertical"
        :attached-rule="attachedRule"
        :report-data="detailData">
      </custom-form-show>
      <div class="arrayform-tools">
        <array-form-handlers
          :field="field"
          :row-data="detailData">
        </array-form-handlers>
        <template v-if="computedEditable(detailData)">
          <van-button
            type="info" 
            block
            @click="handleEdit(detailData)">
            编辑
          </van-button>
          <van-button
            type="danger"
            block
            @click="handleDelete(detailData)">
            删除
          </van-button>
        </template>
        <van-button type="default" block @click="handleDataClose">返回</van-button>
      </div>
    </van-popup>

    <!-- 编辑或新增弹框 -->
    <!-- close-on-popstate -->
    <van-popup v-model="formDialogVisible"
      close-on-popstate
      class="full-screen-popup"
      position="right"
      :duration="0.2">
      <custom-form-report
        v-if="formDialogVisible"
        ref="customFormReport"
        :formId="field.name"
        :reportData="reportData" 
        layout="vertical"
        :form="field.modelFields"
        :attachedRule="attachedRule"
        :fileCode="fileCode">
      </custom-form-report>
      <div class="citeform-tools" style="margin: 20px">
        <van-button
          type="info"
          block
          @click="handleSave" style="margin-bottom: 10px">保存
        </van-button>
        <van-button type="default" block @click="handleClose(null)">取消</van-button>
      </div>
    </van-popup>

    <!-- 导入数据对话框 -->
    <!-- close-on-popstate -->
    <van-popup v-model="importDialogVisible"
      close-on-popstate
      class="full-screen-popup"
      position="right"
      :duration="0.2"
      get-container="body">
    </van-popup>

  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import CustomFormShow from '@/components/dlCoustomForm/showForm'
import FieldTag from '@/components/dlCoustomForm/components/FieldTag'
import TableTag from '@/components/dlCoustomForm/components/TableTag'
import FieldDataCom from '@/components/dlCoustomForm/components/FieldDataCom'
import ArrayFormHandlers from '@/components/dlCoustomForm/components/ArrayFormHandlers'
import { deepClone } from '@/utils'
export default {
  name: 'arrayform-field',
  components: {
    FieldTag,
    TableTag,
    CommonTitle,
    FieldDataCom,
    CustomFormShow,
    ArrayFormHandlers
  },
  inject: [
    'fileCode',
    'isEditable',
    'arrayformWay',
    'arrayformSubmit',
    'queryImportArrayformData'
  ],
  props: {
    field: {
      type: Object
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      queryPage: {
        pageNumber: 1,
        pageSize: 10
      },
      importFlag: false,
      editFlag: false,
      dataDialogVisible: false,
      formDialogVisible: false,
      importDialogVisible: false,
      detailData: {},
      reportData: {},
      importTableData: [],
      total: 0,
      selectionData: [],
      pageSize: 1,
    }
  },
  computed: {
    label() {
      return this.field.label || ''
    },
    tableData() {
      return this.field.value || []
    },
    showList() {
      const num = 3 + (this.pageSize - 1) * 10
      return deepClone(this.tableData).slice(0, num)
    },
    tableColumns() {
      if (this.field.attrs.tableColumns.length) {
        return this.field.attrs.tableColumns
      } else {
        return this.field.modelFields
      }
    },
    attachedRule() {
      const {
        fieldAttachedRule,
        fieldCorrelativeRules
      } = this.field.attrs
      return { fieldAttachedRule, fieldCorrelativeRules }
    },
    dialogTitle() {
      return `${this.field.label}${this.editFlag ? '编辑' : '新增'}`
    }
  },
  methods: {
    computedEditable(data) {
      if (this.isEditable) {
        return this.isEditable(
          this.field,
          data
        )
      } else {
        return true
      }
    },
    // 新建数据
    async handleAddData() {
      if (this.arrayformWay) {
        this.formDialogVisible = true
        // 将当前页面window.location.href 放入页面栈当中
        history.pushState({}, null, window.location.href + '#arrayformRecordAdd');
        this.$nextTick(() => {
          this.$refs.customFormReport.initReportForm()
        })
      } else {
        await this.getList()
        // 将当前页面window.location.href 放入页面栈当中
        history.pushState({}, null, window.location.href + '#arrayformRecordImport');
        this.importDialogVisible = true
        this.importFlag = true
      }
    },
    // 编辑记录
    handleEdit(data) {

      this.editFlag = true
      this.reportData = data
      this.formDialogVisible = true
      this.$nextTick(() => {
        this.$refs.customFormReport.initReportForm()
      })
    },
    // 删除记录
    handleDelete(data) {
      this.$dialog.confirm({
        title: '提示',
        message: '确认删除上报记录？',
      })
        .then(async () => {
          await this.arrayformSubmit({
            done: this.handleClose.bind(this),
            field: this.field,
            data: {
              dataId: data.dataId,
              currentData: data,
              updateData: data
            },
            type: 'delete'
          })
        })
        .catch(() => {
          this.$toast('已取消删除')
        })
    },
    // 查看记录
    handleCheck(data) {
      this.detailData = data
      this.dataDialogVisible = true
      // 将当前页面window.location.href 放入页面栈当中
      history.pushState({}, null, window.location.href + '#arrayformDetail')
      this.$nextTick(() => {
        this.$refs.customFormShow.initShowForm()
      })
    },
    // 新增/编辑 保存
    async handleSave() {
      try {
        const data = await this.$refs.customFormReport.getReportData(this.field.name)
        await this.arrayformSubmit({
          done: this.handleClose.bind(this),
          field: this.field,
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
    // 导入 保存
    handleSaveImport() {
      this.selectionData.forEach(
        this.insertData
      )
      this.handleImportClose()
    },
    // 插入数据
    insertData(data) {
      this.field.value.unshift(data)
    },
    // 关闭导入框
    handleImportClose() {
      this.importDialogVisible = false
    },
    // 关闭新增框
    async handleClose(data) {
      // 是否需要返回上一页
      const backFlag = this.editFlag
      if (this.importFlag) {
        await this.getList()
      } else if (data) {
        this.insertData(data)
      }
      this.formDialogVisible = false
      this.importFlag = false
      this.editFlag = false
      this.reportData = {}
      // 关闭弹框时将页面历史往前推进一格
      if (!backFlag && window.location.href.indexOf('#') > 0) {
        window.history.go(-1)
      }
    },
    // 关闭详情框
    handleDataClose() {
      // 关闭弹框时将页面历史往前推进一格
      this.dataDialogVisible = false
      if (window.location.href.indexOf('#') > 0) { // 如果点击编辑再取消 会多返回一次
        window.history.go(-1)
      }
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
    showMore() {
      this.pageSize = this.pageSize + 1
    },
    hideMore() {
      this.pageSize = 1
    }
  }
}
</script>

<style lang='less' scoped>
.arrayform-addbtn {
  display: inline-block;
  border: 1px solid @blue;
  border-radius: 50%;
  line-height: 36px;
  text-align: center;
  width: 32px;
  height: 32px;
}
.arrayform-box {
  background-color: #f8f8f8;
  overflow: hidden;
  .arrayform-data-item {
    position: relative;
    display: flex;
    background-color: #fff;
    margin: 12px 12px;
    padding: 20px 10px 20px 30px;
    .arrayform-data_content {
      flex: 1;
    }
    .arrayform-data_tool {
      width: fit-content;
      min-width: fit-content;
    }
  }
}
.arrayform-data_col {
  display: flex;
  width: 100%;
  font-size: 14px;
  padding: 10px 0;
  .col-label {
    width: 5.2em;
    padding-right: 15px;
    text-align: right;
    line-height: 1.2em;
    color:#333;
  }
  .col-content {
    flex: 1;
    line-height: 1.2em;
    color:#5f5f5f;
  }
}
.arrayform-tools {
  padding: 16px;
  /deep/ .van-button {
    margin-bottom: 10px;
  }
}
.arrayform-nodata {
    color: #888;
    text-align: center;
    display:block;
    margin-bottom: 50px;
    background: #fff;
    margin-top: 10PX;
}
.not_data {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 50PX 0 50PX 0;
  color: #B0B0B0;
  img {
    width: 240px;
  }
  span {
    margin-top: 26px;
    font-size: 14PX;
  }
}
.show-more {
  text-align: center;
  color: #48a6fc;
  font-size: 14px;
  margin: 10PX 0;
  .more-icon {
    font-size: 12px;
    margin-left: 2PX;
  }
}
</style>