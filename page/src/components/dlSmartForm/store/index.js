import Vue from 'vue'
import {
  default as allOriginField, // 所有元字段的类型集合
  fieldConfigComMap, // 字段配置组件集合
  fieldTempComMap, // 字段模板组件集合
  fieldReportComMap, // 字段上报组件集合
  fieldDetailComMap // 字段详情组件集合
} from '../components/fields'

export default new Vue({
  data() {
    return {
      customFields: []
    }
  },
  computed: {
    // 自定义字段集合
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
    },
    // 自定义字段上报组件集合
    customFieldReportMap() {
      const fieldReportComMap = {}
      this.customFieldsMap.forEach(f => {
        // 自定义字段存在模板组件的情况下，注册模板组件
        if (!f.reportComponent) return
        Reflect.set(
          fieldReportComMap,
          `${f.field.type}-report`,
          f.reportComponent
        )
      })
      return fieldReportComMap
    },
    // 自定义字段详情组件集合
    customFieldDetailMap() {
      const fieldDetailComMap = {}
      this.customFieldsMap.forEach(f => {
        // 自定义字段存在模板组件的情况下，注册模板组件
        if (!f.detailComponent) return
        Reflect.set(
          fieldDetailComMap,
          `${f.field.type}-detail`,
          f.detailComponent
        )
      })
      return fieldDetailComMap
    },
    // 所有字段的类型集合
    allOriginField() {
      return [
        ...allOriginField,
        ...this.customFieldsMap
      ]
    },
    // 所有字段的配置组件集合
    fieldConfigComMap() {
      return {
        ...fieldConfigComMap,
        ...this.customFieldConfigMap
      }
    },
    // 所有字段的模板组件集合
    fieldTempComMap() {
      return {
        ...fieldTempComMap,
        ...this.customFieldTempMap
      }
    },
    // 所有字段的上报组件集合
    fieldReportComMap() {
      return {
        ...fieldReportComMap,
        ...this.customFieldReportMap
      }
    },
    // 所有字段的详情组件集合
    fieldDetailComMap() {
      return {
        ...fieldDetailComMap,
        ...this.customFieldDetailMap
      }
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
