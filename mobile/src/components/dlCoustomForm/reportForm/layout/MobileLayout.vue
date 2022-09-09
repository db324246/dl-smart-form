<template>
  <van-form ref="form" :key="formId" :label-width="labelWidth + 'px'">
    <widget-item
      v-for="field in fildsArr"
      :key="field.key"
      :field-name="field.name">
    </widget-item>
  </van-form>
</template>

<script>
import Bus from '../Bus'
import WidgetItem from '../components/WidgetItem'
export default {
  name: 'mobile-layout',
  inject: ['layout', 'getFormId', 'getLayoutData'],
  components: { WidgetItem },
  computed: {
    formId() {
      return this.getFormId()
    },
    layoutData() {
      return this.getLayoutData() || {}
    },
    mobileLayout() {
      return this.layoutData.mobileLayout || []
    },
    fildsArr() {
      switch (this.layout) {
        case 'default':
          return this.mobileLayout
        case 'vertical':
          return this.$parent.form
      }
    },
    labelWidth() {
      return (this.layoutData.layoutConfig && this.layoutData.layoutConfig.labelWidth) || 100
    }
  },
  created() {
    Bus.$on('valide-form', (formId, callback) => {
      if (formId && formId !== this.formId) return
      this.$refs.form.validate().then(() => {
        callback()
      }).catch(err => {
        this.$notify({ type: 'warning', message: '您有必填内容没有填写，请查看' });
        console.log(err)
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