<template>
  <van-form :key="formId" :label-width="labelWidth + 'px'">
    <widget-item
      v-for="field in fildsArr"
      :key="field.key"
      :field-name="field.name">
    </widget-item>
  </van-form>
</template>

<script>
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
  }
}
</script>

<style lang='less' scoped>

</style>