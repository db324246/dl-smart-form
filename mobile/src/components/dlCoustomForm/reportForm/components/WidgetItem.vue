<template>
  <div class="widget-view van-hairline--bottom"
    v-if="computedShowField"
    :class="{
      'is_req': curFieldAttachedRule.required,
      ['widget-' + fieldObj.type]: true
    }">

    <!-- 重复上报 -->
    <arrayform-field
      v-if="fieldType === 'arrayform'"
      :field="fieldObj"
      :show-label="showLabel">
    </arrayform-field>

    <!-- 标题/段落 -->
    <div
      v-else-if="fieldType === 'title'"
      class="el-title"
      v-text="fieldObj.value"
      :style="{
        'font-size': fieldObj.attrs.fontSize,
        'font-weight': fieldObj.attrs.fontWeight,
        'color': fieldObj.attrs.color,
        'background-color': fieldObj.attrs.backgroundColor
      }">
    </div>

    <!-- 分割线 -->
    <el-divider v-else-if="fieldType === 'divider'"></el-divider>
    
    <!-- 禁止编辑 -->
    <van-field
      v-else-if="!fieldIsEditable"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
      <template #input>
        <field-data-com :field-obj="fieldObj"></field-data-com>
      </template>
    </van-field>

    <!-- 可编辑 -->
    <!-- 单行文本 -->
    <van-field
      v-else-if="fieldType === 'input'"
      v-model="fieldObj.value"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      :placeholder="fieldObj.attrs.placeholder"
      :maxlength="fieldObj.attrs.maxlength">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>

    <!-- 多行文本 -->
    <van-field
      v-else-if="fieldType === 'textarea'"
      v-model="fieldObj.value"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      type="textarea"
      rows="2"
      :placeholder="fieldObj.attrs.placeholder"
      :maxlength="fieldObj.attrs.maxlength">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>

    <!-- 数字输入 -->
    <van-field
      v-else-if="fieldType === 'number'"
      v-model="fieldObj.value"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      type="number"
      :placeholder="fieldObj.attrs.placeholder"
      :maxlength="fieldObj.attrs.maxlength">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>

    <!-- 单选框组 -->
    <van-field
      v-else-if="fieldType === 'radioGroup'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
      <template #input>
        <van-radio-group v-model="fieldObj.value" direction="horizontal">
          <van-radio
            v-for="item in fieldObj.options"
            :key="item.key"
            :name="item.key">
            {{ item.value }}
          </van-radio>
        </van-radio-group>
      </template>
    </van-field>

    <!-- 多选框组 -->
    <van-field
      v-else-if="fieldType === 'checkboxGroup'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right">
      <template #input>
        <van-checkbox-group v-model="fieldObj.value" direction="horizontal">
          <van-checkbox
            v-for="item in fieldObj.options"
            :key="item.key"
            :name="item.key"
            shape="square">
            {{ item.value }}
          </van-checkbox>
        </van-checkbox-group>
      </template>
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>

    <!-- 日期选择器 -->
    <vant-field-date
      v-else-if="fieldType === 'date'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      v-model="fieldObj.value"
      :type="fieldObj.attrs.comType"
      :placeholder="fieldObj.attrs.placeholder"
      :format="fieldObj.attrs.format">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </vant-field-date>

    <!-- 日期范围 -->
    <vant-field-date-range
      v-else-if="fieldType == 'dateRange'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      v-model="fieldObj.value"
      :type="fieldObj.attrs.comType"
      :format="fieldObj.attrs.format"
      :start-placeholder="fieldObj.attrs.startPlaceholder"
      :end-placeholder="fieldObj.attrs.endPlaceholder">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </vant-field-date-range>

    <!-- 时间选择器 -->
    <vant-field-date
      v-else-if="fieldType === 'time'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      v-model="fieldObj.value"
      type="time"
      :placeholder="fieldObj.attrs.placeholder"
      :format="'hh:mm'"
      :min-hour="10"
      :max-hour="20">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </vant-field-date>

    <!-- 下拉选择框 -->
    <vant-field-select
      v-else-if="fieldType == 'select'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      v-model="singleOptionsVal"
      :placeholder="fieldObj.attrs.placeholder"
      :columns="fieldObj.options"
      value-key="key"
      value-label-key="value">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </vant-field-select>

    <!-- 多选下拉框 -->
    <vant-field-mul-select
      v-else-if="fieldType == 'mulSelect'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right"
      v-model="mulOptionsVal"
      :placeholder="fieldObj.attrs.placeholder"
      :columns="fieldObj.options"
      value-key="key"
      value-label-key="value">
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </vant-field-mul-select>

    <!-- switch -->
    <van-field
      v-else-if="fieldType === 'switch'"
      :name="fieldObj.name"
      :rules="rules"
      :required="required"
      input-align="right"
      error-message-align="right">
      <template #input>
        <van-switch v-model="fieldObj.value" size="20px"/>
      </template>
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>

    <!-- 文件上传 -->
    <van-field
      v-else-if="fieldType === 'file'"
      :name="fieldObj.name"
      :rules="rules"
      :value="arrFieldValue"
      :required="required"
      input-align="right"
      error-message-align="right">
      <template slot="input">
        <edu-uploader
          v-if="fieldObj.attrs.filetype === 'attachement'"
          v-model="fieldObj.value"
          :biz-params="uploaderFileParams"
          :arrow-value="false"
          :multiple="fieldObj.attrs.multiple"
          :accept="acceptType"
          :upload-success="uploadSuccess(fieldObj.name)"
          :max-up-num="fieldObj.attrs.upMaxNum">
        </edu-uploader>
        <pic-upload
          :arrowValue='false'
          v-model="fieldObj.value"
          v-else-if="fieldObj.attrs.filetype === 'image'"
          :biz-params="uploaderImgParams" :custom-van-upload-attr="loadImageUploaderConfig">
          <span class="upload-hint"></span>
        </pic-upload>
      </template>
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>

    <!-- 证照上传 -->
    <van-field
      v-else-if="fieldType === 'license'"
      :name="fieldObj.name"
      :rules="rules"
      :value="fieldObj.value"
      :required="required"
      input-align="right"
      error-message-align="right"
      @click="$refs.eduUploaderAvatar.showDialog()">
      <template #input>
        <edu-uploader-avatar
          ref="eduUploaderAvatar"
          v-model="fieldObj.value"
          :option="{
            fixedNumber: [
              fieldObj.attrs.width,
              fieldObj.attrs.height
            ]
          }"
          :height="fieldObj.attrs.height"
          :width="fieldObj.attrs.width"
          :pic-clicked="false"
          :pic-rounded="false"
          :onerror-pic="onerrorPic"
          :params="uploaderAvatarParams">
          <van-icon name="arrow" size="18" color="#e0e0e0"/>
        </edu-uploader-avatar>
      </template>
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>

    <!-- 选人控件 -->
    <van-field
      v-else-if="fieldType === 'personnel'"
      :name="fieldObj.name"
      :rules="rules"
      :value="arrFieldValue"
      :required="required"
      input-align="right"
      error-message-align="right">
      <template #input>
        <address-book
          v-if="fieldObj.attrs.customRange.length"
          v-model="fieldObj.value"
          :self-range-data="fieldObj.attrs.customRange"
          :config="computedConfig"/>
        <address-book
          v-else
          v-model="fieldObj.value"
          :config="computedConfig"/>
      </template>
      <template #label>
        <div>
          {{ showLabel ? fieldObj.label : '' }}
          <field-tag :field="fieldObj"></field-tag>
        </div>
      </template>
    </van-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bizEnroll from '@/utils/bizEnroll'
import AddressBook from '@/components/EduAddressBook/index'
import EduUploaderAvatar from '@/components/EduUploaderAvatar'
import PicUpload from '@/components/eduPicUpload'
import EduUploader from '@/components/EduUploader'
import FieldTag from '@/components/dlCoustomForm/components/FieldTag'
import { generatePersonalConfig } from '@/components/dlCoustomForm/utils'
import FieldDataCom from '@/components/dlCoustomForm/components/FieldDataCom'
import { VantFieldDate, VantFieldSelect, VantFieldMulSelect, VantFieldDateRange } from '@/components/VantCustomCom'

export default {
  name: 'widget-item',
  components: {
    FieldTag,
    FieldDataCom,
    AddressBook,
    EduUploader,
    PicUpload,
    EduUploaderAvatar,
    VantFieldDate,
    VantFieldSelect,
    VantFieldMulSelect,
    VantFieldDateRange
  },
  inject: [
    'getFormId',
    'isEditable',
    'isFieldShow',
    'fileCode',
    'loadDictList'
  ],
  props: {
    fieldName: {
      type: String,
      required: true
    },
    fieldData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      uploaderFileParams: bizEnroll(
        'customForm-file', this.fileCode + this.fieldName
      ),
      uploaderImgParams: bizEnroll(
        'customForm-image', this.fileCode + this.fieldName
      ),
      uploaderAvatarParams: bizEnroll(
        'customForm-avatar', this.fileCode + this.fieldName
      ),
      baseFieldTypes: ['input', 'textarea', 'number', 'date', 'time'], // 基础类型字段
      rangeFieldTypes: ['dateRange', 'timeRange'], // 范围类型的字段
      hasOptionsField: ['select', 'radioGroup', 'checkboxGroup', 'mulSelect'], // 拥有选项的字段类型
      dateTypeMap: {
        date: 'date',
        month: 'year-month',
        datetime: 'datehour'
      },
      dateRangeTypeMap: {
        daterange: 'date',
        datetimerange: 'datehour'
      }
    }
  },
  computed: {
    ...mapGetters('customForm', [
      'getRuleShow',
      'getFields',
      'fieldAttachedRule',
      'formModelRules'
    ]),
    formId() {
      return this.getFormId()
    },
    rules() {
      const map = {
        'blur': 'onBlur',
        'change': 'onChange'
      }
      const rules = this.formModelRules(this.formId)[this.fieldName]
      return rules.map(i => {
        const obj = { ...i }
        obj.trigger = map[i.trigger]
        return obj
      })
    },
    fieldsMap() {
      return this.getFields(this.formId)
    },
    fieldObj() {
      return this.fieldData || this.fieldsMap[this.fieldName]
    },
    fieldType() {
      console.log('---------------', this.fieldObj)
      return this.fieldObj.type
    },
    ruleShow() {
      return this.getRuleShow(this.formId)
    },
    // 计算关联规则 - 是否展示字段
    fieldRuleShow() {
      const flag = this.ruleShow[this.fieldName]
      return flag === undefined ? true : flag
    },
    // 自定义函数 - 是否展示字段
    fieldIsShow() {
      return this.isFieldShow ? this.isFieldShow(this.fieldObj) : true
    },
    computedShowField() {
      return this.fieldObj &&
        this.fieldName &&
        this.fieldIsShow &&
        this.fieldRuleShow
    },
    // 自定义函数 - 字段是否可编辑
    fieldIsEditable() {
      if (this.isEditable) {
        return this.isEditable(this.fieldObj)
      } else {
        return true
      }
    },
    curFieldAttachedRule() {
      return this.fieldAttachedRule(this.formId)[this.fieldName] || {}
    },
    showLabel() {
      return this.curFieldAttachedRule.showLabel
    },
    required() {
      return this.curFieldAttachedRule.required
    },
    // 计算选人控件配置参数
    computedConfig() {
      return generatePersonalConfig(this.fieldObj.attrs)
    },
    onerrorPic() {
      return `this.onerror=null;this.src="${this.fieldObj.attrs.defaultImg}"`
    },
    // 下拉单选计算值
    singleOptionsVal: {
      get() {
        if (this.fieldType !== 'select') return ''
        return this.fieldObj.options.find(o => {
          return this.fieldObj.value === o.key
        })
      },
      set(val) {
        this.fieldObj.value = val.key
      }
    },
    // 下拉多选计算值
    mulOptionsVal: {
      get() {
        if (this.fieldType !== 'mulSelect') return []
        return this.fieldObj.options.filter(o => {
          return this.fieldObj.value.includes(o.key)
        })
      },
      set(val) {
        this.fieldObj.value = val.map(i => i.key)
      }
    },
    acceptType() {
      return this.fieldObj.attrs.customType.join(',') || ''
    },
    loadImageUploaderConfig() {
      if (this.fieldType !== 'file' ||
      this.fieldObj.attrs.filetype !== 'image') return {}

      return {
        'max-count': this.fieldObj.attrs.upMaxNum,
        'accept': '.png,.jpg,.jpeg,.bmp',
      }
    },
    switchFieldValue() {
      if (this.fieldType !== 'switch') return ''
      return this.fieldObj.value ? 1 : 0
    },
    arrFieldValue() {
      if (['file', 'personnel'].includes(this.fieldType)) {
        return this.fieldObj.value.map(i => i.id).join('')
      }
      return ''
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
    } else if (this.fieldType === 'date') {
      this.fieldObj.attrs.comType = this.dateTypeMap[
        this.fieldObj.attrs.comType
      ]
    } else if (this.fieldType === 'dateRange') {
      this.fieldObj.attrs.comType = this.dateRangeTypeMap[
        this.fieldObj.attrs.comType
      ]
    }
  },
  methods: {
    uploadSuccess(name) {
      // if (!this.$parent.$parent.$refs.form) {
      //   return
      // }
      // if (this.fieldObj.value.length > 0) {
      //   this.$parent.$parent.$refs.form.validate(name)
      // } else {
      //   this.$parent.$parent.$refs.form.validate(name)
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.widget-view{
  position: relative;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
}
.widget-view.is_req {
  .citeform_box__title span::before {
    display: inline-block;
  }
  /deep/ .el-form-item__label::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.el-divider {
  margin: 10px 0;
}
.el-title {
  padding: 5px 10px;
  user-select: auto;
  background-color: #efdebb;
}
.upload-hint {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: url('~@/components/dlCoustomForm/assets/upload.png') no-repeat center;
  background-size: 100%;
}
/deep/.van-uploader__preview-image {
  width: 55px;
  height: 55px;
}
.widget-license {
  /deep/ .van-cell__value {
    margin-bottom: 1px;
  }
}
.widget-arrayform {
  margin-top: 10px;
}
</style>