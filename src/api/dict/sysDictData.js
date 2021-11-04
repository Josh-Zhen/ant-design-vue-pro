import { axios } from '@/utils/request'

const api = {
  sysDictData: '/system/dict/data'
}

/**
 * 分页查询字典管理
 */
export function getSysDictDataPageList (parameter) {
  return axios({
    url: api.sysDictData + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询字典管理列表
 */
export function getSysDictDataList (parameter) {
  return axios({
    url: api.sysDictData + '/list',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存字典管理
 */
export function saveSysDictData (parameter) {
  return axios({
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
  return axios({
    url: api.sysDictData + '/delete',
    method: 'post',
    params: parameter
  })
}

export const sysDictDataExport = api.sysDictData + '/export'
