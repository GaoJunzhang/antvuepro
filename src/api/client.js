import { axios } from '@/utils/request'
const clientApi = {
  getClientData: '/client/getClientData',
  saveClient: '/client/saveClient',
  delClient: '/client/delClient'
}

export default clientApi

export function getClientData (parameter) {
  return axios({
    url: clientApi.getClientData,
    method: 'get',
    params: parameter
  })
}

export function saveClient (parameter) {
  return axios({
    url: clientApi.saveClient,
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

export function delClient (ids, parameter) {
  return axios({
    url: clientApi.delClient + `/${ids}`,
    method: `delete`,
    params: parameter
  })
}
