### ConfigComponent
字段的属性配置组件，用于表单创建时的属性配置使用

> 组件名称：`[fieldType]-config`

### Inject

| 名称 | 说明 | 类型 | 默认值 | 必传 |
| - | - | - | - | - |
| dictionaryArr | 字典项配置数组 | Array | [] | true |
| loadDictList | 自定义加载字典方法 | Function | () => Promise.resolve([]) | false |

### Props

| 名称 | 说明 | 类型 | 默认值 | 必传 |
| - | - | - | - | - |
| form | 字段配置表单对象 | Object | - | true |
| disabled | 字段是否可配置 | Boolean | false | false |

