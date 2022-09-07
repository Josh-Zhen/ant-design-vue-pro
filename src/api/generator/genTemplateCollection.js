import request from '@/utils/request'

const api = {
  genTemplateCollection: '/genTemplateCollection'
}

/**
 * 分页查询模板组
 */
export function getGenTemplateCollectionPageList (parameter) {
  return request({
    url: api.genTemplateCollection + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存模板组
 */
export function saveGenTemplateCollection (parameter) {
  return request({
    url: api.genTemplateCollection + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除模板组
 */
export function delGenTemplateCollection (parameter) {
  return request({
    url: api.genTemplateCollection + '/delete',
    method: 'post',
    params: parameter
  })
}

/**
 * 獲取模板组
 */
export function getCollectionName () {
  return request({
    url: api.genTemplateCollection + '/getCollectionName',
    method: 'get'
  })
}

/**
 * 獲取模板组
 */
export function getCollection () {
  return request({
    url: api.genTemplateCollection + '/getTemplateCollection',
    method: 'get'
  })
}
