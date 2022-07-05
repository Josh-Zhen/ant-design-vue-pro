import request from '@/utils/request'

const api = {
  genTablesConfig: '/genTableConfig'
}

/**
 * 分页查询表配置
 */
export function getGenTableConfigPageList (parameter) {
  return request({
    url: api.genTablesConfig + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存表配置
 */
export function saveGenTableConfig (parameter) {
  return request({
    url: api.genTablesConfig + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除表配置
 */
export function delGenTableConfig (parameter) {
  return request({
    url: api.genTablesConfig + '/delete',
    method: 'post',
    params: parameter
  })
}

/**
 * 獲取表配置
 */
export function getTableConfig () {
  return request({
    url: api.genTablesConfig + '/getTableConfig',
    method: 'get'
  })
}
