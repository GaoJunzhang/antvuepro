import { axios } from '@/utils/request'
const terminalApi = {
  terminalData: '/terminal/terminalData',
  renameTerminal: '/terminal/rename',
  updateTgroup: '/terminal/updateTgroup',
  exportTerminal: '/terminal/exportTerminal'
}

export default terminalApi

export function terminalData (parameter) {
  return axios({
    url: terminalApi.terminalData,
    method: 'get',
    params: parameter
  })
}

export function renameTerminal (parameter) {
  return axios({
    url: terminalApi.renameTerminal,
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

export function updateTgroup (parameter) {
  return axios({
    url: terminalApi.updateTgroup,
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

export function exportTerminal (parameter) {
  return axios({
    url: terminalApi.exportTerminal,
    method: 'get',
    params: parameter
  })
}
