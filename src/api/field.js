import { axios } from '@/utils/request'

const fieldApi = {
  fieldListData: '/field/fieldListData',
  saveField: '/field/saveField',
  saveTerField: '/field/saveTerField',
  delField: '/field/delField',
  fieldList: '/field/fieldList'
}

export default fieldApi

export function fieldListData (parameter) {
  return axios({
    url: fieldApi.fieldListData,
    method: 'get',
    params: parameter
  })
}

export function fieldList (parameter) {
  return axios({
    url: fieldApi.fieldList,
    method: 'get',
    params: parameter
  })
}

export function saveField (parameter) {
  return axios({
    url: fieldApi.saveField,
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

export function saveTerField (parameter) {
  return axios({
    url: fieldApi.saveTerField,
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

export function delField (parameter) {
  return axios({
    url: fieldApi.delField + `/${parameter}`,
    method: 'delete',
    data: parameter
  })
}
