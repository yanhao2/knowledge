import axios from 'axios'
import store from '../store'
import Cookies from "js-cookie"
const token = Cookies.get("permission");
axios.defaults.timeout = 60000 // timeout in 10 seconds.
axios.defaults.baseURL = store.state.urlApi

export default {
  send (method, uri, data, headers, record) {
    return new Promise((resolve, reject) => {
      try {
        axios({
          method: method,
          url: uri,
          data: data,
          params: method === 'POST'  || method === 'PUT'  ? '' : data,
          headers: headers
        })
          .then(response => {
            if (response.status === 200) {
              resolve(response.data)
            }
          })
          .catch((error) => {
            console.error(error)
            reject(new Error('Communication exception, please check the network or retry later.'))
          })
      } catch (e) {
        console.error(`Exception: ${e}`)
        reject(e)
      }
    })
  },
  // 处理headers 头部
  headersFun (method, uri, data, record) {
    let headers = {}
    headers['Authorization'] = `bearer` + ' ' + (token || '')
    if (method === 'POST') {
      headers['Content-Type'] = 'application/json;charset=utf-8'
      data = JSON.stringify(data)
    }
    return this.send(method, uri, data, headers, record)
  },
  // 自媒体 列表数据
  MediaTableList (data) {
    return this.headersFun('POST', `/manager/commonEsData`, data)
  },
  // 获取自媒体平台字典接口
  MediaPlatformList (data) {
    return this.headersFun('POST', `/vsMedia/upload`, data)
  },
  // 获取自媒体行业字典接口
  MediaIndustryList (data) {
    return this.headersFun('POST', `/manager/addOrUpdateDictData`, data)
  },
  // 获取地域字典接口
  MediaAreaList (data) {
    return this.headersFun('GET', `/manager/getRegionListByPid/${data}`)
  },
  // 获取标签字典接口
  MediaLabelList (data) {
    return this.headersFun('POST', `/manager/addOrUpdateDictData`, data)
  },
  // 获取自媒体号、自媒体联盟字典接口
  MediaNumberList (data) {
    return this.headersFun('POST', `/manager/addOrUpdateDictData`, data)
  },
  // 获取详情
  MediaDetailsItem (data) {
    return this.headersFun('POST', `/manager/commonEsDataId`, data)
  },
  // 获取添加编辑详情
  MediaAddEditItem (data) {
    return this.headersFun('POST', `/manager/addCommonEsData`, data)
  },
  // 获取最后操作人
  MediaLastList (data) {
    return this.headersFun('GET', `/manager/getAllPlatUser?code=${data}`)
  },
  // 删除table 表格数据
  MediaDeteleList (data) {
    return this.headersFun('POST', `/manager/deleteCommonEsData`, data)
  },
  // 认证类型
  MediaAuthenticationTypeList (data) {
    return this.headersFun('POST', `/manager/addOrUpdateDictData`, data)
  },
  // 批量审核
  MediaReviewList (data) {
    return this.headersFun('POST', `/manager/stateCommonEsData`, data)
  },
  // 操作日志
  MediaOperationLogList (data) {
    return this.headersFun('GET', `/manager/operLogDataByCode`, data)
  },
  // 情感词列表
  EmotionalList (data) {
    return this.headersFun('GET', `/RwNlpAffective`, data)
  },
  // 添加情感词
  EmotionalAdd (data) {
    return this.headersFun('POST', `/RwNlpAffective`, data)
  },
  // 编辑情感词
  EmotionalEdit (data) {
    return this.headersFun('PUT', `/RwNlpAffective/${data.id}`, data)
  }
}
