import request from '@/utils/request'

const api = {
  genDb: '/genConfig'
}

/**
 * 分页查询作者
 */
export function getGenConfigPageList (parameter) {
  return request({
    url: api.genDb + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存作者
 */
export function saveGenConfig (parameter) {
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
 * 删除作者
 */
export function delGenConfig (parameter) {
  return request({
    url: api.genDb + '/delete',
    method: 'post',
    params: parameter
  })
}
