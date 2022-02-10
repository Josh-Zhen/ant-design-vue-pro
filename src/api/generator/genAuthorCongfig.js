import request from '@/utils/request'

const api = {
  genAuthorConfig: '/genAuthorConfig'
}

/**
 * 分页查询作者
 */
export function getGenAuthorConfigPageList (parameter) {
  return request({
    url: api.genAuthorConfig + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存作者
 */
export function saveGenAuthorConfig (parameter) {
  return request({
    url: api.genAuthorConfig + (parameter.id > 0 ? '/update' : '/save'),
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
export function delGenAuthorConfig (parameter) {
  return request({
    url: api.genAuthorConfig + '/delete',
    method: 'post',
    params: parameter
  })
}

/**
 * 獲取公、私鑰
 */
export function getKeys () {
  return request({
    url: api.genAuthorConfig + '/generateKeys',
    method: 'get'
  })
}
