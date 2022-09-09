<template>
  <div :title="label" class='arrayform-field'>
    <common-title
      :title="showLabel ? label : ''"
      style="color: #48A6FD;">
      <field-tag :field="field"></field-tag>
    </common-title>

    <div class="arrayform-nodata" v-if="!tableData || !tableData.length">
      <div class="not_data">
          <img :src="require('@/components/dlCoustomForm/assets/noData.png')">
          <span>暂无数据</span>
        </div>
    </div>
    <div class="arrayform-box" v-else>
      <template>
        <div
          class="arrayform-data-item"
          v-for="row in showList"
          :key="row.dataId"
          @click.prevent="handleCheck(row)">
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
      </template>

      <div class="show-more" v-if="showList.length < tableData.length" @click="showMore">
        展开查看更多
        <svg-icon class="more-icon" icon-class='showMore' />
      </div>

      <div class="show-more" v-if="showList.length === tableData.length && tableData.length > 3" @click="hideMore">
        收起更多数据
        <svg-icon class="more-icon" icon-class='hideMore' />
      </div>

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
        <van-button type="default" block @click="handleClose">返回</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import TableTag from '@/components/dlCoustomForm/components/TableTag'
import FieldTag from '@/components/dlCoustomForm/components/FieldTag'
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
    ArrayFormHandlers,
  },
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
      dataDialogVisible: false,
      detailData: {},
      pageSize: 1
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
    }
  },
  methods: {
    handleCheck(row) {
      this.detailData = row
      this.dataDialogVisible = true
      // 将当前页面window.location.href 放入页面栈当中
      history.pushState({}, null, window.location.href + '#arrayformDetail')
      this.$nextTick(() => {
        this.$refs.customFormShow.initShowForm()
      })
    },
    handleClose() {
      // 关闭弹框时将页面历史往前推进一格
      window.history.go(-1)
      this.dataDialogVisible = false
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