import request from '@/utils/request'

const api = {
  genSystemConfig: '/genSystemConfig'
}

/**
 * 獲取公、私鑰
 */
export function refreshKey () {
  return request({
    url: api.genSystemConfig + '/refreshKey',
    method: 'get'
  })
}

/**
 * 設置密鑰
 */
export function setSalt (parameter) {
  return request({
    url: api.genSystemConfig + '/setSalt',
    method: 'post',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
