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

const switchList = [
  { name: '开', value: 'true' },
  { name: '关', value: 'false' }
]

export default {
  default: {
    options: []
  },
  divider: {
    options: []
  },
  title: {
    options: []
  },
  select: {
    options: [
      ...equalList,
      ...emptyStrList
    ]
  },
  radioGroup: {
    options: [
      ...equalList,
      ...emptyStrList
    ]
  },
  checkboxGroup: {
    options: [
      ...containsList,
      ...emptyArrList
    ]
  },
  mulSelect: {
    options: [
      ...containsList,
      ...emptyArrList
    ]
  },
  input: {
    options: [
      ...equalList,
      ...emptyStrList
    ]
  },
  textarea: {
    options: [
      ...equalList,
      ...emptyStrList
    ]
  },
  number: {
    options: [
      ...equalList,
      ...emptyStrList,
      ...compareList
    ]
  },
  license: {
    options: emptyStrList
  },
  file: {
    options: emptyArrList
  },
  date: {
    options: emptyStrList
  },
  dateRange: {
    options: emptyArrList
  },
  time: {
    options: emptyStrList
  },
  timeRange: {
    options: emptyArrList
  },
  switch: {
    options: switchList
  }
}
