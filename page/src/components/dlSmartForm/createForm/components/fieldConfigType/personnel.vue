<template>
  <el-form class='personnel-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="占位内容">
      <el-input v-model="form.attrs.placeholder" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="选择目标">
      <el-radio-group v-model="form.attrs.target" :disabled="disabled">
        <el-radio label="unit">学校/单位</el-radio>
        <el-radio label="teacher">教师</el-radio>
        <el-radio label="student">学生</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="是否单选">
      <el-switch
        :disabled="disabled"
        v-model="form.attrs.isSingle"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </el-form-item>

    <el-form-item label="选择范围">
      <el-radio-group v-model="form.attrs.rangeType" :disabled="disabled">
        <el-radio label="release">发布范围</el-radio>
        <el-radio label="manage">管理范围</el-radio>
        <el-radio label="custom">自定义范围</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="form.attrs.rangeType === 'custom'" label="自定义范围">
      <address-book
        ref="addressfabu"
        :config="orgConfig"
        :is-disabled="disabled"
        v-model="form.attrs.customRange">
      </address-book>
    </el-form-item>
  </el-form>
</template>

<script>
import AddressBook from '@/components/EduAddressBook/index'
export default {
  name: 'personnel-config',
  components: {
    AddressBook
  },
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
      orgConfig: { // 自定义范围配置项
        placeholder: '请选择自定义范围', // 按钮或点击input的提示性文字
        dialogTitle: '请选择自定义范围', // 弹出框标题
        rangeType: 'manage', // 范围类型，发布范围 'release' 还是 管理范围 'manage'
        activeTab: 'unit', // 首先展示的tab， 'org'组织人员，'unit'单位/学校，'group'常用组
        isSingle: false, // 是否单选
        target: 'all', // 最终指向，'user'代表用户, 'unit'代表学校、部门, 'all' 所有
        org: {
          show: false // 是否展示
        },
        unit: { // 单位/学校 配置
          show: true, // 是否展示
          isShowDepart: false, // 是否展示部门
          isOnlyChoseDepart: false // 是否只选部门
        },
        group: { // 常用组配置
          show: false // 是否展示
        }
      }
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
    .el-radio {
      margin-bottom: 5px;
    }
  }
}
</style>
