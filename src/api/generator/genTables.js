import request from '@/utils/request'

const api = {
  genTables: '/genTables'
}

/**
 * 分页查询表配置
 */
export function getTablesPageList (parameter) {
  return request({
    url: api.genTables + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 保存表配置
 */
export function saveGenTables (parameter) {
  return request({
    url: api.genTables + '/save',
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
export function updateGenTables (parameter) {
  return request({
    url: api.genTables + '/update',
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
export function delGenTables (parameter) {
  return request({
    url: api.genTables + '/delete',
    method: 'post',
    params: parameter
  })
}

/**
 * 查詢需要添加的表
 */
export function getTablesList (parameter) {
  return request({
    url: api.genTables + '/list',
    method: 'get',
    params: parameter
  })
}

/**
 * 生成表
 */
export function generateTables (parameter) {
  return request({
    url: api.genTables + '/generate',
    method: 'post',
    params: parameter
  })
}
