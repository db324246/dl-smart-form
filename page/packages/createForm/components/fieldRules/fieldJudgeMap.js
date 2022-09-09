const equalList = [
  { name: '等于', value: '==' },
  { name: '不等于', value: '!=' }
]

const containsList = [
  { name: '包含', value: 'contains' },
  { name: '不包含', value: 'uncontains' }
]

const emptyStrList = [
  { name: '为空', value: 'nullStr' },
  { name: '不为空', value: 'unnullStr' }
]

const emptyArrList = [
  { name: '为空', value: 'nullArr' },
  { name: '不为空', value: 'unnullArr' }
]

const compareList = [
  { name: '大于', value: '>' },
  { name: '小于', value: '<' },
  { name: '大于等于', value: '>=' },
  { name: '小于等于', value: '<=' }
]

export const emptyTypeList = [
  ...emptyStrList,
  ...emptyArrList
]

const fieldJudgeMap = new Map()
fieldJudgeMap.set('array', [
  ...containsList,
  ...emptyArrList
])
fieldJudgeMap.set('object', [])
fieldJudgeMap.set('string', [
  ...equalList,
  ...compareList,
  ...emptyStrList
])
fieldJudgeMap.set('null', [])
fieldJudgeMap.set('undefined', [])
fieldJudgeMap.set('boolean', [
  ...equalList
])
fieldJudgeMap.set('number', [
  ...equalList,
  ...compareList,
  ...emptyStrList
])

export default fieldJudgeMap
