<!-- 表格表单布局加移动端布局双tab -->
<template>
  <div class="two-layout-tab">
    <el-tabs
      v-model="activeName"
      type="card">
      <el-tab-pane label="PC端布局" name="PC">
        <flex-table-layout ref="flexTableLayout" />
      </el-tab-pane>
      <el-tab-pane label="移动端布局" name="mobile">
        <mobile-layout ref="mobileLayout" />
      </el-tab-pane>
    </el-tabs>

    <el-button
      class="rules-btn"
      @click="fieldCorrelativeRulesAdd"
      size="mini"
      type="primary"
      plain>
      <!-- <svg-icon icon-class="add" /> -->
      添加表单关联规则
    </el-button>

    <field-rules ref="fieldRules"></field-rules>
  </div>
</template>

<script>
import MobileLayout from './MobileLayout'
import FieldRules from '../components/fieldRules'
import FlexTableLayout from './FlexTableLayout/FlexLayout'

export default {
  name: 'two-layout-tab',
  inject: ['eventBus'],
  components: {
    FlexTableLayout,
    MobileLayout,
    FieldRules
  },
  data() {
    return {
      activeName: 'PC'
    }
  },
  created() {
    this.eventBus.$on('get-layout', callBack => {
      const pcLayout = this.$refs.flexTableLayout.getLayout()
      const mLayout = this.$refs.mobileLayout.getLayout()

      callBack({
        pcLayout,
        mobileLayout: mLayout
      })
    })

    this.$on('hook:destroyed', () => {
      this.eventBus.$off('get-layout')
    })
  },
  methods: {
    // 配置关联规则
    fieldCorrelativeRulesAdd() {
      this.$refs.fieldRules.showDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
.two-layout-tab {
  position: relative;
  height: 100%;
  .el-tabs {
    height: 100%;
    margin-top: -1px;
    margin-left: -1px;
    ::v-deep .el-tabs__content {
      height: calc(100% - 41px - 15px);
    }
    .el-tab-pane {
      height: 100%;
    }
  }
  .rules-btn {
    position: absolute;
    top: 6px;
    right: 20px;
  }
}
</style>
