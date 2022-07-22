<template>
  <div class='vertical-layout'>
    <el-form ref="flexForm" class="detail-form" :model="form" :rules="rules">
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
import Bus from '../../reportForm/Bus'
import WidgetItem from '../components/WidgetItem'
export default {
  name: 'vertical-layout',
  inject: ['formId'],
  components: { WidgetItem },
  computed: {
    former() {
      return Bus.formerMap.get(this.formId)
    },
    form() {
      return this.former.formWatcher.formModel
    },
    rules() {
      return this.former.formWatcher.formModelRules
    },
    modelFields() {
      return this.$parent.form
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
