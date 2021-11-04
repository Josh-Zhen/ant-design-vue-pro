import request from '@/utils/request'

const api = {
  genDb: '/genDb'
}

/**
 * 分页查询字典管理
 */
export function getGenDbPageList (parameter) {
  return request({
    url: api.genDb + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存字典管理
 */
export function saveGenDbType (parameter) {
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
 * 删除字典管理
 */
export function delGenDb (parameter) {
  return request({
    url: api.genDb + '/delete',
    method: 'post',
    params: parameter
  })
}

export const sysDictTypeExport = api.sysDictType + '/export'
