<template>
  <el-checkbox-group
    v-model="fieldObj.value"
    :style="templateStyle">
    <el-checkbox
      :label="item.key"
      v-for="item in fieldObj.options"
      :key="item.key">
      {{ item.value }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'checkboxGroup-template',
  props: {
    templateStyle: {
      type: Object,
      default: () => ({})
    },
    fieldObj: {
      type: Object,
      default: () => ({
        options: []
      })
    }
  }
}
</script>
