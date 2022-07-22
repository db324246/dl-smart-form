<template>
  <el-form class='input-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="占位内容">
      <el-input v-model="form.attrs.placeholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="最大输入长度">
      <el-input-number v-model="form.attrs.maxlength" :min="0" :max="9999" :step="1" :disabled="disabled"></el-input-number>
    </el-form-item>

    <el-form-item label="默认值" >
      <el-input v-model="form.value" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="校验">
      <el-select class="w-100per" v-model="form.attrs.dataType" size="small" :disabled="disabled">
        <el-option value="string" label="字符串"></el-option>
        <el-option value="cardId" label="身份证"></el-option>
        <el-option value="phone" label="手机"></el-option>
        <el-option value="url" label="URL地址"></el-option>
        <el-option value="email" label="邮箱地址"></el-option>
      </el-select>

      <div v-if="form.attrs.dataType === 'string'" class="reg-input">
        <el-input
          size="small"
          :disabled="disabled"
          v-model.lazy="form.attrs.pattern"
          placeholder="填写正则表达式">
          <span slot="prepend">/</span>
          <span slot="append">/</span>
        </el-input>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'input-config',
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
.w-100per {
  width: 100%;
}
.reg-input {
  margin-top: 10px;
}
</style>
