import request from '@/utils/request'

/**
* 键值映射
*/
const api = {
  genFieldMapping: '/fieldMapping'
}

/**
* 分页查询键值映射
*/
export function getGenFieldMappingPageList (parameter) {
  return request({
    url: api.genFieldMapping + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
* 修改/保存键值映射
*/
export function saveGenFieldMapping (parameter) {
  return request({
    url: api.genFieldMapping + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
* 批量删除键值映射
*/
export function delGenFieldMapping (parameter) {
  return request({
    url: api.genFieldMapping + '/delete',
    method: 'post',
    params: parameter
  })
}
