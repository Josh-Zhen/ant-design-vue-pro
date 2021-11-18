import request from '@/utils/request'

const api = {
  sysDictType: '/dict'
}

/**
 * 获取字典类型下所有值
 */
export function sysDictTypeDropDown (parameter) {
  return request({
    url: api.sysDictType + '/dropDown',
    method: 'get',
    params: parameter
  })
}

/**
 * 分页查询字典管理
 */
export function getSysDictTypePageList (parameter) {
  return request({
    url: api.sysDictType + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询字典管理列表
 */
export function getSysDictTypeList (parameter) {
  return request({
    url: api.sysDictType + '/list',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存字典管理
 */
export function saveSysDictType (parameter) {
  return request({
    url: api.sysDictType + (parameter.id > 0 ? '/update' : '/save'),
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
export function delSysDictType (parameter) {
  return request({
    url: api.sysDictType + '/delete',
    method: 'post',
    params: parameter
  })
}

export const sysDictTypeExport = api.sysDictType + '/export'
