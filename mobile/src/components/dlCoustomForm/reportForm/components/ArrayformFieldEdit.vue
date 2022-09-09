<template>
  <div class='arrayform-field'>
    <custom-form-report
      ref="customFormReport"
      :formId="field.name"
      :reportData="reportData" 
      layout="vertical"
      :form="field.modelFields"
      :attachedRule="attachedRule"
      :fileCode="fileCode">
    </custom-form-report>
    <div class="citeform-tools" style="margin: 20px">
      <template>
        <van-button
          type="info"
          block
          @click="handleSave" style="margin-bottom: 10px">保存
        </van-button>
        <van-button type="default" block @click="handleClose(null)">取消</van-button>
      </template>
    </div>
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
  props: {
    field: {
      type: Object
    },
    reportData: {
      type: Object
    },
    arrayformSubmit: {
      type: Function,
      default: null
    },
    fileCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      queryPage: {
        pageNumber: 1,
        pageSize: 10
      },
      importFlag: false,
      editFlag: true,
      dataDialogVisible: false,
      formDialogVisible: false,
      importDialogVisible: false,
      detailData: {},
      importTableData: [],
      total: 0,
      selectionData: [],
      pageSize: 1,
    }
  },
  computed: {
    attachedRule() {
      const {
        fieldAttachedRule,
        fieldCorrelativeRules
      } = this.field.attrs
      return { fieldAttachedRule, fieldCorrelativeRules }
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.customFormReport.initReportForm()
    })
  },
  methods: {
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
    // 关闭新增框
    async handleClose(data) {
      var localStorage = window.localStorage
      localStorage.removeItem('arrayformEditField')
      localStorage.removeItem('arrayformEditRowData')
      localStorage.removeItem('arrayformEditFormId')
      localStorage.removeItem('arrayformEditTemplateInfo')
      if (window.location.href.indexOf('#') > 0) {
        window.history.go(-1)
      }
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