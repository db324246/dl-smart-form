import Vue from 'vue'
import Store from '@pr/store'
import { Message } from 'element-ui'

// 智能表单实例对象
class CustomFormer {
  constructor() {
    this.reportData = null // 表单已上报的数据（编辑）
    this.fieldAttachedRule = null // 存储字段附属规则
    this.correlativeRuleMap = {} // 计算保存关联规则
    this.formWatcher = new Vue({ // 字段关联规则的观察者
      data() {
        return {
          fieldsMap: {}, // 所有的字段集合
          formModel: {}, // 字段与value的集合
          formModelRules: {}, // 字段的附属规则结合
          ruleShow: {},
          unwatcherMap: new Map() // 观察者集合
        }
      }
    })
  }
}

export default new Vue({
  data() {
    return {
      formerMap: new Map() // 智能表单实例对象集合
    }
  },
  methods: {
    // covered 默认覆盖，每次都会重新创建表单实例
    registerCustomFormer(formId) {
      this.formerMap.set(formId, new CustomFormer())
    },
    // 保存表单上报的数据
    setReportData(formId, reportData = {}) {
      try {
        const former = this.formerMap.get(formId)
        former.reportData = reportData
      } catch (error) {
        console.log(error)
        Message.error('表单实例不存在')
      }
    },
    // 存储字段附属规则
    setAttachedRule(formId, fieldAttachedRule = {}) {
      try {
        const former = this.formerMap.get(formId)
        former.fieldAttachedRule = fieldAttachedRule
      } catch (error) {
        console.log(error)
        Message.error('表单实例不存在')
      }
    },
    // 保存字段关联规则
    setCorrelativeRuleMap(formId, correlativeRuleMap = {}) {
      try {
        const former = this.formerMap.get(formId)
        former.correlativeRuleMap = correlativeRuleMap
      } catch (error) {
        console.log(error)
        Message.error('表单实例不存在')
      }
    },
    // 设置字段
    setField(formId, field) {
      try {
        this.saveField(formId, field)
        this.saveFieldRuleShow(formId, field)
        const former = this.formerMap.get(formId)
        const rules = former.correlativeRuleMap[field.name]
        this.setFieldRuler(formId, field, rules)
      } catch (error) {
        console.log(error)
        Message.error('表单实例不存在')
      }
    },
    // 设置字段的显示规则 默认显示
    saveFieldRuleShow(formId, field) {
      try {
        const former = this.formerMap.get(formId)
        const watcher = former.formWatcher
        this.$set(watcher.ruleShow, field.name, true)
      } catch (error) {
        console.log(error)
        Message.error('表单实例不存在')
      }
    },
    // 保存表单的字段集合到观察者
    saveField(formId, field) {
      try {
        const former = this.formerMap.get(formId)
        const watcher = former.formWatcher
        const fieldKey = field.key
        const fieldName = field.name
        const fieldRule = Store.fieldRuleMap
        if (Reflect.has(former.reportData, fieldKey)) {
          field.value = former.reportData[fieldKey]
        }
        const attachedRule = former.fieldAttachedRule[fieldName] || {}
        this.$set(field, 'attachedRule', attachedRule)
        let rule
        if (field.type === 'input') {
          rule = fieldRule[field.type](attachedRule.required, field.label, field.attrs.dataType, field.attrs.pattern)
        } else {
          rule = fieldRule[field.type](attachedRule.required, field.label)
        }
        this.$set(watcher.fieldsMap, fieldName, field)
        this.$set(watcher.formModelRules, fieldName, rule)
        this.$set(watcher.formModel, fieldName, field.value)
      } catch (error) {
        console.log(error)
        Message.error('表单实例不存在')
      }
    },
    // 添加字段校验规则观察者
    setFieldRuler(formId, field, rules) {
      try {
        const former = this.formerMap.get(formId)
        const watcher = former.formWatcher
        const unwatcher = watcher.$watch(
          `fieldsMap.${field.name}.value`,
          (newVal, oldVal) => {
            watcher.formModel[field.name] = newVal
            if (!rules || !rules.length) return
            const handlers = []
            rules.forEach(r => {
              const flag = r.handler(watcher.fieldsMap)
              if (flag) {
                r.T_message && Message.success({ message: r.T_message })
                handlers.push(
                  ...(r.T_handle || [])
                )
              } else {
                r.F_message && Message.error({ message: r.F_message })
                handlers.push(
                  ...(r.F_handle || [])
                )
              }
            })
            handlers.forEach(h => {
              const _field = watcher.fieldsMap[h.fieldName]
              switch (h.type) {
                case 'C_value':
                  // eslint-disable-next-line
                  console.info(`关联操作： ${h.fieldName} 修改值 ${h.value}`)
                  if (_field) {
                    _field.value = h.value
                  }
                  break;
                case 'C_options':
                  // eslint-disable-next-line
                  console.info(`关联操作： ${h.fieldName} 修改选项 ${JSON.stringify(h.options)}`)
                  if (_field) {
                    _field.options = h.options
                    if (Array.isArray(_field.value)) {
                      _field.value = _field.value.filter(key => {
                        const hasValue = h.options.some(opt => opt.key === key)
                        !hasValue && console.log(`关联操作：${key}选项丢失 重置选项值`)
                        return hasValue
                      })
                    } else {
                      const hasValue = h.options.some(opt => opt.key === _field.value)
                      !hasValue && console.log(`关联操作：${_field.value}选项丢失 重置选项值`)
                      _field.value = hasValue ? _field.value : ''
                    }
                  }
                  break;
                case 'C_show':
                  // eslint-disable-next-line
                  console.info(`关联操作： ${h.fieldName} 显示/隐藏 ${h.show}`)
                  watcher.$set(
                    watcher.ruleShow,
                    h.fieldName,
                    h.show === undefined ? true : h.show
                  )
                  break;
              }
            })
          },
          {
            immediate: true,
            deep: true
          }
        )
        watcher.unwatcherMap.set(field.name, unwatcher)
      } catch (error) {
        console.log(error)
        // Message.error('表单实例不存在')
      }
    }
  }
})
