import Vue from 'vue'
import fieldRule from './fieldRuleConfig'

export default new Vue({
  data() {
    return {
      fieldsMap: {}, // 所有的字段集合
      formModel: {}, // 字段与value的集合
      formModelRules: {}, // 字段的附属规则结合
      ruleShow: {}, // 字段显示规则
      watcherMap: new Map(), // 观察者集合
      reportData: {},
      fieldAttachedRule: {},
      correlativeRuleMap: {}
    }
  },
  methods: {
    // 保存表单上报的数据
    setReportData(reportData = {}) {
      this.reportData = reportData
    },
    // 存储字段附属规则
    setAttachedRule(fieldAttachedRule = {}) {
      this.fieldAttachedRule = fieldAttachedRule
    },
    // 保存字段关联规则
    setCorrelativeRuleMap(correlativeRuleMap = {}) {
      this.correlativeRuleMap = correlativeRuleMap
    },
    // 设置字段
    setField(field) {
      this.saveField(field)
      this.saveFieldRuleShow(field)
      const rules = this.correlativeRuleMap[field.name]
      this.setFieldRuler(field, rules)
    },
    // 设置字段的显示规则 默认显示
    saveFieldRuleShow(field) {
      this.$set(this.ruleShow, field.name, true)
    },
    // 保存表单的字段集合到观察者
    saveField(field) {
      const fieldName = field.name
      if (Object.keys(this.reportData).includes(fieldName)) {
        field.value = this.reportData[fieldName]
      }
      const attachedRule = this.fieldAttachedRule[fieldName] || {}
      this.$set(field, 'attachedRule', attachedRule)
      let rule
      if (field.type === 'input') {
        rule = fieldRule[field.type](attachedRule.required, field.label, field.attrs.dataType, field.attrs.pattern)
      } else {
        rule = fieldRule[field.type](attachedRule.required, field.label)
      }
      this.$set(this.formModel, fieldName, field.value)
      this.$set(this.fieldsMap, fieldName, field)
      this.$set(this.formModelRules, fieldName, rule)
    },
    // 添加字段校验规则观察者
    setFieldRuler(field, rules) {
      const unwatcher = this.$watch(
        `fieldsMap.${field.name}.value`,
        (newVal, oldVal) => {
          this.formModel[field.name] = newVal
          if (!rules || !rules.length) return
          const handlers = []
          rules.forEach(r => {
            if (r.handler(this.fieldsMap)) {
              handlers.push(
                ...(r.T_handle || [])
              )
            } else {
              handlers.push(
                ...(r.F_handle || [])
              )
            }
          })
          handlers.forEach(h => {
            switch (h.type) {
              case 'C_value':
                console.log(`关联操作： ${h.fieldName} 修改值 ${h.value}`)
                this.fieldsMap[h.fieldName].value = h.value
                break;
              case 'C_options':
                console.log(`关联操作： ${h.fieldName} 修改选项 ${JSON.stringify(h.options)}`)
                this.fieldsMap[h.fieldName].options = h.options
                this.fieldsMap[h.fieldName].value = ''
                break;
              case 'C_show':
                console.log(`关联操作： ${h.fieldName} 显示/隐藏 ${h.show}`)
                this.$set(
                  this.ruleShow,
                  h.fieldName,
                  h.show === undefined ? true : h.show
                )
                break;
            }
          })
        },
        {
          deep: true
        }
      )
      this.watcherMap.set(field.name, unwatcher)
    }
  }
})
