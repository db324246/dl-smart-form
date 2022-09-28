<template>
  <div class='field-config'>
    <smart-title title="节点配置" />

    <div class="field-config-wrapper">
      <div v-if="filedData.type === 'default'" class="default-config">
        请选择字段
      </div>
      <template v-else>
        <el-form label-position="top" size="small" class="attache-rule-form">
          <el-form-item label='字段唯一键'>
            <el-input v-model='filedData.key' @blur="handleCompleteKey"></el-input>
          </el-form-item>
        </el-form>
        <component
          :form="filedData"
          :is="componentId"
          :disabled="!filedData.configurable">
        </component>
      </template>

      <!-- 非单字段模式 && 字段name && 表单字段 -->
      <el-form
        v-if="layout !== 'single' && filedData.name && filedData.isFormField"
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
import Vue from 'vue'
import store from '@pr/store'
import ColConfig from './ColConfig'
import smartTitle from '@pr/components/smartTitle'
import {
  fieldConfigComMap // 字段配置组件集合
} from '@pr/components/fields'

export default {
  name: 'field-config',
  components: {
    ColConfig,
    smartTitle,
    ...fieldConfigComMap
  },
  inject: [
    'layout',
    'eventBus',
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
    customFields() {
      return store.customFields
    },
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
    this.handleRegister()
    store.$on('fields-register', this.handleRegister)
    this.eventBus.$on('edit-node', (field) => {
      this.filedData = field || {
        configurable: true,
        type: 'default'
      }
    })
    this.eventBus.$on('delete-field', ({ fieldKey }) => {
      if (fieldKey === this.filedData.name) {
        this.filedData = {
          configurable: true,
          type: 'default'
        }
      }
    })
    this.$on('hook:destroyed', () => {
      this.eventBus.$off('edit-node')
      store.$off('fields-register')
      this.eventBus.$off('delete-field')
    })
  },
  methods: {
    // 注册字段配置组件
    handleRegister() {
      this.customFields.forEach(item => {
        item.components.forEach(com => {
          const configCom = com.configComponent
          // 通过构造函数找到静态方法 component
          if (configCom && !Vue.component(configCom.name)) {
            Vue.component(configCom.name, configCom)
          }
        })
      })
    },
    // key 值不可为空
    handleCompleteKey() {
      this.filedData.key = this.filedData.key || this.filedData.name
    }
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
