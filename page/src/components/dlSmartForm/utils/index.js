// import Bus from '../createForm/Bus'

// 比较新值和旧值是否有改动 返回更新后的值
export const diffValue = (newVal, oldVal, deep = false) => {
  const recursionDiffer = (newVal, oldVal, level) => {
    // if (!deep && level > 1) return deepClone(newVal)
    level++
    const newType = typeOf(newVal)
    const oldType = typeOf(oldVal)
    if (newType !== oldType) return deepClone(newVal)

    let differ
    switch (newType) {
      case 'object':
        differ = {}
        for (const key in newVal) {
          const differvalue = recursionDiffer(newVal[key], oldVal[key], level)
          if (differvalue !== '__empty__value__') {
            differ[key] = differvalue
          }
        }
        return Object.keys(differ).length
          ? differ
          : '__empty__value__'
      case 'array':
        differ = []
        newVal.forEach((val, index) => {
          const differvalue = recursionDiffer(val, oldVal[index], level)
          if (differvalue !== '__empty__value__') {
            differ.push(differvalue)
          }
        })
        if (!deep && level === 2) {
          return differ.length
            ? deepClone(newVal)
            : '__empty__value__'
        } else {
          return differ.length
            ? differ
            : '__empty__value__'
        }
        // return differ.length
        //   ? differ
        //   : '__empty__value__'
      default:
        return newVal === oldVal
          ? '__empty__value__'
          : newVal
    }
  }

  const differ = recursionDiffer(newVal, oldVal, 0)
  if (differ !== '__empty__value__') return differ

  const type = typeOf(newVal)
  switch (type) {
    case 'object':
      return {}
    case 'array':
      return []
    default:
      return
  }
}

const personalTargetConfig = {
  teacher: {
    activeTab: 'org', // 首先展示的tab， 'org'组织人员，'unit'单位/学校，'group'常用组
    target: 'user', // 最终指向，'user'代表用户, 'unit'代表学校、部门, 'all' 所有
    org: { // 组织人员配置
      show: true // 是否展示
    },
    unit: { // 单位/学校 配置
      show: false, // 是否展示
      isShowDepart: false, // 是否展示部门
      isOnlyChoseDepart: false // 是否只选部门
    },
    group: { // 常用组配置
      show: false // 是否展示
    }
  },
  unit: {
    activeTab: 'unit', // 首先展示的tab， 'org'组织人员，'unit'单位/学校，'group'常用组
    target: 'unit', // 最终指向，'user'代表用户, 'unit'代表学校、部门, 'all' 所有
    org: { // 组织人员配置
      show: false // 是否展示
    },
    unit: { // 单位/学校 配置
      show: true, // 是否展示
      isShowDepart: false, // 是否展示部门
      isOnlyChoseDepart: false // 是否只选部门
    },
    group: { // 常用组配置
      show: false // 是否展示
    }
  },
  student: {
    activeTab: 'classStudent', // 首先展示的tab， 'org'组织人员，'unit'单位/学校，'group'常用组
    target: 'user', // 最终指向，'user'代表用户, 'unit'代表学校、部门, 'all' 所有
    org: { // 组织人员配置
      show: false // 是否展示
    },
    unit: { // 单位/学校 配置
      show: false, // 是否展示
      isShowDepart: false, // 是否展示部门
      isOnlyChoseDepart: false // 是否只选部门
    },
    group: { // 常用组配置
      show: false // 是否展示
    },
    classStudent: { // 班级、学生配置
      show: true, // 是否展示
      isOnlyChoseClass: false // 是否只选班级
    }
  }
}

export const generatePersonalConfig = config => {
  const {
    isSingle,
    placeholder,
    rangeType,
    target } = config

  return {
    placeholder, // 按钮或点击input的提示性文字
    dialogTitle: placeholder, // 弹出框标题
    rangeType, // 范围类型，发布范围 'release' 还是 管理范围 'manage'
    isSingle, // 是否单选
    ...personalTargetConfig[target]
  }
}

// ----------------------------------------
// 深度克隆
export function deepClone(source) {
  if (!source || typeof source !== 'object') {
    return source
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 返回变量的数据类型
export function typeOf(data) {
  return Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase()
}
