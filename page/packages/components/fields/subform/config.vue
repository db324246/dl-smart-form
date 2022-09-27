<template>
  <div class="subform-config">
    <el-form label-position="top" size="small">
      <el-form-item label="表格展示列">
        <el-select
          v-model="form.attrs.tableColumns"
          multiple
          placeholder="默认展示全部"
          :disabled="disabled">
          <el-option
            v-for="item in form.modelFields"
            :label="item.label"
            :value="item.name"
            :key="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上报弹框宽度">
        <el-input type="number" v-model.number="form.attrs.dialogWidth" min="400"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size='mini' type='primary' @click='dialogVisible = true'>对象集内部附属规则</el-button>
      </el-form-item>

      <el-form-item>
        <el-button size='mini' type='primary' @click='$refs.fieldRules.showDialog()'>对象集内部关联规则</el-button>
      </el-form-item>

      <field-rules
        ref="fieldRules"
        has-params
        :model-fields="form.modelFields"
        :correlative-rules.sync="form.attrs.fieldCorrelativeRules">
      </field-rules>
    </el-form>

    <el-dialog
      title='对象集内部附属规则'
      :visible.sync='dialogVisible'
      width='580px'
      :close-on-click-modal='false'>
      <el-form label-width='100px' label-position="left">
        <el-form-item
          v-for="(attachedRule, key) in form.attrs.fieldAttachedRule"
          :key="key"
          :label='returnFieldLabel(key)'>
          <el-checkbox v-model="attachedRule.showLabel">显示字段标题</el-checkbox>
          <el-checkbox v-model="attachedRule.required">必填</el-checkbox>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import FieldRules from '../../../createForm/components/fieldRules'
export default {
  name: 'subform-config',
  components: {
    FieldRules
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    returnFieldLabel(fieldName) {
      const field = this.form.modelFields
        .find(f => f.name === fieldName)
      return field ? field.label : ''
    }
  }
}
</script>

<style scoped>
.subform-config .el-form {
  padding: 0 10px;
}
.subform-config .el-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
