// 图表配置对象
export const iconsConfig = {
}

// 基础控件
export const basicComponents = [
  // 单行文本
  {
    field: {
      type: 'input',
      label: '单行文本',
      value: '',
      editable: true,
      attrs: {
        placeholder: '占位符文字',
        maxlength: 100,
        dataType: 'string',
        pattern: ''
      }
    }
  },
  // 多行文本
  {
    field: {
      type: 'textarea',
      label: '多行文本',
      value: '',
      editable: true,
      attrs: {
        placeholder: '占位符文字',
        maxlength: 1000
      }
    }
  },
  // 数字输入
  {
    field: {
      type: 'number',
      label: '数字输入',
      value: 0,
      editable: true,
      attrs: {
        placeholder: '占位符文字',
        min: undefined,
        max: undefined,
        step: 1
      }
    }
  },
  // 单选框组
  {
    field: {
      type: 'radioGroup',
      label: '单选框组',
      value: '',
      editable: true,
      attrs: {
        bindDicts: false, // 是否绑定字典
        dictName: '',
        constantId: ''
      },
      options: [
        {
          value: '选项1',
          key: '1'
        },
        {
          value: '选项2',
          key: '2'
        },
        {
          value: '选项3',
          key: '3'
        }
      ]
    }
  },
  // 多选框组
  {
    field: {
      type: 'checkboxGroup',
      label: '多选框组',
      value: [],
      editable: true,
      attrs: {
        bindDicts: false, // 是否绑定字典
        dictName: '',
        constantId: ''
      },
      options: [
        {
          value: '选项1',
          key: '1'
        },
        {
          value: '选项2',
          key: '2'
        },
        {
          value: '选项3',
          key: '3'
        }
      ]
    }
  },
  // 下拉选择框
  {
    field: {
      type: 'select',
      label: '下拉选择框',
      value: '',
      editable: true,
      attrs: {
        placeholder: '请选择',
        bindDicts: false, // 是否绑定字典
        dictName: '',
        constantId: ''
      },
      options: [
        {
          value: '选项1',
          key: '1'
        },
        {
          value: '选项2',
          key: '2'
        },
        {
          value: '选项3',
          key: '3'
        }
      ]
    }
  },
  // 多选下拉框
  {
    field: {
      type: 'mulSelect',
      label: '多选下拉框',
      value: [],
      editable: true,
      attrs: {
        placeholder: '请选择',
        bindDicts: false, // 是否绑定字典
        dictName: '',
        constantId: ''
      },
      options: [
        {
          value: '选项1',
          key: '1'
        },
        {
          value: '选项2',
          key: '2'
        },
        {
          value: '选项3',
          key: '3'
        }
      ]
    }
  },
  // 开关
  {
    field: {
      type: 'switch',
      label: '开关',
      value: true,
      editable: true,
      attrs: {}
    }
  },
  // 日期选择器
  {
    field: {
      type: 'date',
      label: '日期选择器',
      value: '',
      placeholder: '请选择日期',
      editable: true,
      attrs: {
        placeholder: '请选择日期',
        format: 'yyyy-MM-dd',
        comType: 'date'
      }
    }
  },
  // 日期范围
  {
    field: {
      type: 'dateRange',
      label: '日期范围',
      value: [],
      editable: true,
      attrs: {
        startPlaceholder: '请选择开始日期',
        endPlaceholder: '请选择结束日期',
        format: 'yyyy-MM-dd',
        comType: 'daterange'
      }
    }
  },
  // 时间选择器
  {
    field: {
      type: 'time',
      label: '时间选择器',
      value: '', // 21:19
      editable: true,
      attrs: {
        placeholder: '请选择时间',
        format: 'HH:mm'
      }
    }
  },
  // 时间范围
  // {
  //   field: {
  //     type: 'timeRange',
  //     label: '时间范围',
  //     value: [], // element-UI 组件默认值不可以为空数组，所以该字段暂时废弃
  //     editable: true,
  //     attrs: {
  //       startPlaceholder: '请选择开始时间',
  //       endPlaceholder: '请选择结束时间',
  //       format: 'HH:mm'
  //     }
  //   }
  // },
  // 文件上传
  {
    field: {
      type: 'file',
      label: '文件上传',
      value: [],
      editable: true,
      attrs: {
        filetype: 'attachement',
        multiple: false,
        customType: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.psd', '.mp4', '.rmvb', '.mkv', '.wmv', '.flv', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.zip', '.rar', '.7z', '.mp3', '.avi', '.wps', '.asf', '.rm', '.mov', '.wav', '.ogg'],
        upMaxNum: 1000
      },
      filenum: 0 // 文件数量
    }
  }
  /**
   * 二期基础控件
   */
  // 评分
  // {
  //   field: {
  //     type: 'rate',
  //     label: '评分',
  //     options: {
  //       defaultValue: null,
  //       max: 5,
  //       allowHalf: false,
  //     }
  //   }
  // },
  // 颜色选择器
  // {
  //   field: {
  //     type: 'color',
  //     label: '颜色选择器',
  //     options: {
  //       defaultValue: '',
  //       showAlpha: false,
  //     }
  //   }
  // },
  // 滑块
  // {
  //   field: {
  //     type: 'slider',
  //     label: '滑块',
  //     options: {
  //       defaultValue: 0,
  //       min: 0,
  //       max: 100,
  //       step: 1,
  //       showInput: false,
  //       range: false,
  //       width: ''
  //     }
  //   }
  // }
]

// 高级控件
export const advanceComponents = [
  // 证照上传
  {
    field: {
      type: 'license',
      label: '证照上传',
      value: '',
      editable: true,
      attrs: {
        tips: '建议尺寸:80*80,1M大小以内 支持格式png、jpg、jpeg、bmp',
        btnText: '上传头像',
        defaultImg: 'https://cdnfile-10043692-1251008840.cos.ap-shanghai.myqcloud.com/web-cp/image/%E9%BB%98%E8%AE%A4%E5%9B%BE%E7%89%87.png'
      }
    }
  },
  // 选人控件
  {
    field: {
      type: 'personnel',
      label: '选人控件',
      value: [],
      editable: true,
      attrs: {
        isSingle: true,
        placeholder: '占位符文字',
        rangeType: 'release',
        target: 'teacher',
        customRange: []
      }
    }
  },
  // 明细子表
  {
    field: {
      type: 'subform',
      label: '明细子表',
      titleField: null,
      columnFields: []
    }
  }
  /**
   * 二期高级控件
   */
  // {
  //   type: 'imgupload',
  //   label: '图片',
  //   options: {
  //     defaultValue: [],
  //     size: {
  //       width: 100,
  //       height: 100,
  //     },
  //     width: '',
  //     tokenFunc: 'funcGetToken',
  //     token: '',
  //     domain: 'http://pfp81ptt6.bkt.clouddn.com/',
  //     length: 8,
  //     multiple: false,
  //     isQiniu: false,
  //     isDelete: false,
  //     min: 0,
  //     isEdit: false,
  //     action: 'https://jsonplaceholder.typicode.com/photos/'
  //   }
  // },
  // {
  //   type: 'editor',
  //   label: '编辑器',
  //   options: {
  //     defaultValue: '',
  //     width: ''
  //   }
  // },
  // {
  //   type: 'cascader',
  //   label: '级联选择器',
  //   options: {
  //     defaultValue: [],
  //     width: '',
  //     placeholder: '',
  //     clearable: false,
  //     remote: true,
  //     remoteOptions: [],
  //     props: {
  //       value: 'value',
  //       label: 'label',
  //       children: 'children'
  //     },
  //     remoteFunc: ''
  //   }
  // },
]

// 布局控件
export const layoutComponents = [
  // 标题段落
  {
    field: {
      type: 'title',
      label: '标题/段落',
      value: '标题/段落',
      editable: true,
      attrs: {
        fontSize: '16px',
        color: '#303133',
        fontWeight: 'normal'
      }
    }
  },
  // 分割线
  {
    field: {
      type: 'divider',
      label: '分割线'
    }
  }
]

// 复杂字典类型
export const complexField = [
  // 数据子项
  {
    field: {
      type: 'objectform',
      label: '数据子项',
      value: null,
      editable: true,
      attrs: {
        fieldCorrelativeRules: [],
        fieldAttachedRule: {}
      }
    }
  },
  // 重复上报
  {
    field: {
      type: 'arrayform',
      label: '重复上报',
      value: [],
      editable: true,
      attrs: {
        tableColumns: [],
        queryFields: [],
        fieldCorrelativeRules: [],
        fieldAttachedRule: {}
      }
    }
  }
]

const allOriginField = [
  ...basicComponents,
  ...advanceComponents,
  ...layoutComponents,
  ...complexField
]

export default allOriginField
