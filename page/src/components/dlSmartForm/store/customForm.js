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
  },
  actions: {
  }
}
