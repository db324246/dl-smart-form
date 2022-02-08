<template>
  <div
    class='flex-table-wr'
    :class="{ 'has-border': hasBorder }"
    :style="{
      width: boxWidth + 'px'
    }">
    <el-form ref="flexForm" :label-width="labelWidth + 'px'" :model="form" :rules="rules">
      <flex-row
        v-for="row in rowsData"
        :key="row.key"
        :value="row">
      </flex-row>
    </el-form>
  </div>
</template>

<script>
import Bus from '../../Bus'
import FlexRow from './FlexRow'
import { mapGetters } from 'vuex'
export default {
  name: 'flex-layout',
  components: { FlexRow },
  inject: ['getFormId', 'getLayoutData'],
  provide() {
    return {
      hasBorder: this.hasBorder
    }
  },
  computed: {
    ...mapGetters('customForm', [
      'getFields',
      'formModel',
      'formModelRules'
    ]),
    formId() {
      return this.getFormId()
    },
    form() {
      return this.formModel(this.formId)
    },
    rules() {
      return this.formModelRules(this.formId)
    },
    layoutData() {
      const layout = this.getLayoutData() || {}
      return layout.pcLayout || {}
    },
    rowsData() {
      return this.layoutData.rowsData || []
    },
    hasBorder() {
      return this.layoutData.layoutConfig && this.layoutData.layoutConfig.hasBorder
    },
    boxWidth() {
      return (this.layoutData.layoutConfig && this.layoutData.layoutConfig.width) || 1000
    },
    labelWidth() {
      return (this.layoutData.layoutConfig && this.layoutData.layoutConfig.labelWidth) || 100
    }
  },
  created() {
    Bus.$on('valide-form', (formId, callback) => {
      if (formId && formId !== this.formId) return
      this.$refs.flexForm.validate(valide => {
        if (!valide) {
          this.$message.error(`您有必填内容没有填写，请查看`)
          return
        }
        callback()
      })
    })
    this.$on('hook:destroyed', () => {
      Bus.$off('valide-form')
    })
  }
}
</script>

<style lang='scss' scoped>
.flex-table-wr {
  margin: 0 auto;
}
.has-border {
  border: 1px solid #999;
  border-bottom: none;
}
::v-deep .el-form-item__error {
  position: static;
}
</style>
