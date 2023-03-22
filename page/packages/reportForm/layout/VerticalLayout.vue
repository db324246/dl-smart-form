<template>
  <div class='vertical-layout'>
    <el-form ref="flexForm" :model="form" :rules="rules">
      <widget-item v-for="field in layoutData"
        :key="field.key"
        :field-name="field.name">
      </widget-item>
    </el-form>
  </div>
</template>

<script>
import Bus from '../Bus'
import WidgetItem from '../components/WidgetItem'
export default {
  name: 'vertical-layout',
  components: { WidgetItem },
  inject: [
    'formId',
    'getLayoutData'
  ],
  provide() {
    return {
      hasBorder: false
    }
  },
  data() {
    return {}
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
      return layout.mobileLayout || {}
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
        resolve(Promise.reject(err))
      }
    })
    this.$on('hook:destroyed', () => {
      Bus.$off(`validate-form-${this.formId}`)
    })
  }
}
</script>

<style lang='scss' scoped>

</style>
