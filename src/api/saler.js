import { axios } from '@/utils/request'
const industryApi = {
  getSalerData: '/saler/getSalerData',
  saveSaler: '/saler/saveSaler',
  delSaler: '/saler/delSaler'
}

export default industryApi

export function getSalerData (parameter) {
  return axios({
    url: industryApi.getSalerData,
    method: 'get',
    params: parameter
  })
}

export function saveSaler (parameter) {
  return axios({
    url: industryApi.saveSaler,
    method: 'post',
    data: parameter,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}

export function delSaler (ids, parameter) {
  return axios({
    url: industryApi.delSaler + `/${ids}`,
    method: `delete`,
    params: parameter
  })
}
