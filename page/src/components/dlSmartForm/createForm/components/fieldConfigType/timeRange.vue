<template>
  <el-form class='timeRange-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="开始时间占位内容">
      <el-input v-model="form.attrs.startPlaceholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="结束时间占位内容">
      <el-input v-model="form.attrs.endPlaceholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="格式">
      <el-select v-model="form.attrs.format" size="small" :disabled="disabled">
        <el-option value="HH:mm" label="时:分"></el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="默认值" v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0">
      <el-time-picker
        key="1"
        style="width: 100%;"
        v-if="!data.options.isRange"
        v-model="data.options.defaultValue"
        :arrowControl="data.options.arrowControl"
        :value-format="data.dateFormat"
      >
      </el-time-picker>
      <el-time-picker
        key="2"
        v-if="data.options.isRange"
        style="width: 100%;"
        v-model="data.options.defaultValue"
        is-range
        :arrowControl="data.options.arrowControl"
        :value-format="data.dateFormat"
      >
      </el-time-picker>
    </el-form-item> -->
  </el-form>
</template>

<script>
export default {
  name: 'timeRange-config',
  props: {
    form: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='scss' scoped>
.el-form {
  padding: 0 10px;
  ::v-deep .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
