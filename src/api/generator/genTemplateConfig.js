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

/**
 * 预览模板
 */
export function preview (tableId) {
  return request({
    url: api.genTemplateConfig + '/preview/' + `${tableId}`,
    method: 'get'
  })
}

/**
 * 生成代碼
 */
export function generator (parameter) {
  request({
    url: api.genTemplateConfig + '/export',
    method: 'get',
    params: parameter,
    responseType: 'blob'
  }).then(res => {
    resolveBlob(res)
  })
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 */
export function resolveBlob (res) {
  const blob = new Blob([res.data], { type: 'application/zip' })
  // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const path = new RegExp('filename=([^;]+\\.[^.;]+);*')
  const contentDisposition = decodeURI(res.headers['content-disposition'])
  const result = path.exec(contentDisposition)

  // 創建標簽
  const a = window.document.createElement('a')
  a.href = window.URL.createObjectURL(blob)
  a.download = result[1]
  a.click()
  // 釋放對象
  window.URL.revokeObjectURL(a.href)
}
