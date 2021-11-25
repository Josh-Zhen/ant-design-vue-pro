import request from '@/utils/request'

const api = {
  genTables: '/genTables'
}

/**
 * 分页查询表配置
 */
export function getTablesPageList (parameter) {
  return request({
    url: api.genDb + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存表配置
 */
export function saveGenTables (parameter) {
  return request({
    url: api.genDb + (parameter.id > 0 ? '/update' : '/save'),
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
    url: api.genDb + '/delete',
    method: 'post',
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
