export const ElementMapping = {
  input: {
    component: 'el-input',
    props: {
      type: 'text'
    }
  },
  textarea: {
    component: 'el-input',
    props: {
      type: 'text'
    }
  },
  number: {
    component: 'el-input-number',
    props: {
      'controls-position': 'right'
    }
  },
  date: {
    component: 'el-date-picker',
    props: {
      align: 'center',
      type: 'date'
    }
  },
  'dateRange': {
    component: 'el-date-picker',
    props: {
      type: 'daterange',
      'range-separator': '至'
    }
  },
  time: {
    component: 'el-time-picker',
    props: {
    }
  },
  'timeRange': {
    component: 'el-time-picker',
    props: {
      'is-range': true,
      'range-separator': '至'
    }
  },
  switch: {
    component: 'el-switch',
    props: {
    }
  },
  'radioGroup': {
    component: 'x-el-select',
    props: {
    }
  },
  'checkboxGroup': {
    component: 'x-el-select',
    props: {
    }
  },
  'select': {
    component: 'x-el-select',
    props: {
    }
  },
  'mulSelect': {
    component: 'x-el-select',
    props: {
    }
  }
}

// 转化
export default function computeField(config) {
  // 返回结构体
  const item = { ...config };

  // 表单控件的类型
  const type = item.type || 'input';

  // 对应到组件映射表
  const def = ElementMapping[type];

  if (!item.attrs) item.attrs = {}

  item.tag = def.component;
  item.props = Object.assign({
    options: item.options
  }, def.props, item.attrs)

  // 增加el-date 的值格式化属性，规避值类型不一致的问题
  if (type === 'date' || type === 'dateRange') {
    item.props['value-format'] = item.attrs.format
    if (['yyyy-MM-dd HH:mm', 'yyyy-MM-dd HH:mm:ss'].includes(item.attrs.format)) {
      if (type === 'date') item.props.type = 'datetime'
      else item.props.type = 'datetimerange'
    }
    if (item.attrs.format === 'yyyy-MM') {
      if (type === 'date') item.props.type = 'month'
      else item.props.type = 'monthrange'
    }
    if (item.attrs.format === 'yyyy') {
      if (type === 'date') item.props.type = 'year'
      else item.props.type = 'monthrange'
    }
  }
  if (type === 'time' || type === 'timeRange') {
    item.props['value-format'] = item.attrs.format
    item.props['picker-options'] = {}
    item.props['picker-options'].format = item.attrs.format
  }
  // 多选要转为单选 要不后台无法查询
  if (type === 'mulSelect' || type === 'checkboxGroup') {
    item.value = ''
  }
  if (type === 'radioGroup' || type === 'switch' || type === 'radioGroup' || type === 'mulSelect' || type === 'checkboxGroup') {
    item.type = 'select'
  }
  return item;
}
