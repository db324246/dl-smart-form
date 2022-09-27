<template>
  <div class='vertical-layout'>
    <smart-title title="单字段模式">
    </smart-title>
    <div class="vertical-layout-wrapper">
      <mobile-layout
        ref="mobileLayout"
        editable>
      </mobile-layout>
    </div>
  </div>
</template>

<script>
import MobileLayout from './MobileLayout'
import smartTitle from '../../components/smartTitle'
export default {
  name: 'vertical-layout',
  inject: [
    'layout',
    'fieldsArr',
    'eventBus'
  ],
  components: {
    MobileLayout,
    smartTitle
  },
  data() {
    return {}
  },
  created() {
    this.eventBus.$on('get-layout', callBack => {
      const mLayout = this.$refs.mobileLayout.getLayout()
      callBack({
        rowsData: mLayout,
        layoutConfig: null
      })
    })

    this.$on('hook:destroyed', () => {
      this.eventBus.$off('get-layout')
    })
  }
}
</script>

<style scoped>
.vertical-layout {
  height: 100%;
}
.vertical-layout .smart-title {
  position: relative;
  border-bottom: 1px solid #ebf0fe;
}
.vertical-layout .smart-title >>> .smart-title__name {
  font-size: 18px;
  color: #00bfc4;
}
.vertical-layout .flex-config {
  margin: 10px 0;
  font-size: 14px;
  color: #b0b0b0;
  padding-left: 20px;
}
.vertical-layout .vertical-layout-wrapper {
  margin-top: 10px;
  height: calc(100% - 44px - 30px);
}
.vertical-layout .vertical-layout-wrapper .el-form {
  padding: 5px;
  box-sizing: border-box;
  border: 1px dashed #ccc;
}
.vertical-layout .rules-btn {
  position: absolute;
  top: 6px;
  right: 20px;
}
</style>
