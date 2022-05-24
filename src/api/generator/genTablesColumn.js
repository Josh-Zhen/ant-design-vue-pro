import request from '@/utils/request'

const api = {
  genTablesColumn: '/genTablesColumn'
}

/**
 * 分页查询表配置
 */
export function getTableColumnPageList (parameter) {
  return request({
    url: api.genTablesColumn + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 保存表配置
 */
export function saveGenTablesColumn (parameter) {
  return request({
    url: api.genTablesColumn + '/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 修改表配置
 */
export function updateGenTablesColumn (parameter) {
  return request({
    url: api.genTablesColumn + '/update',
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
export function delGenTableColumns (parameter) {
  return request({
    url: api.genTablesColumn + '/delete',
    method: 'post',
    params: parameter
  })
}
