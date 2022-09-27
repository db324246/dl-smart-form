import Vue from 'vue'
import subform from '@pr/components/fields/subform'
import { basicComponents, layoutComponents, advanceComponents, complexComponents } from '@pr/components/fields'

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
    // 所有字段的类型集合
    allOriginField() {
      return [
        ...basicComponents,
        ...layoutComponents,
        ...complexComponents,
        ...this.customFieldsMap
      ]
    },
    allOriginFieldsMap() {
      const allOriginFieldsMap = {}
      this.allOriginField.forEach(item => {
        if (!allOriginFieldsMap[item.field.type]) {
          allOriginFieldsMap[item.field.type] = item.field
        }
      })
      return allOriginFieldsMap
    },
    // 所有字段的表单必填校验规则
    fieldRuleMap() {
      const fieldRuleMap = {}
      this.allOriginField.forEach(f => {
        // 自定义字段存在模板组件的情况下，注册模板组件
        if (!f.attachedRule) return
        Reflect.set(
          fieldRuleMap,
          f.field.type,
          f.attachedRule
        )
      })
      return fieldRuleMap
    },
    // 所有字段的管理校验规则
    fieldCorrectRuleMap() {
      const fieldCorrectRuleMap = {}
      this.allOriginField.forEach(f => {
        // 自定义字段存在模板组件的情况下，注册模板组件
        if (!f.correlativeRule) return
        Reflect.set(
          fieldCorrectRuleMap,
          f.field.type,
          f.correlativeRule
        )
      })
      return fieldCorrectRuleMap
    }
  },
  methods: {
    registerArrayForm() {
      complexComponents.push(subform)
      advanceComponents.push(subform)
      Vue.component(subform.configComponent.name, subform.configComponent)
      Vue.component(subform.detailComponent.name, subform.detailComponent)
      Vue.component(subform.reportComponent.name, subform.reportComponent)
      Vue.component(subform.templateComponent.name, subform.templateComponent)
    },
    registerFields(fields = []) {
      fields.forEach(f => {
        if (!f.groupKey) return
        const index = this.customFields.findIndex(i => i.groupKey === f.groupKey)
        if (index >= 0) {
          this.customFields.splice(index, 1, f)
        } else {
          this.customFields.push(f)
        }
        this.$emit('fields-register', f)
      })
    }
  }
})
