import store from './store'
import CustomFormCreate from './createForm'
// 右键菜单组件
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import RowCom from './createForm/layout/FlexTableLayout/RowCom'
import ColCom from './createForm/layout/FlexTableLayout/ColCom'
// import CustomFormShow from './showForm'
import CustomFormReport from './reportForm'
import ArrayformField from './reportForm/components/ArrayformField'

// 安装智能表单（创建）
export const createrInstaller = {
  install(Vue) {
    Vue.use(contentmenu)
    Vue.component(CustomFormCreate.name, CustomFormCreate)
    Vue.component(RowCom.name, RowCom)
    Vue.component(ColCom.name, ColCom)
  },
  /**
   * 注册自定义字段配置
   *{
      groupName: '',
      groupKey
      fields: []
    }
    */
  registerFields(fields = []) {
    fields.forEach(f => {
      if (store.customFields.some(i => i.groupName === f.groupName)) return
      store.customFields.push(f)
    })
  }
}

// // 安装智能表单（展示）
// export const showerInstaller = {
//   install(Vue) {
//     Vue.component(CustomFormShow.name, CustomFormShow)
//   }
// }

// 安装智能表单（上报）
export const reporterInstaller = {
  install(Vue) {
    Vue.component(CustomFormReport.name, CustomFormReport)
    Vue.component(ArrayformField.name, ArrayformField)
  }
}

// 全部安装
export default {
  install(Vue) {
    createrInstaller.install(Vue)
    // showerInstaller.install(Vue)
    reporterInstaller.install(Vue)
  }
}
