<template>
  <el-radio-group v-model="fieldObj.value"
    :style="templateStyle"
  >
    <el-radio
      :label="item.key"
      v-for="item in fieldObj.options"
      :key="item.key"
    >
      {{ item.value }}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'radioGroup-template',
  props: {
    templateStyle: {
      type: Object,
      default: () => ({})
    },
    fieldObj: {
      type: Object,
      default: () => ({
        attrs: {},
        options: []
      })
    }
  }
}
</script>
