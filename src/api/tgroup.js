import { axios } from '@/utils/request'

const tgroupApi = {
  getTgroupList: '/tgroup/tgroupListData',
  tgroupData: '/tgroup/tgroupData',
  getTgroupByName: '/tgroup/tgroupByName',
  getTgroupById: '/tgroup/getTgroupById',
  tgroupById: '/tgroup/tgroupById',
  saveTgroup: '/tgroup/saveTgroup',
  delTgroup: '/tgroup/delByIds',
  getAuhtSelectData: '/tgroup/getAuhtSelectData'
}

export default tgroupApi

export function getTgroupList (parameter) {
  return axios({
    url: tgroupApi.getTgroupList,
    method: 'get',
    params: parameter
  })
}
export function tgroupData (parameter) {
  return axios({
    url: tgroupApi.tgroupData,
    method: 'get',
    params: parameter
  })
}

export function getTgroupByName (parameter) {
  return axios({
    url: tgroupApi.getTgroupByName,
    method: 'get',
    params: parameter
  })
}

export function getTgroupById (id) {
  return axios({
    url: tgroupApi.getTgroupById + `/${id}`,
    method: 'get'
  })
}

export function tgroupById (parameter) {
  return axios({
    url: tgroupApi.tgroupById,
    method: 'get',
    params: parameter
  })
}

export function saveTgroup (parameter) {
  return axios({
    url: tgroupApi.saveTgroup,
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

export function delTgroup (parameter) {
  return axios({
    url: tgroupApi.delTgroup + `/${parameter}`,
    method: 'delete',
    data: parameter
  })
}

export function getAuhtSelectData (parameter) {
  return axios({
    url: tgroupApi.getAuhtSelectData,
    method: 'get',
    params: parameter
  })
}
