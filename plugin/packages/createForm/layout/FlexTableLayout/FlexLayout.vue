<template>
  <div class="flex-layout">
    <div class="flex-config">
      列中右键点击可以看到菜单（列的下方有阴影）
      <el-button size="mini" type="primary" plain @click="openTableConfig">表格配置</el-button>
    </div>
    <div
      class="flex-table-wr"
      :style="{
        'width': layoutConfig.width + 'px'
      }"
      v-contextmenu:contextmenu
      @contextmenu.stop.prevent="hideContextMenu">

      <v-contextmenu ref="contextmenu">
        <v-contextmenu-item @click="handleCommand('insertRow')">插入行</v-contextmenu-item>
      </v-contextmenu>

      <el-form
        :label-width="layoutConfig.labelWidth + 'px'">
        <div ref="drag-wrapper" class="drag-wrapper">
          <row-com
            v-for="(item, index) in rowsData"
            :key="item.key"
            :row-index="index"
            :row-config="item"
            :row-key="item.key"
            />
        </div>
      </el-form>
    </div>

    <el-dialog
      title="表格配置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="520px">
      <el-form label-width="100px" :model="form" @submit.native.prevent>
        <el-form-item label="表格宽度：">
          <el-input-number style="width:100px;" v-model.number="form.width" @keyup.enter.native="saveTable" :min="800" :max="1200" :controls="false" step-strictly />
           px(像素)
          <div class="table-tips">表格宽度最小为800，最大为1000</div>
        </el-form-item>
        <!-- <el-form-item label="表单标题宽度：">
          <el-input-number style="width:100px;" v-model="form.labelWidth" @keyup.enter.native="saveTable" :min="100" :max="300" :controls="false" step-strictly />
           px(像素)
          <div class="table-tips">表单标题宽度最小为100，最大为300</div>
        </el-form-item> -->
        <el-form-item label="表格是否拥有边框线：">
          <el-switch
            v-model="form.hasBorder"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTable">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bus from '../../Bus'
import Sortable from 'sortablejs'
import {
  createRow,
  hideContextMenu,
  removeDragDom,
  removeDragCloneDom,
  recursionSaveNode,
  setDraggableAttr
} from '../../utils'

export default {
  name: 'flex-layout',
  inject: ['fieldsArr'],
  data() {
    return {
      rowsData: [],
      layoutConfig: {
        width: 800,
        // labelWidth: 100,
        hasBorder: true // 线性表单
      },
      form: {
        width: 800,
        // labelWidth: 100,
        hasBorder: true // 线性表单
      },
      dialogVisible: false,
      sortableWrap: null
    }
  },
  computed: {
    nodesMap() {
      return Bus.nodesMap
    }
  },
  created() {
    // 存储一个虚拟行
    Bus.setNode({
      key: 'vRow-001',
      value: {
        parentKey: -1
      }
    })
    Bus.$on('set-layout-config', this.setLayoutConfig)
    Bus.$on('set-pc-rows', this.setRows)
    Bus.$on('liquidation-rows', this.liquidationRows)
    Bus.$on('insert-row', this.handleInsertRow)
    Bus.$on('exchange-row', this.handleExchangeRow)
    Bus.$on('delete-row', this.handleDeleteRow)
    Bus.$on('insert-field', this.insertField)
    window.addEventListener('click', this.handleWindowClick)

    this.$on('hook:destroyed', () => {
      Bus.$off('set-layout-config')
      Bus.$off('set-pc-rows')
      Bus.$off('liquidation-rows')
      Bus.$off('insert-row')
      Bus.$off('exchange-row')
      Bus.$off('delete-row')
      Bus.$off('insert-field')
      Bus.$off('get-layout')
      Bus.$off('delete-col') // 在根级注销
      window.removeEventListener('click', this.handleWindowClick)
    })
  },
  mounted() {
    this.sortableWrap = Sortable.create(
      this.$refs['drag-wrapper'],
      {
        group: {
          name: 'row',
          pull: true,
          put: ['row', 'col', 'field']
        },
        animation: 200,
        handle: '.drag-row',
        ghostClass: 'ghost-row', // 实现行影子样式
        onStart: this.handleDragStart.bind(this),
        onRemove: this.handleDragRemove.bind(this),
        onAdd: this.handleDragAdd.bind(this),
        onUpdate: this.handleDragUpdate.bind(this),
        onEnd: this.handleDragEnd.bind(this)
      }
    )
  },
  methods: {
    // 设置表格配置
    setLayoutConfig(config = {}) {
      this.layoutConfig = Object.assign(this.layoutConfig, config)
    },
    // 打开配置
    openTableConfig() {
      this.form = Object.assign({}, this.layoutConfig)
      this.dialogVisible = true
    },
    // 确定 表格配置
    saveTable() {
      if (this.form.width < 800) this.form.width = 800
      else if (this.form.width > 1000) this.form.width = 1000
      Object.keys(this.form).forEach(key => {
        this.$set(this.layoutConfig, key, this.form[key])
      })
      this.dialogVisible = false
    },
    // 设置行数据
    setRows(rowsData = []) {
      this.rowsData.splice(0, this.rowsData.length)
      this.rowsData.push(
        ...rowsData
      )
      recursionSaveNode(rowsData)
    },
    // 新增一行
    handleAddRow() {
      const defaultRow = createRow(-1)
      this.rowsData.push(defaultRow)
    },
    // 插入行
    handleInsertRow(index, rowKey) {
      const row = this.nodesMap.get(rowKey)
      const parent = row.parentKey === -1
        ? this.rowsData
        : this.nodesMap.get(row.parentKey).children
      const defaultRow = createRow(-1)
      parent.splice(index, 0, defaultRow)
    },
    // 交换行
    handleExchangeRow(sourceIndex, targetIndex, sourceKey) {
      if (sourceIndex === 0) return
      const row = this.nodesMap.get(sourceKey)
      const parent = row.parentKey === -1
        ? this.rowsData
        : this.nodesMap.get(row.parentKey).children
      const arr = parent.children
      arr[targetIndex] = arr.splice(sourceIndex, 1, arr[targetIndex])[0]
    },
    // 删除行
    handleDeleteRow(rowKey) {
      const row = this.nodesMap.get(rowKey)
      if (row.children.length) {
        // 删除 col
        row.children.map(col => col.key)
          .reverse()
          .forEach(key => {
            Bus.$emit('delete-col', key)
          })
      }
      const parent = row.parentKey === -1
        ? this.rowsData
        : this.nodesMap.get(row.parentKey).children
      // 删除 row
      const sourceIndex = parent.findIndex(row => row.key === rowKey)
      parent.splice(sourceIndex, 1)
      this.nodesMap.delete(rowKey)
    },
    // 清算行（移除没有子节点的行）
    liquidationRows() {
      const indexs = []
      this.rowsData
        .forEach((row, index) => {
          if (!row.children.length) indexs.push(index)
        })
      indexs.reverse()
        .forEach(i => {
          this.rowsData.splice(i, 1)
        })
    },
    // 监听全局点击事件
    handleWindowClick() {
      if (!Bus.focusNodeKey) return
      Bus.setFocusNodeKey('')
    },
    // 右击菜单项点击- 事件
    handleCommand(type) {
      switch (type) {
        case 'insertRow': // 插入行
          this.handleInsertRow(
            this.rowsData.length,
            'vRow-001'
          )
          break;
      }
    },
    // 隐藏 右击菜单项
    hideContextMenu() {
      hideContextMenu()
      this.$refs.contextmenu.hide()
    },
    // 开始拖拽
    handleDragStart(evt) {
      Bus.setDraggingNode({
        type: 'row',
        data: this.rowsData[evt.oldIndex]
      })
    },
    // 移除元素
    handleDragRemove(evt) {
      this.rowsData.splice(evt.oldIndex, 1)
    },
    // 添加元素
    handleDragAdd(evt) {
      if (!Bus.draggingNode) return
      setDraggableAttr(evt.item)
      const { type, data } = Bus.draggingNode
      switch (type) {
        case 'row':
          this.rowsData.splice(evt.newIndex, 0, data)
          break;
        case 'col':
          this.$nextTick(() => {
            const defaultRow = createRow(-1)
            defaultRow.children = [data]
            data.parentKey = defaultRow.key
            this.rowsData.splice(evt.newIndex, 0, defaultRow)
            removeDragDom(
              this.$refs['drag-wrapper'],
              '.f-table-col'
            )
          })
          break;
        case 'field':
          (() => {
            this.insertField(data, evt.newIndex)
            removeDragDom(
              this.$refs['drag-wrapper'],
              '.field-component'
            )
          })()
          break;
      }
      removeDragCloneDom(
        this.$refs['drag-wrapper'],
        '.f-table-row'
      )
      this.liquidationRows()
    },
    // 拖拽排序更新
    handleDragUpdate(evt) {
      const { oldIndex, newIndex } = evt
      const cacheRow = this.rowsData[oldIndex]
      this.$set(this.rowsData, oldIndex, this.rowsData[newIndex])
      this.$set(this.rowsData, newIndex, cacheRow)
    },
    // 结束拖拽
    handleDragEnd() {
      this.rowsData.forEach(row => {
        row.parentKey = -1
      })
      Bus.setDraggingNode(null)
    },
    // 插入字段
    insertField(field, index) {
      if (this.fieldsArr.some(f => f.name === field.name)) return this.$message.warning('字段已存在')
      const location = index === undefined
        ? this.rowsData.length
        : index

      const defaultRow = createRow(-1)
      const colData = defaultRow.children[0]
      colData.children.push({
        domtype: 'field',
        parentKey: colData.key,
        fieldName: field.name,
        key: field.name
      })
      Bus.$emit('add-field', {
        field,
        domKey: colData.key
      })
      Bus.$emit('edit-node', field)
      this.rowsData.splice(location, 0, defaultRow)
    },
    // 获取布局数据
    getLayout() {
      return {
        rowsData: this.rowsData,
        layoutConfig: this.layoutConfig
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-layout {
  height: 100%;
  .flex-table-wr {
    margin: 0 auto;
    padding: 5px;
    border: 1px dashed #ccc;
    height: calc(100% - 28px - 10px);
    .el-form {
      height: 100%;
      .drag-wrapper {
        height: 100%;
        padding-bottom: 40px;
        overflow-y: auto;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
}
.flex-config {
  margin-bottom: 10px;
  font-size: 14px;
  color: #b0b0b0;
  padding-left: 20px;
}
.table-tips {
  color: #b0b0b0;
  font-size: 14px;
  padding-top: 5px;
}
</style>
