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
import { mapGetters } from 'vuex'
import WidgetItem from '../components/WidgetItem'
export default {
  name: 'vertical-layout',
  inject: ['getFormId'],
  components: { WidgetItem },
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
  }
}
</script>

<style lang='scss' scoped>

</style>
