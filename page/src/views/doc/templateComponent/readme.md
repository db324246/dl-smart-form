### TemplateComponent
字段的模版组件，用于表单创建时展示的模板使用

> 组件名称：`[fieldType]-template`

### Props

| 名称 | 说明 | 类型 | 默认值 | 必传 |
| - | - | - | - | - |
| fieldObj | 字段对象 | Object | - | true |
| templateStyle | 字段模版控件样式 | Object | {} | true |
| showLabel | 字段是否展示字段标签 | Boolean | - | true |
| labelWidth | 字段标签的展示宽度 | String | 100px | true |
| labelPosition | 字段标签的展示位置 | String | right | true |

### Inject

| 名称 | 说明 | 类型 |
| - | - | - |
| fieldsArr | 创建表单的字段集合 | Array |
| customAttrs | 自定义的组件属性 | Object |
| scopedSlotsMap | 自定义具名插槽的函数集合 | Function(slotName, data) |
| eventBus | 创建表单的事件中心，**详细见下表** | Object |

### EventBus
#### EventBus Props

| 名称 | 说明 | 类型 |
| - | - | - |
| nodesMap | 所有的布局节点集合 | Object |
| draggingNode | 被拖拽的节点 | Object |
| focusNodeKey | 当前聚焦的节点 | String |

#### EventBus Methods

| 名称 | 说明 | 参数 |
| - | - | - |
| setDraggingNode | 保存拖拽中节点 | node |
| setFocusNodeKey | 设置正在聚焦的节点 | nodeKey |

#### EventBus Events

| 名称 | 说明 | 参数 |
| - | - | - |
| add-field | 添加字段的回调事件 | { field, excludeMobile } |
| delete-field | 删除字段的回调事件 | { field, excludeMobile } |
