import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import dlSmartForm from '@/components/dlSmartForm'
import {
  createrInstaller,
  reporterInstaller
} from '@/components/dlSmartForm'

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);

Vue.use(createrInstaller)
Vue.use(reporterInstaller)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
