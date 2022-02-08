/**
 * 智能表单仓库
 */
import Vue from 'vue'
import { deepClone } from '@/utils'
import fieldRule from '@/components/dlCoustomForm/reportForm/fieldRuleConfig'

// 智能表单实例对象
class CustomFormer {
  constructor() {
    this.nodesMap = new Map() // 存储所有节点
    this.reportData = null
    this.fieldAttachedRule = null
    this.watcher = new Vue({ // 字段关联规则的观察者
      data() {
        return {
          fieldsMap: {}, // 所有的字段集合
          formModel: {}, // 字段与value的集合
          formModelRules: {}, // 字段的附属规则结合
          ruleShow: {}
        }
      }
    })
    this.offWatcher = []
    this.correlativeRuleMap = {}
  }
}

export default {
  namespaced: true,
  state: {
    formerMap: new Map(), // 智能表单实例对象集合
  },
  getters: {
    getNodesMap(state) {
      return formId => {
        const former = state.formerMap.get(formId)
        return former.nodesMap
      }
    },
    getFields(state) {
      return formId => {
        const former = state.formerMap.get(formId)
        return former.watcher.fieldsMap
      }
    },
    getRuleShow(state) {
      return formId => {
        const former = state.formerMap.get(formId)
        return former.watcher.ruleShow
      }
    },
    fieldAttachedRule(state) {
      return formId => {
        const former = state.formerMap.get(formId)
        return former.fieldAttachedRule
      }
    },
    formModel(state) {
      return formId => {
        const former = state.formerMap.get(formId)
        return former.watcher.formModel
      }
    },
    formModelRules(state) {
      return formId => {
        const former = state.formerMap.get(formId)
        return former.watcher.formModelRules
      }
    }
  },
  mutations: {
    // 存储智能表单实例对象
    saveFormer(state, { formId, former }) {
      state.formerMap.set(formId, former)
    },
    // 保存字段关联规则
    setCorrelativeRuleMap(state, { formId, correlativeRuleMap }) {
      const former = state.formerMap.get(formId)
      former.correlativeRuleMap = correlativeRuleMap
    },
    // 保存表单上报的数据
    setReportData(state, { formId, reportData }) {
      try {
        const former = state.formerMap.get(formId)
        former.reportData = reportData || {}
      } catch (error) {
        console.log(error)
      }
    },
    // 存储字段附属规则
    setAttachedRule(state, { formId, fieldAttachedRule }) {
      const former = state.formerMap.get(formId)
      former.fieldAttachedRule = fieldAttachedRule || {}
    },
    // 保存表单的字段集合到观察者
    saveField(state, { formId, field }) {
      const former = state.formerMap.get(formId)
      const watcher = former.watcher
      const fieldName = field.name
      if (Object.keys(former.reportData).includes(fieldName)) {
        field.value = former.reportData[fieldName]
      }
      const attachedRule = former.fieldAttachedRule[fieldName] || {}
      watcher.$set(field, 'attachedRule', attachedRule)
      let rule
      if (field.type === 'input') {
        rule = fieldRule[field.type](attachedRule.required, field.label, field.attrs.dataType, field.attrs.pattern)
      } else {
        rule = fieldRule[field.type](attachedRule.required, field.label)
      }
      watcher.$set(watcher.formModel, fieldName, field.value)
      watcher.$set(watcher.fieldsMap, fieldName, field)
      watcher.$set(watcher.formModelRules, fieldName, rule)
    },
    // 设置字段的显示规则 默认显示
    saveFieldRuleShow(state, { formId, field }) {
      const watcher = state.formerMap.get(formId).watcher
      watcher.$set(watcher.ruleShow, field.name, true)
    },
    // 观察者添加观察规则
    setWatcher(state, { formId, rules, field }) {
      const former = state.formerMap.get(formId)
      const watcher = former.watcher
      const unwatcher = watcher.$watch(
        `fieldsMap.${field.name}.value`,
        (newVal, oldVal) => {
          // if (compareEqual(newVal, oldVal)) return
          watcher.formModel[field.name] = newVal
          if (!rules || !rules.length) return
          const handlers = []
          rules.forEach(r => {
            if (r.handler(watcher.fieldsMap)) {
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
                watcher.fieldsMap[h.fieldName].value = h.value
                break;
              case 'C_options':
                console.log(`关联操作： ${h.fieldName} 修改选项
${JSON.stringify(h.options)}`)
                watcher.fieldsMap[h.fieldName].options = h.options
                watcher.fieldsMap[h.fieldName].value = ''
                break;
              case 'C_show':
                console.log(`关联操作： ${h.fieldName} 显示/隐藏 ${h.show}`)
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
          deep: true
        }
      )
      former.offWatcher.push(unwatcher)
    }
  },
  actions: {
    // covered 默认覆盖，每次都会重新创建表单实例
    registerCoutomFormer({ commit, state }, { formId, covered }) {
      if (state.formerMap.has(formId) && !covered) return
      commit('saveFormer', { formId, former: new CustomFormer() })
    },
    setField({ commit, state }, { formId, field }) {
      try {
        commit('saveField', { formId, field })
        commit('saveFieldRuleShow', { formId, field })
        const former = state.formerMap.get(formId)
        const rules = former.correlativeRuleMap[field.name]
        commit('setWatcher', { formId, rules, field })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
