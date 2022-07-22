<template>
  <el-form class='title-config' label-position="top" size="small">
    <el-form-item label="文本值：">
      <el-input v-model="form.value" maxlength="500" :disabled="disabled"/>
    </el-form-item>
    <el-form-item label="字号：">
      <el-select v-model="form.attrs.fontSize" :disabled="disabled">
        <el-option
          :key="item.value"
          :label="item.label"
          :value="item.value"
          v-for="item in ft_list">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="背景色：">
      <el-color-picker v-model="form.attrs.backgroundColor" :disabled="disabled"></el-color-picker>
    </el-form-item>
    <el-form-item label="文本颜色：">
      <el-color-picker v-model="form.attrs.color" :disabled="disabled"></el-color-picker>
    </el-form-item>
    <el-form-item label="是否加粗：">
      <el-switch
        :disabled="disabled"
        v-model="form.attrs.fontWeight"
        active-value="bold"
        inactive-value="normal">
      </el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'title-config',
  props: {
    form: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ft_list: [
        { label: '12', value: '12px' },
        { label: '14', value: '14px' },
        { label: '16', value: '16px' },
        { label: '18', value: '18px' },
        { label: '20', value: '20px' },
        { label: '24', value: '24px' },
        { label: '28', value: '28px' },
        { label: '32', value: '32px' },
        { label: '40', value: '40px' },
        { label: '48', value: '48px' }
      ]
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 0 10px;
}
.el-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.el-form .el-form-item {
  margin-bottom: 10px;
}
</style>
