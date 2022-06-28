import request from '@/utils/request'

const api = {
  genTemplateConfig: '/genTemplateConfig'
}

/**
 * 分页查询模板配置
 */
export function getGenTemplateConfigPageList (parameter) {
  return request({
    url: api.genTemplateConfig + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存模板配置
 */
export function saveGenTemplateConfig (parameter) {
  return request({
    url: api.genTemplateConfig + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除模板配置
 */
export function delGenTemplateConfig (parameter) {
  return request({
    url: api.genTemplateConfig + '/delete',
    method: 'post',
    params: parameter
  })
}
