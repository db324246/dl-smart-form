<template>
  <!-- @click.stop="handleSelectWidget()" -->
  <div class="widget-view "
    v-if="computedShowField"
    :class="{
      'is_req': curFieldAttachedRule.required
    }">

    <!-- 重复上报 -->
    <arrayform-field
      v-if="fieldType === 'arrayform'"
      :field-obj="fieldObj"
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
    <template v-else-if="!fieldIsEditable">
      <span class="widge-field-item_divider" :style="{'left': labelWidth}" v-if="showLabel"></span>
      <el-form-item
        :label="showLabel && fieldObj.label"
        class="widge-field-item"
        :label-width="showLabel ? labelWidth : '0'">
        <field-data-com :field-obj="fieldObj" :style="getMediumWidth"></field-data-com>
        <field-tag :field="fieldObj"></field-tag>
      </el-form-item>
    </template>

    <!-- 可编辑 -->
    <template v-else>
      <span class="widge-field-item_divider" :style="{'left': labelWidth}" v-if="showLabel"></span>
      <el-form-item
        class="widge-field-item"
        :label="showLabel ? fieldObj.label : ''"
        :label-width="showLabel ? labelWidth : '0'"
        :prop="fieldObj.name"
        >

        <!-- 单行文本 -->
        <template v-if="fieldType === 'input'">
          <el-input
            v-model="fieldObj.value"
            :style="getMediumWidth"
            :placeholder="fieldObj.attrs.placeholder"
            :maxlength="fieldObj.attrs.maxlength">
          </el-input>
        </template>

        <!-- 多行文本 -->
        <template v-else-if="fieldType == 'textarea'">
          <el-input type="textarea" :rows="5"
            :style="getMediumWidth"
            v-model="fieldObj.value"
            :placeholder="fieldObj.attrs.placeholder">
          </el-input>
        </template>

        <!-- 数字输入 -->
        <template v-else-if="fieldType == 'number'">
          <el-input-number
            :style="getMediumWidth"
            v-model="fieldObj.value"
            :min="fieldObj.attrs.min"
            :max="fieldObj.attrs.max"
            :step="fieldObj.attrs.step">
          </el-input-number>
        </template>

        <!-- 单选框组 -->
        <template v-else-if="fieldType == 'radioGroup'">
          <el-radio-group v-model="fieldObj.value" :style="getMediumWidth">
            <el-radio
              :label="item.key" v-for="item in fieldObj.options" :key="item.key">
              {{ item.value }}
            </el-radio>
          </el-radio-group>
        </template>

        <!-- 多选框组 -->
        <template v-else-if="fieldType == 'checkboxGroup'">
          <el-checkbox-group v-model="fieldObj.value" :style="getMediumWidth">
            <el-checkbox
              :label="item.key" v-for="item in fieldObj.options" :key="item.key">
              {{ item.value }}
            </el-checkbox>
          </el-checkbox-group>
        </template>

        <!-- 日期选择器 -->
        <template v-else-if="fieldType == 'date'">
          <el-date-picker
            :style="getMediumWidth"
            v-model="fieldObj.value"
            :type="fieldObj.attrs.comType"
            :format="fieldObj.attrs.format"
            :placeholder="fieldObj.attrs.placeholder"
            :value-format="fieldObj.attrs.format">
          </el-date-picker>
        </template>

        <!-- 日期范围 -->
        <template v-else-if="fieldType == 'dateRange'">
          <el-date-picker
            :style="getMediumWidth"
            v-model="fieldObj.value"
            :type="fieldObj.attrs.comType"
            :format="fieldObj.attrs.format"
            :value-format="fieldObj.attrs.format"
            :start-placeholder="fieldObj.attrs.startPlaceholder"
            :end-placeholder="fieldObj.attrs.endPlaceholder"
            range-separator="至">
          </el-date-picker>
        </template>

        <!-- 时间选择器 -->
        <template v-else-if="fieldType == 'time'">
          <el-time-picker
            :style="getMediumWidth"
            v-model="fieldObj.value"
            :placeholder="fieldObj.attrs.placeholder"
            :format="fieldObj.attrs.format"
            :value-format="fieldObj.attrs.format"
          >
          </el-time-picker>
        </template>

        <!-- 时间范围 -->
        <template v-else-if="fieldType == 'timeRange'">
          <el-time-picker
            :style="getMediumWidth"
            is-range
            v-model="fieldObj.value"
            :start-placeholder="fieldObj.attrs.startPlaceholder"
            :end-placeholder="fieldObj.attrs.endPlaceholder"
            range-separator="至"
          >
          </el-time-picker>
        </template>

        <!-- 下拉选择框 -->
        <template v-else-if="fieldType == 'select'">
          <el-select
            :style="getMediumWidth"
            v-model="fieldObj.value"
            clearable
            :placeholder="fieldObj.attrs.placeholder"
          >
            <el-option v-for="item in fieldObj.options" :key="item.value" :value="item.key" :label="item.value"></el-option>
          </el-select>
        </template>

        <!-- 多选下拉框 -->
        <template v-else-if="fieldType == 'mulSelect'">
          <el-select
            :style="getMediumWidth"
            v-model="fieldObj.value"
            clearable
            :multiple="true"
            :placeholder="fieldObj.attrs.placeholder"
          >
            <el-option v-for="item in fieldObj.options" :key="item.value" :value="item.key" :label="item.value"></el-option>
          </el-select>
        </template>

        <!-- switch -->
        <template v-else-if="fieldType=='switch'">
          <el-switch
            :style="getMediumWidth"
            v-model="fieldObj.value">
          </el-switch>
        </template>

        <!-- 文件上传 -->
        <template v-else-if="fieldType=='file'">
          <uploader-view
            v-if="fieldObj.attrs.filetype === 'attachement'"
            v-model="fieldObj.value"
            :params="uploaderFileParams"
            :arrow-value="false"
            :multiple="fieldObj.attrs.multiple"
            :accept="fieldObj.attrs.customType"
            :max-up-num="fieldObj.attrs.upMaxNum">
          </uploader-view>
          <images-by-upload
            v-if="fieldObj.attrs.filetype === 'image'"
            sham-delete
            v-model="fieldObj.value">
            <uploader-view
              slot="before"
              v-model="fieldObj.value"
              :arrow-value="false"
              :params="uploaderImgParams"
              :hasFileList="false"
              :max-up-num="fieldObj.attrs.upMaxNum"
              :accept="['.png', '.jpg', '.jpeg', '.bmp']">
              <div class="upload-hint" slot="uploadBtn">
                <div class="upload-btn"></div>
              </div>
            </uploader-view>
          </images-by-upload>
        </template>

        <!-- 证照上传 -->
        <template v-else-if="fieldType == 'license'">
          <edu-uploader-avatar
            ref="eduUploaderAvatar"
            v-model="fieldObj.value"
            :pic-clicked="false"
            :pic-rounded="false"
            :onerror-pic="onerrorPic"
            :params="uploaderAvatarParams">
            <template>
              <span>{{fieldObj.attrs.tips}}</span>
            </template>
            <template slot="rightAside">
              <div class="uploadAvatar_btn">
                <p class="sm-msg">
                  {{fieldObj.attrs.tips}}
                </p>
                <el-button size='mini' type='primary' @click="$refs['eduUploaderAvatar'].showDialog()">{{fieldObj.attrs.btnText}}</el-button>
              </div>
            </template>
          </edu-uploader-avatar>
        </template>

        <!-- 选人控件 -->
        <template v-else-if="fieldType == 'personnel'">
          <address-book
            :style="getMediumWidth"
            v-if="fieldObj.attrs.customRange.length"
            v-model="fieldObj.value"
            :self-range-data="fieldObj.attrs.customRange"
            :config="computedConfig"/>
          <address-book
            v-else
            :style="getMediumWidth"
            v-model="fieldObj.value"
            :config="computedConfig"/>
        </template>

        <field-tag :field="fieldObj"></field-tag>
      </el-form-item>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FieldTag from './FieldTag'
import bizEnroll from '@/components/dlSmartForm/utils/framework/bizEnroll'
import AddressBook from '@/components/EduAddressBook/index'
import EduUploaderAvatar from '@/components/eduUploaderAvatar'
import UploaderView from '@/components/GlobalUploader/UploaderView'
import { generatePersonalConfig } from '@/components/dlSmartForm/utils'
import ImagesByUpload from '@/common/sbjd/components/ImagesByUpload'
import FieldDataCom from '@/components/dlSmartForm/showForm/components/FieldDataCom'

export default {
  name: 'widget-item',
  components: {
    FieldTag,
    FieldDataCom,
    AddressBook,
    UploaderView,
    EduUploaderAvatar,
    ImagesByUpload
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
      hasOptionsField: ['select', 'radioGroup', 'checkboxGroup', 'mulSelect'] // 拥有选项的字段类型
    }
  },
  computed: {
    ...mapGetters('customForm', [
      'getRuleShow',
      'getFields',
      'fieldAttachedRule'
    ]),
    formId() {
      return this.getFormId()
    },
    fieldsMap() {
      return this.getFields(this.formId)
    },
    fieldObj() {
      return this.fieldData || this.fieldsMap[this.fieldName]
    },
    fieldType() {
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
    labelWidth() {
      return `${this.curFieldAttachedRule.labelWidth || 100}px`
    },
    // 计算选人控件配置参数
    computedConfig() {
      return generatePersonalConfig(this.fieldObj.attrs)
    },
    onerrorPic() {
      return `this.onerror=null;this.src="${this.fieldObj.attrs.defaultImg}"`
    },
    getMediumWidth() {
      if (this.curFieldAttachedRule.hasOwnProperty('mediumWidth') && this.curFieldAttachedRule.mediumWidth > 0) {
        return {
          width: this.curFieldAttachedRule.mediumWidth + 'px'
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    fieldRuleShow: {
      handler(val) {
        this.$emit('rule-show', val)
      },
      immediate: true
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
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #00bfc4;
$primary-background-color: rgba(0, 191, 196,.01);

.widget-view{
  height: 100%;
  position: relative;
  padding-bottom: 10px;
  box-sizing: border-box;
  // overflow: hidden;
  .el-form-item {
    padding-right: 30px;
    ::v-deep .el-form-item__content {
      display: flex;
    }
    .el-radio-group {
      display: flex;
      align-items: center;
      min-height: 36px;
    }
  }
}
.widget-view.is_req {
  .citeform_box__title span::before {
    display: inline-block;
  }
  ::v-deep .el-form-item__label::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.el-divider {
  margin: 10px 0;
}
// .el-select {
//   ::v-deep .el-input__suffix-inner {
//     pointer-events: none;
//   }
// }
.el-title {
  padding: 5px 10px;
  background-color: #efdebb;
}
.upload-hint {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  .upload-btn {
    width: 90px;
    height: 65px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA9CAYAAAAeYmHpAAAA5klEQVRoge3aIRJBURyF8e+hSOJ9ySgyS7ADRVRVyQYsSrEA1QYUybtBNALBXNpdwH/MnPObUW459ws3PQ2BupzLXr9ebFN6R96jFzkGzIBX9bsE3yE8+i84WoWjVThahaNVOFqFo1U4WoWjVThahaNVOFqFo1VIRjddzitgHbQ3AhbV2RM4Bu0XmwEwBZaBo7Vh8P7Wb1qFZHR50wfgFrQ3BvbV2R3YBe1/96L/iTAHztXxtU1pEnkPv2kVjlbhaBWOVuFoFY5W4WgVjlbhaBWOVuFoFY5WIftZJ9IDOFWDUZ+UfoAPv7EcqSgpZEQAAAAASUVORK5CYII=) no-repeat 50%;
    background-size: 37px;
    cursor: pointer;
  }
}
.widge-field-item{
  position: relative;
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
}
// .widge-field-item_divider {
//   position: absolute;
//   height: calc(100% + 10px);
//   width: 1px;
//   background: #999;
//   top: -5px;
//   margin-left: -5px;
// }
</style>
