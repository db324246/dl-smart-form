<template>
  <div class='vertical-layout'>
    <el-form ref="flexForm" :label-width="labelWidth + 'px'" :model="form" :rules="rules">
      <template v-for="field in modelFields">
        <widget-item
          :key="field.key"
          :field-name="field.name">
        </widget-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import Bus from '../Bus'
import { mapGetters } from 'vuex'
import WidgetItem from '../components/WidgetItem'
export default {
  name: 'vertical-layout',
  components: { WidgetItem },
  inject: ['getFormId'],
  data() {
    return {

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
    labelWidth() {
      return 100
    },
    modelFields() {
      return this.$parent.form
    }
  },
  created() {
    Bus.$on('valide-form', (formId, callback) => {
      if (formId && formId !== this.formId) return
      this.$refs.flexForm.validate(valide => {
        if (!valide) return
        for (let i = 0, len = this.modelFields.length; i < len; i++) {
          const field = this.modelFields[i]
          if (['arrayform', 'subform'].includes(field.type)) {
            if (!field.value || !field.value.length) return this.$message.error(`请上报${field.label}`)
          }
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

</style>
