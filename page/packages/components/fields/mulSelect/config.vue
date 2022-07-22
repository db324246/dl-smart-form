<template>
  <el-form class='mulSelect-config' label-position="top" size="small">
    <el-form-item label="字段标题">
      <el-input v-model="form.label" :disabled="disabled"></el-input>
    </el-form-item>

    <el-form-item label="占位内容">
      <el-input v-model="form.attrs.placeholder" :disabled="disabled"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="form.attrs.bindDicts" :disabled="disabled">是否绑定字典</el-checkbox>
      <template v-if="form.attrs.bindDicts">
        <el-select
          v-model="form.attrs.constantId"
          placeholder="请选择"
          @change="handleChange"
          :disabled="disabled">
          <el-option
            v-for="(dict, index) in dictionaryList"
            :key="index"
            :label="dict.dictName"
            :value="dict.constantId">
          </el-option>
        </el-select>
      </template>
    </el-form-item>
    <el-form-item label="选项" v-loading="loadingDict">
      <el-checkbox-group v-model="form.value" :disabled="disabled">
        <draggable tag="ul" :list="form.options" class="draggable-options"
          v-bind="{
            group: { name:'options'},
            ghostClass: 'ghost',
            handle: '.drag-item'
          }"
          handle=".drag-item">
          <li v-for="(item, index) in form.options" :key="item.key" >
            <el-checkbox
              :label="item.key"
              style="margin-right: 5px;">
              <el-input
                required
                style="width:180px;"
                size="small"
                v-model="item.value"
                :disabled="disabled || form.attrs.bindDicts"
                @blur="handleOptionValChange(index, item)">
              </el-input>
            </el-checkbox>
            <template v-if="!form.attrs.bindDicts">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;">
                <i class="el-icon-rank"></i>
              </i>
              <el-button
                v-if="form.options.length > 1"
                @click="handleOptionsRemove(index, item)"
                circle
                plain
                type="danger"
                size="small"
                icon="el-icon-minus"
                :disabled="disabled"
                style="padding: 4px;margin-left: 5px;">
              </el-button>
            </template>
          </li>
        </draggable>
      </el-checkbox-group>

      <div v-if="!form.attrs.bindDicts" style="margin-left: 22px;">
        <el-button type="text" @click="handleAddOption" :disabled="disabled">添加选项</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
  name: 'mulSelect-config',
  inject: ['dictionaryArr', 'loadDictList'],
  components: {
    Draggable
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingDict: false,
      cacheOpt: null
    }
  },
  computed: {
    dictionaryList() {
      if (this.dictionaryArr.length) return this.dictionaryArr
      if (this.form.attrs.constantId) {
        return [
          {
            dictName: this.form.attrs.dictName,
            constantId: this.form.attrs.constantId
          }
        ]
      } else {
        return []
      }
    }
  },
  watch: {
    'form.attrs.bindDicts'(val) {
      if (val) {
        this.cacheOpt = this.form.options.slice()
        this.form.options = []
      } else {
        this.form.options = this.cacheOpt || []
        this.form.attrs.constantId = ''
      }
      this.form.value = []
    }
  },
  methods: {
    // 切换字典
    async handleChange() {
      if (!this.form.attrs.constantId) return

      this.form.attrs.dictName = this.dictionaryList.find(d => d.constantId === this.form.attrs.constantId).dictName
      this.loadingDict = true
      try {
        const { data } = await this.loadDictList(this.form.attrs.constantId)
        this.form.options = data
        this.form.value = []
        this.loadingDict = false
      } catch (err) {
        console.log(err)
      }
    },
    // 添加新选项
    handleAddOption() {
      const key = `'option_'${Date.now()}${Math.ceil(Math.random() * 999)}`
      this.form.options.push({
        value: '新选项' + key,
        key
      })
    },
    // 移除选项
    handleOptionsRemove(index, item) {
      this.form.options.splice(index, 1)

      this.form.value = this.form.value.filter(i => i !== item.key)
    },
    handleOptionValChange(index, item) {
      if (!item.value) {
        this.$message.error('选项不能为空')
        this.handleOptionsRemove(index, item)
      }
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 0 10px;
}
.el-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.el-form .el-form-item {
  margin-bottom: 10px;
}
.draggable-options {
  padding: 0;
}
.draggable-options li {
  margin-bottom: 10px;
  line-height: 1;
}
.draggable-options li label {
  height: 28px;
  line-height: 1;
}
</style>
