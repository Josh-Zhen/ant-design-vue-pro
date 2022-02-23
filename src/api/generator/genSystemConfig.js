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
