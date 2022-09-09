<template>
  <div class='field-data-com'>
    <!-- 单行文本 -->
    <template v-if="fieldType === 'input'">
      {{ computedValue }}
    </template>

    <!-- 多行文本 -->
    <template v-else-if="fieldType === 'textarea'">
      {{ computedValue }}
    </template>

    <!-- 数字输入 -->
    <template v-else-if="fieldType === 'number'">
      {{ computedValue }}
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
      <van-switch
        disabled
        v-model="compVal" 
        size="20px"/>
    </template>

    <!-- 文件上传 -->
    <template v-else-if="fieldType === 'file'">
      <span v-if="!compVal || compVal.length === 0">{{empty}}</span>
      <div v-else>
        <attachment-list
          v-if="fieldObj.attrs.filetype === 'attachement'"
          v-model="compVal">
        </attachment-list>
        <template v-else>
          <img
            v-for="(f, index) in compVal"
            :key="f.attachmentKey"
            class="uploader-avatar"
            :src="showImageComputed(f.attachmentKey)"
            alt="" 
            @click.stop="() => {
              const images = compVal.map(item => {
                return showImageComputed(item.attachmentKey)
              })
              handlePreview(images, index)
            }"/>
        </template>
      </div>
    </template>

    <!-- 证照上传 -->
    <template v-else-if="fieldType === 'license'">
      <span v-if="!compVal">{{empty}}</span>
      <img
        class="uploader-avatar"
        v-else
        :src="showImageComputed(compVal)"
        alt="" 
        @click="handlePreview([showImageComputed(compVal)])"/>
    </template>

    <!-- 选人控件 -->
    <template v-else-if="fieldType === 'personnel'">
      <span v-if="!compVal || compVal.length === 0">{{empty}}</span>
      <span v-else>{{computedAddressUser}}</span>
      <!-- <address-book
        is-disabled
        v-model="compVal" v-else/> -->
    </template>
  </div>
</template>

<script>
import FieldTag from './FieldTag'
import { ImagePreview } from 'vant';
import AddressBook from '@/components/EduAddressBook/index'
import AttachmentList from '@/components/EduAttachmentList/index'

export default {
  name: 'field-data-com',
  inject: ['loadDictList'],
  components: {
    FieldTag,
    AttachmentList,
    AddressBook,
    // ImagesByUpload
  },
  props: [
    'fieldObj',
    'fieldVal'
  ],
  data() {
    return {
      baseFieldTypes: ['input', 'textarea', 'number', 'date', 'time'], // 基础类型字段
      rangeDataFields: ['dateRange', 'timeRange'],
      hasOptionsField: ['select', 'radioGroup', 'checkboxGroup', 'mulSelect'],
      empty: '空'
    }
  },
  computed: {
    computedAddressUser() {
      if (this.compVal && Array.isArray(this.compVal) && this.compVal.length > 0) {
        const nameList = this.compVal.map(f => f.name)
        return nameList.join()
      } else {
        return this.empty
      }
    },
    fieldType() {
      return this.fieldObj.type
    },
    compVal() {
      return this.fieldVal || this.fieldObj.value
    },
    // 计算字段的value
    computedValue() {
      if (!this.baseFieldTypes.includes(this.fieldType)) return ''
      return this.compVal || this.empty
    },
    // 计算字段的value
    computedOptionsValue() {
      if (!this.hasOptionsField.includes(this.fieldType)) return ''
      const { options } = this.fieldObj
      if (!this.compVal || !this.compVal.length) return this.empty
      if (Array.isArray(this.compVal)) {
        return options.filter(o => this.compVal.includes(o.key))
          .map(o => o.value)
          .join('，')
      } else {
        const o = options.find(o => this.compVal === o.key)
        return o ? o.value : this.empty
      }
    },
    // 计算字段的value
    computedDateRangeValue() {
      if (!this.rangeDataFields.includes(this.fieldType)) return ''
      if (!this.compVal || !this.compVal.length) return this.empty

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
    handlePreview(images, startPosition = 0) {
      ImagePreview({
        images,
        startPosition
      })
    }
  }
}
</script>

<style lang='less' scoped>
.field-data-com {
  flex: 1;
  color: #969799;
  .uploader-avatar {
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 4px;
  }
}
/deep/ .address-cells {
  text-align: right;
}
/deep/ .address-item {
  white-space: nowrap;
  max-width: none;
}
/deep/ .attachment-list {
  padding: 0;
  .attachment-item {
    &:first-child{
      border-top: none;
    }
    &:last-child{
      border-bottom: none;
    }
  }
}
</style>