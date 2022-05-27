import Vue from 'vue'

export default new Vue({
  data() {
    return {
      customFields: []
    }
  },
  computed: {
    customFieldsMap() {
      return this.customFields.reduce((p, c) => {
        return p.concat(c.components || [])
      }, [])
    },
    // 自定义字段配置组件集合
    customFieldConfigMap() {
      const customFieldConfigMap = {}
      this.customFieldsMap.forEach(f => {
        // 自定义字段存在配置组件的情况下，注册配置组件
        if (!f.configComponent) return
        Reflect.set(
          customFieldConfigMap,
          `${f.field.type}-config`,
          f.configComponent
        )
      })
      return customFieldConfigMap
    },
    // 自定义字段模板组件集合
    customFieldTempMap() {
      const customFieldTempMap = {}
      this.customFieldsMap.forEach(f => {
        // 自定义字段存在模板组件的情况下，注册模板组件
        if (!f.templateComponent) return
        Reflect.set(
          customFieldTempMap,
          `${f.field.type}-template`,
          f.templateComponent
        )
      })
      return customFieldTempMap
    }
  },
  watch: {
    customFields: {
      handler(val) {
        this.$emit('fields-register', val)
      },
      deep: true
    }
  }
})
