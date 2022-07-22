## 上报表单组件
本节将介绍如何在项目中使用 SmartFormReport 组件

<img class="readme-img" src="../../../assets/report.jpg" preview="SmartFormReport" preview-text="上报表单组件" title="上报表单组件" alt="上报表单组件"/>

### 使用组件
``` html
<smart-form-report ref="reportForm" :form-data="formData" :report-data="reportData">
</smart-form-report>
```

### Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| formId | 表单的唯一键 | String | -- | Date.now().toString() |
| formData | 表单数据对象，`formData` 参数如下表 | Object | -- | -- |
| reportData | 上报过的表单数据，通常在编辑时使用 | Object | -- | {} |
| isEditable | 自定义字段是否可编辑，应返回一个布尔值 | Function | -- | -- |
| isFieldShow | 自定义字段是否展示，应返回一个布尔值 | Function | -- | -- |
| loadDictList | 获取字典项的操作函数，返回一个Promise，数据在 reslove 中传递，`Dict Data Object` 参数如下表 | Function | -- | null |
| unReportFields | 自定义字段是否需要上吧，应返回一个布尔值。如果字段无需上报，则获取表单填报数据时跳过该字段 | Function | -- | -- |

#### Dict Data Object Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| value | 字典项名称 | String | -- | -- |
| key | 字典项唯一键 | String | -- | -- |

### Methods
| 方法名 | 说明 | 参数 |
| -- | -- | -- |
| initReportForm | 初始化上报表单 | -- |
| getReportData | 获取当前表单的填报数据 | -- |

#### formData
| 参数 | 说明 | 类型 |
| -- | -- | -- |
| form | 表单字段集合 | Array |
| layout | 布局数据对象 | Object |
| attachedRule | 表单附属规则集合 | Object |