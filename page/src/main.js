import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ReadMe from '@/components/ReadMe'
import 'marked-essay-loader/styles/marked-style.scss'
import Uploader from './components/Uploader'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import SmartForm, {
  createrInstaller,
  reporterInstaller,
  showerInstaller
} from '@pr/index.js'

// import SmartForm, {
//   createrInstaller,
//   reporterInstaller,
//   showerInstaller
// } from 'dl-smart-form'

Vue.use(Element);
Vue.component('ReadMe', ReadMe)

SmartForm.registerFields([{
  groupName: '我的字段',
  groupKey: 'myFields',
  components: [
    Uploader,
    {
      field: {
        name: 'input_field_1656407314156810',
        type: 'input',
        label: '手机号',
        value: '',
        configurable: false,
        isFormField: true,
        attrs: {
          placeholder: '请输入手机号',
          maxlength: 11,
          dataType: 'phone',
          pattern: ''
        }
      }
    }
  ]
}])

Vue.use(createrInstaller)
Vue.use(reporterInstaller)
Vue.use(showerInstaller)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
