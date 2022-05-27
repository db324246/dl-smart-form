import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ArrayForm from './arrayForm.json'
// import dlSmartForm from '@/components/dlSmartForm'
import {
  createrInstaller,
  reporterInstaller,
  showerInstaller
} from '@/components/dlSmartForm'

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);

createrInstaller.registerFields([{
  groupName: '我的字段',
  groupKey: 'myFields',
  components: [
    {
      field: ArrayForm
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
