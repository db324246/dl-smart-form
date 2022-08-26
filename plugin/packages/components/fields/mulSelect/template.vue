<template>
  <el-select
    v-model="fieldObj.value"
    :style="templateStyle"
    :multiple="true"
    :placeholder="fieldObj.attrs.placeholder"
  >
    <el-option
      v-for="item in fieldObj.options"
      :key="item.value"
      :value="item.key"
      :label="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'mulSelect-template',
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
