export default {
  templateComponent: () => import('./template'), // 模板组件
  configComponent: () => import('./config'), // 配置组件
  field: {
    type: 'mulSelect',
    label: '多选下拉框',
    value: [],
    editable: true,
    insideForm: true, // 控件是否展示再表单组件内
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
}
