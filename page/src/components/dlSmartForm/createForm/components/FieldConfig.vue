<template>
  <div class='field-config'>
    <smart-title title="节点配置" />

    <div class="field-config-wrapper">
      <div v-if="filedData.type === 'default'" class="default-config">
        请选择字段
      </div>
      <component
        v-else
        :form="filedData"
        :is="componentId"
        :disabled="!filedData.configurable">
      </component>

      <!-- 非单字段模式 && 字段name && 表单字段 -->
      <el-form
        v-if="layout !== 'singleField' && filedData.name && filedData.isFormField"
        label-position="top"
        class="attache-rule-form">
        <el-form-item >
          <span slot="label">
            模板附属规则
            <el-tooltip class="item" effect="dark" content="不会修改原字段，只在当前模板生效" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <div>
            <el-checkbox v-model="fieldRule.showLabel">显示字段标题</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="fieldRule.required">必填</el-checkbox>
          </div>
          <div>
            标题宽度：<el-input type="number" v-model.number="fieldRule.labelWidth" min="1"></el-input>
          </div>
          <div>
            内容宽度：<el-input type="number" v-model.number="fieldRule.mediumWidth" min="0"></el-input>
          </div>
          <div>
            标题对齐方式：
            <el-select v-model="fieldRule.labelPosition" placeholder="请选择">
              <el-option value="left" label="左对齐"></el-option>
              <el-option value="right" label="右对齐"></el-option>
              <el-option value="justify" label="两边对齐"></el-option>
              <el-option value="top" label="顶部对齐"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Bus from '../Bus'
import store from '../../store'
import ColConfig from './ColConfig'
import smartTitle from '../../components/smartTitle'

export default {
  name: 'field-config',
  components: {
    ColConfig,
    smartTitle,
    ...store.fieldConfigComMap
  },
  inject: [
    'layout',
    'getFieldAttachedRules'
  ],
  data() {
    return {
      filedData: {
        configurable: true,
        type: 'default'
      }
    }
  },
  computed: {
    componentId() {
      return (this.filedData.type || this.filedData.domtype) + '-config'
    },
    fieldAttachedRule() {
      return this.getFieldAttachedRules()
    },
    fieldRule() {
      return this.fieldAttachedRule[this.filedData.name] || {}
    }
  },
  created() {
    Bus.$on('edit-node', (field) => {
      this.filedData = field || {
        configurable: true,
        type: 'default'
      }
    })
    Bus.$on('delete-field', ({ fieldKey }) => {
      if (fieldKey === this.filedData.name) {
        this.filedData = {
          configurable: true,
          type: 'default'
        }
      }
    })
    this.$on('hook:destroyed', () => {
      Bus.$off('edit-node')
      Bus.$off('delete-field')
    })
  }
}
</script>

<style scoped>
.field-config {
  height: 100%;
}
.field-config .smart-title >>> .smart-title__name {
  font-size: 18px;
  color: #00bfc4;
}
.field-config .field-config-wrapper {
  padding-bottom: 50px;
  max-height: calc(100% - 43px);
  overflow-y: auto;
  box-sizing: border-box;
}
.field-config .attache-rule-form {
  padding: 0 10px;
}
.default-config {
  font-size: 14px;
  color: #b0b0b0;
  text-align: center;
}
</style>
