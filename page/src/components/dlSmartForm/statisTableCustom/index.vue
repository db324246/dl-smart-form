<template>
  <div>
    <div class="edu-filter-container bor-b">
      <div class="edu-toolbars__filters" v-if="queryFieldArr.length > 0">
        <slot name="filter"></slot>
        <div class="edu-toolbars__item" v-for="fieldObj in queryFieldArr" :key="fieldObj.name">
          {{ fieldObj.label }}：
          <component
            :is="fieldObj.tag"
            :name="fieldObj.name"
            :label="fieldObj.label"
            v-model="fieldObj.value"
            v-bind="fieldObj.props || {}"
          />
        </div>
        <div class="edu-toolbars__item">
          <el-button type="primary" size="small" @click="searchFn">搜索</el-button>
        </div>
      </div>
      <div class="edu-toolbars__btns">
        <slot name="btns"></slot>
      </div>
    </div>
    <el-table :data='tableDataList' v-loading="loading" style='width: 100%' >
      <el-table-column label="上报人姓名" prop="name" width="150" ></el-table-column>

      <el-table-column v-for="(item, index) in statisFields" :key="index" :label="item.label" min-width="150" show-overflow-tooltip >
        <template slot-scope="scope">
          <fieldTableShow :value="getValue(scope.row, item.name)" :fieldJson="getFieldJson(scope.row, item.name)"></fieldTableShow>
        </template>
      </el-table-column>
      <!-- <el-table-column align='center' label="操作" width="100" fixed="right">
        <template slot-scope="scope">
        </template>
      </el-table-column> -->
    </el-table>

    <div class='pagination-container'>
      <el-pagination
        @size-change='handleSizeChange'
        @current-change='handleCurrentChange'
        :current-page='reqObj.pageNumber'
        :page-sizes='[10, 20, 50, 100]'
        :page-size='reqObj.pageSize'
        layout='total, sizes, prev, pager, next, jumper'
        :total='total'>
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { deepClone } from '@/components/dlSmartForm/utils'
import computeField from './components/computeField.js'
import xElSelect from './components/xElSelect'
import fieldTableShow from '@/projects/teacherArchivesSch/components/fieldTableShow.vue'
export default {
  name: '',
  components: {
    xElSelect,
    fieldTableShow
  },
  props: {
    queryFields: {
      type: Array,
      default() {
        return []
      }
    },
    statisFields: {
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    isCreat: { // 是否是创建
      type: Boolean,
      default: true
    },
    total: { // 是否是创建
      type: Number,
      default: 0
    }
  },
  computed: {
    getValue() {
      return function(row, key) {
        if (row.indexJson && row.indexJson[key]) {
          return row.indexJson[key].value
        } else {
          return ''
        }
      }
    },
    getFieldJson() {
      return function(row, key) {
        if (row.indexJson && row.indexJson[key]) {
          return row.indexJson[key]
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.loading = false
          this.tableDataList = deepClone(newVal)
        }
      },
      immediate: true,
      deep: true
    },
    queryFields: {
      handler(newVal, oldVal) {
        this.queryFieldArr = []
        deepClone(newVal).forEach(item => {
          console.log('1111', item)
          if (item.type === 'time') {
            item.type = 'timeRange'
          } else if (item.type === 'date') {
            item.type = 'dateRange'
          }
          this.queryFieldArr.push(computeField(item))
        })
        console.log('22222', this.queryFieldArr)
      },
      immediate: true,
      deep: true
    },
    statisFields: {
      handler(newVal, oldVal) {
        if (!this.isCreat) { // 需要提交数据
          this.searchFn()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      tableDataList: [],
      queryFieldArr: [],
      loading: false,
      reqObj: {
        pageNumber: 1, // 分页页码（默认1）
        pageSize: 10	// 每页数据条数（默认20）
      }
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  created() {
    // console.log('hello')
  },
  methods: {
    handleSizeChange(val) {
      if (!this.isCreat) { // 需要提交数据
        this.$nextTick(() => {
          this.reqObj.pageNumber = 1
          this.reqObj.pageSize = val
          this.searchFn()
        })
      }
    },
    handleCurrentChange(val) {
      if (!this.isCreat) { // 需要提交数据
        this.reqObj.pageNumber = val
        this.searchFn()
      }
    },
    searchFn() {
      if (!this.isCreat) { // 需要提交数据
        this.loading = true
        this.$nextTick(() => {
          this.$emit('searchClick', this.queryFieldArr, this.reqObj)
        })
      }
    },
    getListFn() {
      this.$parent.getFormData()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
