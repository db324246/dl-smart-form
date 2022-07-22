### DetailComponent
字段的详情展示组件，用于表单详情使用

> 组件名称：`[fieldType]-detail`

### Inject

| 名称 | 说明 | 类型 | 默认值 | 必传 |
| - | - | - | - | - |
| loadDictList | 自定义加载字典方法 | Function | () => Promise.resolve([]) | false |

### Props

| 名称 | 说明 | 类型 | 默认值 | 必传 |
| - | - | - | - | - |
| fieldObj | 字段对象 | Object | - | true |
| detailStyle | 字段详情控件样式 | Object | {} | true |
| showLabel | 字段是否展示字段标签 | Boolean | - | true |
| labelWidth | 字段标签的展示宽度 | String | 100px | true |
| labelPosition | 字段标签的展示位置 | String | right | true |