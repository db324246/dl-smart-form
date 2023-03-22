<template>
  <div v-if="isMobile" class="mobile-date-picker"
    :style="reportStyle"
    :class="{
      'focus-date': isFocus
    }">
    <el-date-picker
      :editable="false"
      v-model="startDate"
      :type="dateType"
      :format="fieldAttrs.format"
      :value-format="fieldAttrs.format"
      :placeholder="fieldAttrs.startPlaceholder"
      :picker-options="startOptions"
      @focus="handleFocus"
      @blur="handleBlur">
    </el-date-picker>
    <div class="date-icons">
      <span class="range-separator">至</span>
      <span class="border"></span>
      <i class="el-icon-circle-close" @click="handleClear"></i>
    </div>
    <el-date-picker
      :editable="false"
      v-model="endDate"
      :type="dateType"
      :picker-options="endOptions"
      :format="fieldAttrs.format"
      :value-format="fieldAttrs.format"
      :placeholder="fieldAttrs.endPlaceholder"
      @focus="handleFocus"
      @blur="handleBlur">
    </el-date-picker>
  </div>
  <el-date-picker v-else
    :editable="false"
    :style="reportStyle"
    v-model="fieldObj.value"
    :type="fieldAttrs.comType"
    :format="fieldAttrs.format"
    :value-format="fieldAttrs.format"
    :start-placeholder="fieldAttrs.startPlaceholder"
    :end-placeholder="fieldAttrs.endPlaceholder"
    range-separator="至">
  </el-date-picker>
</template>

<script>
export default {
  name: 'dateRange-report',
  props: {
    fieldObj: {
      type: Object,
      required: true
    },
    reportStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isFocus: false,
      startOptions: {
        disabledDate: (date) => {
          if (!this.endDate) return false
          return date >= new Date(this.endDate)
        }
      },
      endOptions: {
        disabledDate: (date) => {
          if (!this.startDate) return false
          return date <= new Date(this.startDate)
        }
      }
    }
  },
  computed: {
    fieldAttrs() {
      return this.fieldObj.attrs
    },
    dateType() {
      return this.fieldAttrs.comType.replace('range', '')
    },
    startDate: {
      get() {
        return this.fieldObj.value[0] || ''
      },
      set(val) {
        this.$set(this.fieldObj.value, 0, val)
      }
    },
    endDate: {
      get() {
        return this.fieldObj.value[1] || ''
      },
      set(val) {
        this.$set(this.fieldObj.value, 1, val)
      }
    }
  },
  methods: {
    handleFocus() {
      this.isFocus = true
    },
    handleBlur() {
      this.isFocus = false
    },
    handleClear() {
      this.fieldObj.value = []
    }
  }
}
</script>

<style scoped lang="scss">
.mobile-date-picker {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  .date-icons {
    position: absolute;
    left: 0;
    right: 0;
    top: 30px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    padding-left: 15px;
    color: #666;
    .border {
      position: absolute;
      left: -35px;
      right: -30px;
      top: 50%;
      height: 1px;
      transform: translateY(-50%) scale(0.5);
      background-color: #ccc;
    }
  }
  .el-icon-date, .el-icon-circle-close {
    color: #C0C4CC;
    font-size: 14px;
    margin: 0 10px;
  }
  .el-date-editor {
    width: 220px;
  }
  ::v-deep .el-input__inner {
    border: none;
  }
  ::v-deep .el-input__suffix {
    display: none;
  }
}
.focus-date {
  border-color: #409EFF;
}
</style>
