import store from './store'
// 右键菜单组件
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
// 注册 element-UI
// import registerElements from './elements'
import RowCom from './createForm/layout/FlexTableLayout/RowCom'
import ColCom from './createForm/layout/FlexTableLayout/ColCom'
import CustomFormCreate from './createForm'
import CustomFormShow from './showForm'
import CustomFormReport from './reportForm'

// 安装智能表单（创建）
export const createrInstaller = {
  install(Vue) {
    Vue.use(contentmenu)
    // registerElements(Vue)
    Vue.component(CustomFormCreate.name, CustomFormCreate)
    Vue.component(RowCom.name, RowCom)
    Vue.component(ColCom.name, ColCom)
  }
}

// 安装智能表单（展示）
export const showerInstaller = {
  install(Vue) {
    // registerElements(Vue)
    Vue.component(CustomFormShow.name, CustomFormShow)
  }
}

// 安装智能表单（上报）
export const reporterInstaller = {
  install(Vue) {
    // registerElements(Vue)
    Vue.component(CustomFormReport.name, CustomFormReport)
    // Vue.component(ArrayformField.name, ArrayformField)
  }
}

// 全部安装
const dlSmartForm = {
  install(Vue) {
    // registerElements(Vue)
    createrInstaller.install(Vue)
    showerInstaller.install(Vue)
    reporterInstaller.install(Vue)
  },
  /**
   * 注册自定义字段配置
   *{
      groupName: '',
      groupKey
      components: []
    }
    */
  registerFields: store.registerFields.bind(store),
  createrInstaller,
  showerInstaller,
  reporterInstaller
}

store.registerArrayForm()

window.SmartForm = dlSmartForm
window.dlSmartForm = dlSmartForm

export default dlSmartForm
