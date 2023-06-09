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
| blankLine | 空白行字段 | layout（布局字段） |
| subform | 明细字表 | high（高阶字段） |


### AttachedRule 字段的附属规则计算

attachedRule 方法接收 required 和 label 两个参数。
+ required：表单附属规则中自定义配置的是否必填属性
+ label：字段自定义配置的字段名称填属性

应返回一个 Rule 对象或数组，校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

<br />

### CorrelativeRule 字段的关联规则计算
+ CorrelativeRule 主要用于动态计算返回字段的判断条件
+ CorrelativeRule 方法接收 [condition 条件](/doc/correlativeRule#ConditionObj) 对象一个参数。
应返回一个字符串，表示字段关联的判断条件

``` javascript
// 内置 input 字段的关联规则
export default {
  // ...
  correlativeRule(condition) { // 字段的关联规则
    const { value, fieldName, judge, compareFieldName, isCompareField } = condition
    const fieldVal = `form['${fieldName}'].value`
    const judeValue = isCompareField
      ? `form['${compareFieldName}'].value`
      : `'${value}'`
    let str = ''
    switch (judge) {
      case '==':
      case '!=':
        str += `${fieldVal} ${judge} ${judeValue}`
        break;
      case 'nullStr':
        str += `!${fieldVal}`
        break;
      case 'unnullStr':
        str += `${fieldVal}`
        break;
      default:
        str += 'true'
        break;
    }
    return str
  }
  // ...
}
```