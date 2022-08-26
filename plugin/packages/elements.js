import {
  Button,
  Collapse,
  CollapseItem,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Dialog,
  InputNumber,
  Input,
  Tooltip,
  Checkbox,
  Select,
  Option,
  DatePicker,
  TimePicker,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Loading,
  MessageBox,
  Message,
  Divider,
  Switch,
  Table,
  TableColumn
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

const components = [
  Button,
  Collapse,
  CollapseItem,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Dialog,
  InputNumber,
  Input,
  Tooltip,
  Checkbox,
  Select,
  Option,
  DatePicker,
  TimePicker,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Divider,
  Switch,
  Table,
  TableColumn
]

const registerElements = Vue => {
  if (!components.length) {
    Vue.use(Loading.directive);
    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$message = Message;
    return
  }
  Vue.use(components.shift())
  return registerElements(Vue)
}

export default registerElements
