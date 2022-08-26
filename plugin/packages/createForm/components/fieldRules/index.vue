<template>
  <el-dialog
    title="设置表单关联规则"
    :visible.sync="dialogVisible"
    width="900px"
    id="dialogVisible"
    :close-on-click-modal='false'
    :append-to-body="true">
    <el-button type="primary" @click="addCorrelativeRules">添加关联规则</el-button>

    <el-collapse class="rule-list">
      <el-collapse-item  v-for="(rule, index) in fieldCorrelativeRules" :key="rule.key" class="rule-item">
        <template slot="title">
          <h5 class="rule-title">规则{{ index + 1 }}</h5>
          <el-button size="mini" class="remove-btn" type="danger" @click="delCorrelativeRules(index)">移除规则</el-button>
        </template>

        <!-- 规则条件 -->
        <div class="condition-wrap">
          <div class="condition-label">
            <div class="condition-title">规则条件:</div>
          </div>
          <div class="condition-content">
            <el-button type="primary" size="mini" plain @click="addCondition(rule, index)" >添加规则条件</el-button>
            <div class="condition-list" v-if="rule.conditions.length > 0">
              <div class="condition-item" v-for="(conditionItem, conditionIndex) in rule.conditions" :key="conditionItem.key">
                <div v-if="conditionIndex === 0"></div>
                <div v-else>
                  <el-select placeholder="请选择条件连接符" v-model="conditionItem.connector">
                    <el-option v-for="connectorItem in connectorList" :key="connectorItem.label" :label="connectorItem.value" :value="connectorItem.value" > </el-option>
                  </el-select>
                </div>
                <el-select placeholder="请选择字段" v-model="conditionItem.fieldName" @change="conditionFieldChange($event, conditionItem)">
                  <el-option
                    v-for="fieldItem in ruleFiels"
                    :key="fieldItem.name"
                    :label="fieldItem.label"
                    :value="fieldItem.name" >
                  </el-option>
                </el-select>

                <!-- 选择条件 -->
                <el-select
                  placeholder="请选择条件"
                  v-model="conditionItem.judge"
                  @change="conditionJudgeChange($event, conditionItem)">
                  <el-option
                    v-for="judgeItem in fieldJudgeMap.get(conditionItem.valueType)"
                    :key="judgeItem.value"
                    :label="judgeItem.name"
                    :value="judgeItem.value">
                  </el-option>
                </el-select>

                <!-- 选择条件 -->
                <validate-value :condition="conditionItem"
                  :field-list="fieldList">
                </validate-value>

                <div class="widget-view-action">
                  <i class="el-icon-delete" title="删除" @click.stop="delCondition(rule, conditionIndex)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 条件满足时操作 -->
        <div class="success-wrap">
          <div class="condition-label">
            <div class="condition-title">条件满足时操作:</div>
          </div>
          <div class="condition-content">
            <el-button type="primary" size="mini"  plain @click="addTHandle(rule, index)" >新建条件满足时操作</el-button>
            <div class="condition-list" v-if="rule.T_handle.length > 0">
              <div class="condition-item" v-for="(THandleItem, THandleIndex) in rule.T_handle" :key="THandleItem.key">
                <el-select
                  placeholder="请选择字段"
                  v-model="THandleItem.fieldName"
                  @change="THandleFieldChange($event, THandleItem)">
                  <el-option
                    v-for="fieldItem in fieldList"
                    :key="fieldItem.name"
                    :label="fieldItem.label"
                    :value="fieldItem.name">
                  </el-option>
                </el-select>

                <!-- 操作类型 -->
                <el-select
                  placeholder="请选择操作类型"
                  v-model="THandleItem.type">
                  <el-option v-if="isComplexField(THandleItem)" label="修改值" value="C_value">
                  </el-option>
                  <el-option label="显示隐藏" value="C_show">
                  </el-option>
                  <el-option v-if="THandleItem.optionsList"
                    label="修改选项列表"
                    value="C_options">
                  </el-option>
                </el-select>

                <!-- 操作结果 -->
                <judge-value :handle-item="THandleItem"
                  :field-list="fieldList">
                </judge-value>

                <div class="widget-view-action">
                  <i class="el-icon-delete" title="删除" @click.stop="delTHandle(rule, THandleIndex)"></i>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- 条件不满足时操作 -->
        <div class="error-wrap">
          <div class="condition-label">
            <div class="condition-title">条件不满足时操作:</div>
          </div>
          <div class="condition-content">
            <el-button type="primary" size="mini"  plain @click="addFHandle(rule, index)" >新建条件不满足时操作</el-button>
            <div class="condition-list" v-if="rule.F_handle.length > 0">
              <div class="condition-item" v-for="(FHandleItem, FHandleIndex) in rule.F_handle" :key="FHandleItem.key">
                <el-select
                  placeholder="请选择字段"
                  v-model="FHandleItem.fieldName"
                  @change="FHandleFieldChange($event, FHandleItem)">
                  <el-option
                    v-for="fieldItem in fieldList"
                    :key="fieldItem.name"
                    :label="fieldItem.label"
                    :value="fieldItem.name">
                  </el-option>
                </el-select>

                <!-- 操作类型 -->
                <el-select
                  placeholder="请选择操作类型"
                  v-model="FHandleItem.type">
                  <el-option v-if="isComplexField(FHandleItem)" label="修改值" value="C_value">
                  </el-option>
                  <el-option label="显示隐藏" value="C_show">
                  </el-option>
                  <el-option v-if="FHandleItem.optionsList"
                    label="修改选项列表"
                    value="C_options">
                  </el-option>
                </el-select>

                <!-- 操作结果 -->
                <judge-value :handle-item="FHandleItem"
                  :field-list="fieldList">
                </judge-value>

                <div class="widget-view-action">
                  <i class="el-icon-delete" title="删除" @click.stop="delFHandle(rule, FHandleIndex)"></i>
                </div>

              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import FieldRules from './FieldRules.js'
export default {
  ...FieldRules
}
</script>

<style lang="scss" scoped>
$primary-color: #00bfc4;
$primary-background-color: rgba(0, 191, 196,.01);

.rule-title {
  font-size: 15px;
}
::v-deep .el-collapse {
  border: none;
}
::v-deep .el-dialog__body {
  padding-top: 15px;
}
.remove-btn{
  margin-left: 15px;
}
.condition-wrap, .success-wrap, .error-wrap {
  display: flex;
}
.success-wrap, .error-wrap {
  margin-top: 10px;
}
.condition-title{
  width: 120px;
  text-align: right;
}
.condition-content{
  flex: 1;
  margin-left: 15px;
}
.condition-list {
  border: 1px solid #eee;
  // border: 1px dashed rgba(170, 170, 170, 0.7);
  min-height: 50px;
  margin-top: 5px;
  padding: 5px 5px;
}
.condition-item {
  display: flex;
  justify-content: flex-end;
  border: 1px dashed rgba(170, 170, 170, 0.7);
  padding: 5px 5px;
  cursor: pointer;
  position: relative;
  &> * {
    margin-right: 20px;
  }
  .widget-view-action{
    display: none;
    position: absolute;
    right: 0;
    bottom: 0;
    height: 28px;
    line-height: 28px;
    background: $primary-color;
    z-index: 20;
    margin-right: 0;
    i{
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;

    }
  }
  &:hover{
    outline: 2px solid $primary-color;
    border: 1px solid $primary-color;
    outline-offset: 0;
    .widget-view-action{
      display: block;
    }

  }
}
</style>
