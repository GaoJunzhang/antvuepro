import { axios } from '@/utils/request'
const terminalExpandApi = {
  terminalExpandByTid: '/terminalExpand/terminalExpandByTid',
  saveTerminalExpand: '/terminalExpand/saveTerminalExpand'
}

export default terminalExpandApi

export function terminalExpandByTid (id) {
  return axios({
    url: terminalExpandApi.terminalExpandByTid + `/${id}`,
    method: 'get'
  })
}

export function saveTerminalExpand (parameter) {
  return axios({
    url: terminalExpandApi.saveTerminalExpand,
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
