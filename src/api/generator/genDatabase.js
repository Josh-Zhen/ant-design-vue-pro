import request from '@/utils/request'

const api = {
  genDatabase: '/genDatabase'
}

/**
 * 分页查询数据库配置
 */
export function getGenDatabasePageList (parameter) {
  return request({
    url: api.genDatabase + '/pageList',
    method: 'get',
    params: parameter
  })
}

/**
 * 修改/保存数据库配置
 */
export function saveGenDatabase (parameter) {
  return request({
    url: api.genDatabase + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除数据库配置
 */
export function delGenDatabase (parameter) {
  return request({
    url: api.genDatabase + '/delete',
    method: 'post',
    params: parameter
  })
}

/**
 * 获取數據庫名稱字典
 */
export function DictTypeDropDown () {
  return request({
    url: api.genDatabase + '/dropDown',
    method: 'get'
  })
}
