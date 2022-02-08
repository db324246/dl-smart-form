// 全局字典接口
import request from '@/utils/framework/request'

// 重复字段数据添加 或 修改 有citeId是修改
export function saveCiteFormData(data) {
  return request({
    url: '/archives/field/citeForm/save',
    method: 'post',
    data
  })
}

// 获取重复字段单条数据详情 { collection: 必填。字段collection属性, id: 必填。重复数据主键ID }
export function getCiteFormInfoDetail(query) {
  return request({
    url: '/archives/field/citeForm/info',
    method: 'get',
    params: query
  })
}

// 删除重复字段单条数据 { fieldName: 必填。 citeId: 必填。重复数据citeID }
export function delCiteFormInfoData(fieldName, citeId) {
  return request({
    url: '/archives/field/citeForm/del',
    method: 'get',
    params: { fieldName, citeId }
  })
}

// 还原重复字段单条记录
export function restoreCiteFormInfoRecord(id) {
  return request({
    url: '/archives/teacher/record/del',
    method: 'get',
    params: { id }
  })
}
