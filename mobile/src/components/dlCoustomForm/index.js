import CustomFormShow from './showForm'
import CustomFormReport from './reportForm'
import ArrayformField from './reportForm/components/ArrayformField'
import ArrayformFieldShow from './showForm/components/ArrayformField'

// 安装智能表单（展示）
export const showerInstaller = {
  install(Vue) {
    Vue.component(CustomFormShow.name, CustomFormShow)
    Vue.component('ArrayformFieldShow', ArrayformFieldShow)
    Vue.component('ArrayformFieldEdit', ArrayformField)
  }
}

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
    showerInstaller.install(Vue)
    reporterInstaller.install(Vue)
  }
}
