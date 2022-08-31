# dl-smart-form

`dl-smart-form`是基于 vue 与 element-UI 设计的自定义表单。[文档查看](http://daiter.cn/dlSmartForm/home)

### npm 安装
推荐使用 npm 的方式安装，它能更好地和 `webpack` 打包工具配合使用。

```
npm i dl-smart-form -S
```

### 完整引入
在 main.js 中写入以下内容：
``` javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

import {
  createrInstaller,
  reporterInstaller,
  showerInstaller
} from 'dl-smart-form';

Vue.use(Element)
Vue.use(createrInstaller)
Vue.use(reporterInstaller)
Vue.use(showerInstaller)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```


### verison
| 版本 | 描述 | 日期 |
| - | - | - |
| 0.1.4 | 增加字段 `Key` 属性配置功能、优化移动端布局数据、新增 `空白行` 布局字段 | 2022.08.31 |
| 0.1.2 | 初始版本 | 2022.08.26 |
