<template>
  <el-select
    :value="value"
    @input="update"
     clearable :placeholder="placeholder" :disabled="disabled">
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.value"
      :value="item.key">
    </el-option>
  </el-select>
</template>

<script>
export default {
  // props: ['value', 'options', 'placeholder'],
  props: {
    value: {
      type: String
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    update(val) {
      this.$emit('input', val)
    }
  },
  watch: {
  }
}
</script>

<style>

</style>
