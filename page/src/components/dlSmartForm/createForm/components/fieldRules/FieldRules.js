import Bus from '../../Bus'
import fieldJudgeMap from './fieldJudgeMap'
import JudgeValue from './components/JudgeValue.vue'
import ValidateValue from './components/ValidateValue.vue'
import { generateKey, deepClone, typeOf } from '../../utils'
// 复杂类型字段
import { complexComponents } from '../../../components/fields'
export default {
  name: 'field-rules',
  components: {
    JudgeValue,
    ValidateValue
  },
  inject: ['fieldsArr', 'getCorrelativeRules'],
  props: {
    // 表示使用props接受参数，不使用inject
    hasParams: {
      type: Boolean,
      default: false
    },
    modelFields: {
      type: Array,
      default: null
    },
    correlativeRules: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      complexFieldTypes: complexComponents.map(com => com.field.type),
      fieldJudgeMap,
      fieldCorrelativeRules: [],
      dialogVisible: false,
      connectorList: [
        { type: 'connector', label: '并', value: '&&' },
        { type: 'connector', label: '或者', value: '||' },
        { type: 'connector', label: '异或', value: '^' }
      ],
      fieldCorrelativeRulesOld: [] // 旧的数据--如果设置了关联关系。然后点击取消、或者关闭的弹窗。要用旧的数据覆盖
    }
  },
  computed: {
    fieldList() {
      return this.modelFields || this.fieldsArr.filter(f => f.isFormField)
    },
    ruleFiels() {
      return this.fieldList.filter(f => !this.complexFieldTypes.includes(f.type))
    }
  },
  methods: {
    // 弹出关联规则对话框
    showDialog() {
      this.fieldCorrelativeRulesOld = deepClone(
        this.correlativeRules || this.getCorrelativeRules()
      ) || []
      this.fieldCorrelativeRules = deepClone(
        this.correlativeRules || this.getCorrelativeRules()
      ) || []
      this.dialogVisible = true
    },
    // 添加关联规则
    addCorrelativeRules() {
      const defaultRulesItem = {
        key: generateKey('rule_'),
        conditions: [], // 条件
        T_handle: [], // 条件满足时执行
        F_handle: [] // 条件不满足时执行
      }
      this.fieldCorrelativeRules.push(deepClone(defaultRulesItem))
    },
    // 移除规则
    delCorrelativeRules(index) {
      this.fieldCorrelativeRules.splice(index, 1)
    },
    // 添加规则条件
    addCondition(rule, index) {
      const defaultJson = {
        key: generateKey('condition_'),
        type: 'condition', // 类型为条件
        fieldName: '', // 字段name
        filedType: '', // 字段类型
        valueType: undefined, // 值的类型
        judge: '', // 条件判断语句， 值的种类见下表 1.1
        value: '' // 用于条件判断的值， 条件判断语句为 “为空”、“不为空”时， 没有这个
      }
      rule.conditions.push(deepClone(defaultJson))
    },
    // 删除规则条件
    delCondition(rule, conditionIndex) {
      rule.conditions.splice(conditionIndex, 1)
    },
    // 规则监听字段选择
    conditionFieldChange(v, conditionItem) {
      const field = this.fieldList.find(field => field.name === v)
      conditionItem.filedType = field.type
      conditionItem.valueType = typeOf(field.value)
      if (field.options && Array.isArray(field.options)) { // 有option选项的
        this.$set(conditionItem, 'optionsList', field.options)
      } else {
        this.$delete(conditionItem, 'optionsList')
      }
      // 修改了条件字段类型，judge和value需要重置
      conditionItem.judge = ''
      conditionItem.value = ''
    },
    // 改变judge字段时。value值要重置
    conditionJudgeChange(v, conditionItem) {
      this.$set(conditionItem, 'value', '')
    },
    // 新建条件满足时操作
    addTHandle(rule, index) {
      const defaultJson = {
        key: generateKey('handle_'),
        type: '', // 类型为条件
        fieldName: '', // 字段name
        filedType: '', // 字段类型
        valueType: undefined, // 值的类型
        value: '',
        show: true,
        options: [] // 只有下拉的级联的时候会有这个字段
      }
      rule.T_handle.push(deepClone(defaultJson))
    },
    // 移除条件满足时操作
    delTHandle(rule, THandleIndex) {
      rule.T_handle.splice(THandleIndex, 1)
    },
    // 条件监听字段选择
    THandleFieldChange(v, THandleItem) {
      const field = this.fieldList.find(field => field.name === v)
      THandleItem.filedType = field.type
      THandleItem.valueType = typeOf(field.value)
      if (field.options && Array.isArray(field.options)) { // 有option选项的
        this.$set(THandleItem, 'optionsList', field.options)
      } else {
        this.$delete(THandleItem, 'optionsList')
        THandleItem.options = []
      }
    },
    // 新建条件不满足时操作
    addFHandle(rule, index) {
      const defaultJson = {
        key: generateKey('condition_'),
        type: '', // 类型为条件
        fieldName: '', // 字段name
        filedType: '', // 字段类型
        valueType: undefined, // 值的类型
        value: '',
        show: true, // 显示、隐藏
        options: [] // 只有下拉的级联的时候会有这个字段
      }
      rule.F_handle.push(deepClone(defaultJson))
    },
    // 删除条件不满足时操作
    delFHandle(rule, FHandleIndex) {
      rule.F_handle.splice(FHandleIndex, 1)
    },
    // 不满足条件 监听 字段选择
    FHandleFieldChange(v, FHandleItem) {
      const field = this.fieldList.find(field => field.name === v)
      FHandleItem.filedType = field.type
      FHandleItem.valueType = typeOf(field.value)
      if (field.options && Array.isArray(field.options)) { // 有option选项的
        this.$set(FHandleItem, 'optionsList', field.options)
      } else {
        this.$delete(FHandleItem, 'optionsList')
        FHandleItem.options = []
      }
    },
    // 取消操作
    cancle() {
      this.dialogVisible = false
      this.$nextTick(() => {
        if (this.hasParams) {
          this.$emit('update:correlativeRules', deepClone(this.fieldCorrelativeRulesOld))
        } else {
          Bus.$emit('update-correlativeRules', deepClone(this.fieldCorrelativeRulesOld))
        }
      })
    },
    // 保存操作
    submit() {
      const list = this.fieldCorrelativeRules
      for (let i = 0, len = list.length; i < len; i++) {
        const conditions = list[i].conditions
        const THandle = list[i].T_handle
        const FHandle = list[i].F_handle
        if (conditions.length === 0) {
          this.$alert(`请添加规则${i + 1}的规则条件！`)
          return
        }
        if (THandle.length + FHandle.length === 0) {
          this.$alert(`请添加规则${i + 1}的操作！`)
          return
        }
        for (const j in conditions) {
          if (!conditions[j].fieldName) {
            this.$alert(`请完整填写规则${i + 1}的字段！`)
            return
          }
          if (!conditions[j].judge) {
            this.$alert(`请完整填写规则${i + 1}的条件！`)
            return
          }
          // 为空和不为空时，不需要value值
          const judgeList = ['null', 'unnull']
          if (!conditions[j].value && !judgeList.includes(conditions[j].judge)) {
            this.$alert(`请完整填写规则${i + 1}的条件值！`)
            return
          }
          if (Number(j) !== 0 && !conditions[j].connector) {
            this.$alert(`请完整填写规则${i + 1}的条件连接符！`)
            return
          }
        }

        for (const T in THandle) {
          if (!THandle[T].fieldName) {
            this.$alert(`请完整填写规则${i + 1}的条件满足时的字段！`)
            return
          }

          if (!THandle[T].type) {
            this.$alert(`请完整填写规则${i + 1}的条件满足时的条件！`)
            return
          }

          if (!THandle[T].value && THandle[T].type === 'C_value') {
            this.$alert(`请完整填写规则${i + 1}的条件满足时的条件值！`)
            return
          }
        }

        for (const F in FHandle) {
          if (!FHandle[F].fieldName) {
            this.$alert(`请完整填写规则${i + 1}的条件不满足时的字段！`)
            return
          }

          if (!FHandle[F].type) {
            this.$alert(`请完整填写规则${i + 1}的条件不满足时的条件！`)
            return
          }

          if (!FHandle[F].value && THandle[F].type === 'C_value') {
            this.$alert(`请完整填写规则${i + 1}的条件不满足时的条件值！`)
            return
          }
        }
      }
      if (this.hasParams) {
        this.$emit('update:correlativeRules', deepClone(this.fieldCorrelativeRules))
      } else {
        Bus.$emit('update-correlativeRules', deepClone(this.fieldCorrelativeRules))
      }
      this.dialogVisible = false
    },
    // 判断条件字段是否是复杂类型的字段
    isComplexField(handler) {
      return !this.complexFieldTypes.includes(handler.filedType)
    }
  }
}
