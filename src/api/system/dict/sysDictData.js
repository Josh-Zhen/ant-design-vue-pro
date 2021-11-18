import request from '@/utils/request'

const api = {
  sysDictData: '/dict/data'
}

/**
 * 分页查询字典管理
 */
export function getSysDictDataPageList (parameter) {
  return request({
    url: api.sysDictData + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存字典管理
 */
export function saveSysDictData (parameter) {
  return request({
    url: api.sysDictData + (parameter.id > 0 ? '/update' : '/save'),
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
export function delSysDictData (parameter) {
  return request({
    url: api.sysDictData + '/delete',
    method: 'post',
    params: parameter
  })
}

export const sysDictDataExport = api.sysDictData + '/export'
