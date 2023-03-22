<template>
  <div class='vertical-layout'>
    <el-form ref="flexForm" class="detail-form" :model="form">
      <widget-item v-for="field in layoutData"
        :key="field.key"
        :field-name="field.name">
      </widget-item>
    </el-form>
  </div>
</template>

<script>
import Bus from '../../reportForm/Bus'
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
  computed: {
    former() {
      return Bus.formerMap.get(this.formId)
    },
    form() {
      return this.former.formWatcher.formModel
    },
    layoutData() {
      const layout = this.getLayoutData() || {}
      return layout.mobileLayout || {}
    }
  }
}
</script>

<style scoped>
.detail-form >>> .el-form-item {
  margin-bottom: 0;
}
.detail-form >>> .el-form-item__content,
.detail-form >>> .el-form-item__label {
  line-height: 28px;
}
</style>
