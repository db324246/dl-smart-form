### Form
一个完整的自定义表单应该是由 `字段（Field）`、`布局数据（Layout）`、`表单附属规则（AttachedRule）`三部分组成。<br />
字段是表单的最小粒度，[Field 详情](/doc/field)。

### Layout 布局数据

布局数据是用来表示表单展现形式的数据。<br />
在创建表单时，可以通过拖拽字段来自定义表单的内容。也可以在表单内右击菜单创建行与列来布置表单。

```
// layout
{
  layoutType: 'default',
  pcLayout: {
    rowsData: [
      // ... 自定义布局模式下的结构数据
    ],
    layoutConfig: {
      // ... 自定义布局模式下的表单样式的配置参数
    }
  },
  mobileLayout：[
    // ... 移动端经过排序的字段name集合
  ]
}
```

### AttachedRule 表单附属规则
表单附属规则有 `FieldAttachedRule` 和 `FieldCorrelativeRules`

+ `FieldAttachedRule`（字段在表单中的附属规则集合）用于描述字段是否必填、是否展示名称、宽度等属性
+ `FieldCorrelativeRules`（字段在表单中的关联规则集合）用于描述字段在业务需要的情况下与相关联的字段进行动态展示、修改值等操作