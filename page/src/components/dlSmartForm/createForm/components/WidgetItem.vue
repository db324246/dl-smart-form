<template>
  <div class="widget-view "
    v-if="fieldObj && fieldObj.name"
    :class="{
      'is_req': curFieldAttachedRule.required
    }">

    <!-- 重复上报 -->
    <div class="citeform_box" v-if="fieldObj.type === 'arrayform'">
      <div
        class="citeform_box__title"
        v-if="showLabel">
        {{ fieldObj.label }}
      </div>
      <el-table border>
        <el-table-column
          :label="item.label"
          :key="item.name"
          v-for="item in fieldObj.attrs.tableColumns">
        </el-table-column>
      </el-table>
    </div>

    <!-- 标题/段落 -->
    <div
      v-else-if="fieldObj.type === 'title'"
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
    <el-divider v-else-if="fieldObj.type === 'divider'"></el-divider>

    <el-form-item
      :label="showLabel ? fieldObj.label : ''"
      :label-width="showLabel ? labelWidth : '0'"
      v-else>
      <component
        :field-obj="fieldObj"
        :template-style="getMediumWidth"
        :is="componentId">
      </component>
    </el-form-item>

    <field-tag :field="fieldObj"></field-tag>
  </div>
</template>

<script>
import store from '../../store'
import FieldTag from './FieldTag'
import { fieldTempComMap } from '../../components/fields'

export default {
  name: 'widget-item',
  components: {
    FieldTag,
    ...fieldTempComMap,
    ...store.customFieldTempMap
  },
  inject: ['fieldAttachedRule', 'fieldsArr'],
  props: {
    fieldName: {
      type: String,
      required: true
    }
  },
  computed: {
    fieldObj() {
      return this.fieldsArr.find(f => f.name === this.fieldName)
    },
    componentId() {
      return this.fieldObj.type + '-template'
    },
    curFieldAttachedRule() {
      const json = (this.fieldObj.name && this.fieldAttachedRule[this.fieldObj.name]) || {}
      if (!Reflect.has(json, 'mediumWidth')) {
        this.$set(json, 'mediumWidth', 0)
      }
      return json
    },
    labelWidth() {
      return `${this.curFieldAttachedRule.labelWidth || 100}px`
    },
    showLabel() {
      return this.curFieldAttachedRule.showLabel
    },
    getMediumWidth() {
      if (this.curFieldAttachedRule.mediumWidth > 0) {
        return {
          width: this.curFieldAttachedRule.mediumWidth + 'px'
        }
      } else {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #00bfc4;
$primary-background-color: rgba(0, 191, 196,.01);

.widget-view{
  position: relative;
  padding-bottom: 10px;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
  .el-form-item__content{
    position: unset;
  }

  .widget-view-description{
    height: 15px;
    line-height: 15px;
    font-size:13px;
    margin-top: 6px;
    color:#909399;
  }

  &:after{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    z-index: 10;
  }
  .image-uploader {
    width: 135px;
    height: 75px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar-uploader-icon {
      color: #8c939d;
      font-size: 28px;
    }
  }
  .avatar_uploader {
    display: flex;
    align-items: center;
    img {
      height: 80px;
      width: 80px;
      border-radius: 10px;
    }
    .avatar_uploader-tips {
      margin-left: 30px;
      p {
        color: #b0b0b0;
        margin: 0;
        font-size: 12px;
        line-height: 20px;
      }
      .el-button {
        margin-top: 10px;
      }
    }
  }
}
.citeform_box {
  .citeform_box__title {
    font-size: 14px;
    padding: 10px 0 10px 20px;
    &::before {
      display: none;
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}
.widget-view.is_req {
  .citeform_box__title::before {
    display: inline-block;
  }
  ::v-deep .el-form-item__label::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.el-divider {
  margin: 10px 0;
}
.el-select {
  ::v-deep .el-input__suffix-inner {
    pointer-events: none;
  }
}
.el-title {
  padding: 5px 10px;
  user-select: auto;
  background-color: #efdebb;
}
</style>
