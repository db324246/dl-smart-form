<template>
  <div class='vertical-layout'>
    <smart-title :title="title">
      <el-button
        v-if="showFieldRulesBtn"
        class="rules-btn"
        @click="fieldCorrelativeRulesAdd"
        size="mini"
        type="primary"
        plain>
        <!-- <svg-icon icon-class="add" /> -->
        添加表单关联规则
      </el-button>
    </smart-title>
    <div class="flex-config">
      重复上报表单创建后是以字段的形式在其它上报表单中引用
      <el-button size="mini" type="primary" plain @click="dialogVisible = true">重复上报表单配置</el-button>
    </div>
    <div class="vertical-layout-wrapper">
      <mobile-layout
        ref="mobileLayout"
        editable
        @ver_del-field="handleDelField"
        @ver_add-field="handleAddField">
      </mobile-layout>
    </div>
    <field-rules ref="fieldRules"></field-rules>

    <el-dialog
      title='重复上报表单配置'
      :visible.sync='dialogVisible'
      width='520px'
      :close-on-click-modal='false'>
      <el-form label-width="100px" :model="formConfig" @submit.native.prevent>
        <el-form-item label="可展示列">
          <el-select v-model="formConfig.tableColumns" value-key="name" multiple placeholder="默认展示全部">
            <el-option
              v-for="item in modelFields"
              :label="item.label"
              :value="item"
              :key="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可查询列">
          <el-select v-model="formConfig.queryFields" value-key="name" multiple placeholder="请选择可查询列">
            <el-option
              v-for="item in modelFields"
              :label="item.label"
              :value="item"
              :key="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Bus from '../Bus'
import { deepClone } from '@/components/dlSmartForm/utils'
import MobileLayout from './MobileLayout'
import smartTitle from '../../components/smartTitle'
import FieldRules from '../components/fieldRules'
export default {
  name: 'vertical-layout',
  inject: ['layout'],
  components: {
    MobileLayout,
    FieldRules,
    smartTitle
  },
  data() {
    return {
      dialogVisible: false,
      formConfig: {
        tableColumns: [],
        queryFields: []
      },
      modelFields: []
    }
  },
  computed: {
    title() {
      return this.layout === 'vertical'
        ? '重复上报模式'
        : '单字段模式'
    },
    showFieldRulesBtn() {
      return this.layout === 'vertical'
    }
  },
  created() {
    Bus.$on('get-layout', callBack => {
      const mLayout = this.$refs.mobileLayout.getLayout()
      callBack({
        rowsData: mLayout,
        layoutConfig: null
      })
    })

    this.$on('hook:destroyed', () => {
      Bus.$off('get-layout')
    })
  },
  methods: {
    // 配置关联规则
    fieldCorrelativeRulesAdd() {
      this.$refs.fieldRules.showDialog()
    },
    handleAddField(field) {
      const _field = deepClone(field)
      this.modelFields.push(_field)
      if (this.formConfig.tableColumns.length < 3) {
        this.formConfig.tableColumns.push(_field)
      }
    },
    handleDelField(field) {
      const index = this.modelFields.findIndex(f => f.name === field.name)
      this.modelFields.splice(index, 1)
      const index2 = this.formConfig.tableColumns.findIndex(f => f.name === field.name)
      if (index2 >= 0) {
        this.formConfig.tableColumns.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.vertical-layout {
  height: 100%;
}
.vertical-layout .smart-title {
  position: relative;
  border-bottom: 1px solid #ebf0fe;
}
.vertical-layout .smart-title >>> .smart-title__name {
  font-size: 18px;
  color: #00bfc4;
}
.vertical-layout .flex-config {
  margin: 10px 0;
  font-size: 14px;
  color: #b0b0b0;
  padding-left: 20px;
}
.vertical-layout .vertical-layout-wrapper {
  height: calc(100% - 40px - 28px - 20px);
}
.vertical-layout .vertical-layout-wrapper .el-form {
  padding: 5px;
  border: 1px dashed #ccc;
}
.vertical-layout .rules-btn {
  position: absolute;
  top: 6px;
  right: 20px;
}
</style>
