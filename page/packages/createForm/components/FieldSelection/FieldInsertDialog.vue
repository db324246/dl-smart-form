<template>
  <el-dialog
    title='字段选择'
    :visible.sync='dialogVisible'
    width='580px'
    :close-on-click-modal='false'
    :before-close='handleClose'>
    <el-form :model='form' :rules='rules' ref='form' label-width='0px'>
      <el-form-item prop='fields'>
        <el-cascader
          v-model="form.fields"
          :options="cascaderOptions"
          :props="cascaderProps"
          clearable
          placeholder="请选择字段"
          :show-all-levels="false">
        </el-cascader>
      </el-form-item>
    </el-form>
    <span slot='footer' class='dialog-footer'>
      <el-button @click='handleClose'>取 消</el-button>
      <el-button type='primary' @click='handleSave'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import store from '@pr/store'
import { basicComponents, advanceComponents, layoutComponents } from '@pr/components/fields'
import {
  deepClone,
  createRow,
  createCol,
  syncFieldInitTo
} from '@pr/createForm/utils'
export default {
  name: 'field-insert-dialog',
  inject: [
    'eventBus',
    'fieldsArr',
    'extendedAttrs',
    'generateFieldName'
  ],
  data() {
    return {
      dialogVisible: false,
      nodeData: null,
      filterHandler: null,
      fieldsMap: new Map(), // 字段集合
      choosedFieldKeys: [], // 已经添加到表单的字段
      form: {
        fields: []
      },
      rules: {
        fields: {
          required: true, message: '请选择字段', trigger: 'change'
        }
      },
      cascaderProps: {
        expandTrigger: 'hover',
        multiple: true,
        emitPath: false,
        value: 'cascaderId',
        disabled: 'cascaderDisabled',
        leaf: 'cascaderLeaf',
        children: 'cascaderChildren'
      },
      originFieldsConfig: {
        base: {
          cascaderId: 'base',
          label: '基础字段',
          cascaderChildren: basicComponents
        },
        high: {
          cascaderId: 'high',
          label: '高阶字段',
          cascaderChildren: advanceComponents
        },
        layout: {
          cascaderId: 'layout',
          label: '布局字段',
          cascaderChildren: layoutComponents
        }
      }
    }
  },
  computed: {
    customFields() {
      return store.customFields
    },
    fieldsArrKeys() {
      return this.fieldsArr.map(f => f.name)
    },
    showOriginFields() {
      return this.$parent.showOriginFields
        .filter(i => Reflect.has(this.originFieldsConfig, i))
        .map(i => {
          const item = this.originFieldsConfig[i]
          item.cascaderChildren = item.cascaderChildren.map((com, index) => ({
            ...com.field,
            cascaderId: item.cascaderId + index,
            cascaderDisabled: false,
            cascaderLeaf: true
          }))
          item.cascaderChildren.forEach(field => {
            this.fieldsMap.set(field.cascaderId, field)
          })
          return item
        })
    },
    showCustomFields() {
      return this.customFields.map((item, index) => ({
        cascaderId: 'custom' + index,
        label: item.groupName,
        cascaderChildren: item.components.map(com => {
          const field = { ...com.field, cascaderId: com.field.name }
          field.cascaderDisabled = this.choosedFieldKeys.includes(com.field.name)
          field.cascaderLeaf = true
          this.fieldsMap.set(field.cascaderId, field)
          return field
        })
      }))
    },
    cascaderOptions() {
      return this.showOriginFields.concat(this.showCustomFields)
    }
  },
  created() {
    this.eventBus.$on('show-insert-dialog', this.showDialog)

    this.$on('hook:destroyed', () => {
      this.eventBus.$off('show-insert-field')
    })
  },
  methods: {
    showDialog(node = {}, filter) {
      this.nodeData = node
      this.filterHandler = filter || (() => true)
      this.dialogVisible = true
    },
    // 保存
    async handleSave() {
      try {
        await this.$refs.form.validate()
        const fields = this.form.fields.map(key => {
          const f = this.fieldsMap.get(key)
          const _f = {
            ...syncFieldInitTo(f),
            ...deepClone(this.extendedAttrs)
          }
          Reflect.deleteProperty(_f, 'cascaderId')
          Reflect.deleteProperty(_f, 'cascaderLeaf')
          Reflect.deleteProperty(_f, 'cascaderDisabled')
          _f.key = _f.name = _f.name || this.generateFieldName(_f.type)
          return _f
        })
        if (fields.some(f => !this.filterHandler(f))) return

        this.choosedFieldKeys.push(...this.form.fields)
        fields.forEach((f, index) => {
          if (!this.choosedFieldKeys.includes(f.name)) {
            this.choosedFieldKeys.push(f.name)
          }
          this.eventBus.$emit('add-field', { field: f })
          this.handleInsert(f)
        })
        this.handleClose()
      } catch (err) {
        console.log(err)
      }
    },
    handleInsert(f) {
      const type = this.nodeData.domtype
      switch (type) {
        case 'row':
          (() => {
            const col = createCol(this.nodeData.key)
            col.children.push({
              domtype: 'field',
              parentKey: col.key,
              fieldName: f.name,
              key: f.name
            })
            this.nodeData.children.push(col)
          })()
          break;
        case 'col':
          (() => {
            if (this.nodeData.children.length) {
              const row = createRow(this.nodeData.key)
              const col = row.children[0]
              col.children.push({
                domtype: 'field',
                parentKey: col.key,
                fieldName: f.name,
                key: f.name
              })
              this.nodeData.children.push(row)
            } else {
              this.nodeData.children.push({
                domtype: 'field',
                parentKey: this.nodeData.key,
                fieldName: f.name,
                key: f.name
              })
            }
          })()
          break;
        case 'table':
        case 'field':
          (() => {
            const row = createRow(this.nodeData.key)
            const col = row.children[0]
            col.children.push({
              domtype: 'field',
              parentKey: col.key,
              fieldName: f.name,
              key: f.name
            })
            this.nodeData.children.push(row)
          })()
          break
        default:
          break;
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.form.fields = []
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-cascader {
  width: 100%;
}
</style>
