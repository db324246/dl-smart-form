### Field 字段

字段是一份表单内的最小粒度。

``` javascript
// field 的数据形式
{
  "name": "teacher_field_159428032900017261", // 字段的唯一值
  "type": "input", // 字段类型
  "label": "单行文本", // 字段名称
  "value": "默认值", // 字段的默认值
  "configurable": true, // 属性是否可配置
  "isFormField": true, // 是否是表单字段
  "attrs": { // 字段的自定义配置属性
    "placeholder": "占位符文字",
    "maxlength": 101,
    "dataType": "phone",
    "pattern": ""
  }
}
```

### 现有的字段类型
| 名称 | 描述 | 类型 |
| - | - | - |
| input | 文本输入字段 | base（基础字段） |
| Number | 数字输入字段 | base（基础字段） |
| textarea | 文本域输入字段 | base（基础字段） |
| date | 日期输入字段 | base（基础字段） |
| time | 时间输入字段 | base（基础字段） |
| dateRange | 日期范围输入字段 | base（基础字段） |
| select | 下拉单项选择字段 | base（基础字段） |
| mulSelect | 下拉多项选择字段 | base（基础字段） |
| radioGroup | 单选框组字段 | base（基础字段） |
| checkboxGroup | 多选框组字段 | base（基础字段） |
| switchCom | 开关字段 | base（基础字段） |
| title | 标题字段 | layout（布局字段） |
| divider | 分割线字段 | layout（布局字段） |


### AttachedRule 字段的附属规则计算

attachedRule 方法接收 required 和 label 两个参数。
+ required：表单附属规则中自定义配置的是否必填属性
+ label：字段自定义配置的字段名称填属性

应返回一个 Rule 对象或数组，校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

<br />

### CorrelativeRule 字段的关联规则计算
CorrelativeRule 主要用于动态计算返回字段的判断条件
CorrelativeRule 方法接收 value, judge 和 fieldName 三个参数。
+ value: 判断条件字段的值
+ judge: 判断条件
+ fieldName：字段名称（唯一值）

应返回一个字符串，表示字段关联的判断条件


#### Judge
| 名称 | 说明 | 通用类型 |
| - | - | - |
| == | 等于 | String, Boolean, Number |
| != | 不等于 | String, Boolean, Number |
| contains | 包含 | Array |
| uncontains | 不包含 | Array |
| nullStr | 为空 | String, Number |
| unnullStr | 不为空 | String, Number |
| nullArr | 数组为空 | Array |
| unnullArr | 数组不为空 | Array |
| > | 大于 | Number |
| < | 小于 | Number |
| >= | 大于等于 | Number |
| <= | 小于等于 | Number |
