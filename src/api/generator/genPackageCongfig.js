import request from '@/utils/request'

const api = {
  genPackageConfig: '/genPackageConfig'
}

/**
 * 分页查询包配置
 */
export function getGenPackageConfigPageList (parameter) {
  return request({
    url: api.genPackageConfig + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存包配置
 */
export function saveGenPackageConfig (parameter) {
  return request({
    url: api.genPackageConfig + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除包配置
 */
export function delGenPackageConfig (parameter) {
  return request({
    url: api.genPackageConfig + '/delete',
    method: 'post',
    params: parameter
  })
}
