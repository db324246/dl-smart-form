<template>
  <div class='field-data-com'>
    <!-- 单行文本 -->
    <template v-if="fieldType === 'input'">
      <span class="field-data-com_textarea" :title="computedValue || '空'">
        {{ computedValue || '空' }}
      </span>
    </template>

    <!-- 多行文本 -->
    <template v-else-if="fieldType === 'textarea'">
      <span class="field-data-com_textarea" :title="computedValue || '空'">
        {{ computedValue || '空' }}
      </span>
    </template>

    <!-- 数字输入 -->
    <template v-else-if="fieldType === 'number'">
      {{ computedValue || '空' }}
    </template>

    <!-- 单选框组 -->
    <template v-else-if="fieldType === 'radioGroup'">
      {{computedOptionsValue}}
    </template>

    <!-- 多选框组 -->
    <template v-else-if="fieldType === 'checkboxGroup'">
      {{computedOptionsValue}}
    </template>

    <!-- 日期选择器 -->
    <template v-else-if="fieldType === 'date'">
      {{computedValue}}
    </template>

    <!-- 日期范围 -->
    <template v-else-if="fieldType === 'dateRange'">
      {{computedDateRangeValue}}
    </template>

    <!-- 时间选择器 -->
    <template v-else-if="fieldType === 'time'">
      {{computedValue}}
    </template>

    <!-- 时间范围 -->
    <template v-else-if="fieldType === 'timeRange'">
      {{computedDateRangeValue}}
    </template>

    <!-- 下拉选择框 -->
    <template v-else-if="fieldType === 'select'">
      {{computedOptionsValue}}
    </template>

    <!-- 多选下拉框 -->
    <template v-else-if="fieldType === 'mulSelect'">
      {{computedOptionsValue}}
    </template>

    <!-- switch -->
    <template v-else-if="fieldType === 'switch'">
      <el-switch
        disabled
        v-model="compVal">
      </el-switch>
    </template>

    <!-- 文件上传 -->
    <template v-else-if="fieldType === 'file'">
      <template v-if="isTable">
        <el-button @click="toFileDetailView" v-if="compVal.length > 0" type="primary" size="mini">查看</el-button>
        <span v-else>空</span>
      </template>
      <template v-else>
        <attachment-list
          v-if="fieldObj.attrs.filetype === 'attachement'"
          v-model="compVal">
        </attachment-list>
        <images-by-upload
          v-else :showDelBtn="false"
          v-model="compVal">
        </images-by-upload>
      </template>
    </template>

    <!-- 证照上传 -->
    <template v-else-if="fieldType === 'license'">
      <img
        class="uploader-avatar"
        v-if="compVal"
        :src="showImageComputed(compVal)"
        alt="" />
      <span v-else>空</span>
    </template>

    <!-- 选人控件 -->
    <!-- :config="configTrialJudge" -->
    <template v-else-if="fieldType === 'personnel'">
      <address-book
        is-disabled
        v-if="compVal && compVal.length > 0"
        :config="computedConfig"
        v-model="compVal"/>
      <span v-else>空</span>
    </template>

    <div v-if="fileDialog">
      <el-dialog title="查看" :visible.sync="fileDialog" width="550px"
        append-to-body
        :close-on-press-escape='false'
        :close-on-click-modal='false'>
        <attachment-list
          v-if="fieldObj.attrs.filetype === 'attachement'"
          v-model="compVal">
        </attachment-list>
        <images-by-upload
          v-else :showDelBtn="false"
          v-model="compVal">
        </images-by-upload>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { generatePersonalConfig } from '@/components/dlSmartForm/utils'
import AddressBook from '@/components/EduAddressBook/index'
import AttachmentList from '@/components/EduAttachmentList/index'
import ImagesByUpload from '@/common/sbjd/components/ImagesByUpload'
export default {
  name: 'field-data-com',
  inject: ['loadDictList'],
  components: {
    AttachmentList,
    AddressBook,
    ImagesByUpload
  },
  props: [
    'fieldObj',
    'fieldVal',
    'isTable' // 是否是在table表格中还是在弹窗中展示
  ],
  data() {
    return {
      fileDialog: false,
      baseFieldTypes: ['input', 'textarea', 'number', 'date', 'time'], // 基础类型字段
      rangeDataFields: ['dateRange', 'timeRange'],
      hasOptionsField: ['select', 'radioGroup', 'checkboxGroup', 'mulSelect']
    }
  },
  computed: {
    fieldType() {
      return this.fieldObj.type
    },
    computedConfig() {
      return generatePersonalConfig(this.fieldObj.attrs)
    },
    compVal() {
      return this.fieldVal || this.fieldObj.value
    },
    // 计算字段的value
    computedValue() {
      if (!this.baseFieldTypes.includes(this.fieldType)) return '空'
      return this.compVal || '空'
    },
    // 计算字段的value
    computedOptionsValue() {
      if (!this.hasOptionsField.includes(this.fieldType)) return '空'
      const { options } = this.fieldObj
      if (!this.compVal || !this.compVal.length) return '空'
      if (Array.isArray(this.compVal)) {
        return options.filter(o => this.compVal.includes(o.key))
          .map(o => o.value)
          .join('，')
      } else {
        return options.find(o => this.compVal === o.key)
          .value
      }
    },
    // 计算字段的value
    computedDateRangeValue() {
      if (!this.rangeDataFields.includes(this.fieldType)) return '空'
      if (!this.compVal || !this.compVal.length) return '空'

      return `${this.compVal[0]} 至 ${this.compVal[1]}`
    }
  },
  async created() {
    if (this.hasOptionsField.includes(this.fieldType)) {
      if (this.fieldObj.attrs.bindDicts &&
      this.fieldObj.attrs.constantId && this.loadDictList) {
        try {
          const data = await this.loadDictList(
            this.fieldObj.attrs.constantId
          )
          this.fieldObj.options = data
        } catch (err) {
          console.log(err)
        }
      }
    }
  },
  methods: {
    toFileDetailView() {
      this.fileDialog = true
    }
  }
}
</script>

<style lang='scss' scoped>
.uploader-avatar {
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 4px;
}
.field-data-com_textarea{
  -webkit-line-clamp: 3;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
	overflow: hidden;
	/*! autoprefixer: ignore next */
    -webkit-box-orient: vertical;
	display: -webkit-box;
	text-overflow: -o-ellipsis-lastline;
	word-break:break-all;
}
</style>
