<template>
  <div
    class='flex-table-wr'
    :class="{
      'has-border': hasBorder,
      'no-border': !hasBorder
    }"
    :style="{
      width: boxWidth + 'px'
    }">
    <el-form ref="flexForm" :model="form" :rules="rules">
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
export default {
  name: 'flex-layout',
  components: { FlexRow },
  inject: [
    'formId',
    'getLayoutData'
  ],
  provide() {
    return {
      hasBorder: this.hasBorder
    }
  },
  computed: {
    busFormer() {
      return Bus.formerMap.get(this.formId)
    },
    form() {
      return this.busFormer.formWatcher.formModel
    },
    rules() {
      return this.busFormer.formWatcher.formModelRules
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
    }
  },
  created() {
    Bus.$on(`validate-form-${this.formId}`, async({ formId, resolve }) => {
      if (formId !== this.formId) return
      try {
        await this.$refs.flexForm.validate()
        resolve()
      } catch (err) {
        console.warn(err)
        this.$message.error('您有必填内容没有填写，请查看')
        resolve(Promise.reject(err))
      }
    })
    this.$on('hook:destroyed', () => {
      Bus.$off(`validate-form-${this.formId}`)
    })
  }
}
</script>

<style scoped>
.flex-table-wr {
  margin: 0 auto;
}
.has-border {
  border: 1px solid #999;
  border-bottom: none;
}
.has-border >>> .el-form-item__error {
  position: static;
}
.has-border >>> .widge-field-item_divider {
  display: block;
}
.has-border >>> .el-form-item {
  margin-bottom: 0;
}
.has-border >>> .flex-col {
  padding: 5px;
}
</style>
