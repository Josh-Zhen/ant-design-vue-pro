import request from '@/utils/request'

const api = {
  genTablesColumn: '/genTableColumn'
}

/**
 * 分页查询表字段詳情
 */
export function getTableColumnPageList (parameter) {
  return request({
    url: api.genTablesColumn + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 刷新表字段
 */
export function refreshGenTableColumn (parameter) {
  return request({
    url: api.genTablesColumn + '/refresh',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 修改表字段詳情
 */
export function updateGenTableColumn (parameter) {
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
 * 删除表字段詳情
 */
export function delGenTableColumns (parameter) {
  return request({
    url: api.genTablesColumn + '/delete',
    method: 'post',
    params: parameter
  })
}
