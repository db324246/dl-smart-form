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
        :disabled="!filedData.editable">
      </component>

      <el-form
        v-if="layout !== 'singleField' && filedData.name"
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
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Bus from '../Bus'
import store from '../../store'
import smartTitle from '../../components/smartTitle'
import { fieldConfigComMap } from '../../components/fields'

export default {
  name: 'field-config',
  components: {
    smartTitle,
    ...fieldConfigComMap,
    ...store.customFieldConfigMap
  },
  inject: [
    'layout',
    'fieldAttachedRule'
  ],
  data() {
    return {
      filedData: {
        editable: true,
        type: 'default'
      }
    }
  },
  computed: {
    componentId() {
      return (this.filedData.type || this.filedData.domtype) + '-config'
    },
    showAttachedRule() {
      return this.filedData.name && !['title'].includes(this.filedData.type)
    },
    fieldRule() {
      return this.fieldAttachedRule[this.filedData.name] || {}
    }
  },
  created() {
    Bus.$on('edit-node', (field) => {
      this.filedData = field || {
        editable: true,
        type: 'default'
      }
    })
    Bus.$on('delete-field', ({ fieldKey }) => {
      if (fieldKey === this.filedData.name) {
        this.filedData = {
          editable: true,
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

<style lang='scss' scoped>
.field-config {
  height: 100%;
  .smart-title {
    ::v-deep .smart-title__name {
      font-size: 18px;
      color: #00bfc4;
    }
  }
  .field-config-wrapper {
    padding-bottom: 50px;
    max-height: calc(100% - 40px);
    overflow-y: auto;
  }
  .attache-rule-form {
    padding: 0 10px;
  }
}
.default-config {
  font-size: 14px;
  color: #b0b0b0;
  text-align: center;
}
</style>
