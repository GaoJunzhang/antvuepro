import { axios } from '@/utils/request'
const industryApi = {
  getIndustryData: '/industry/getIndustryData',
  saveIndustry: '/industry/saveIndustry',
  delIndustry: '/industry/delIndustry',
  getIndustryList: '/industry/getIndustryList'
}

export default industryApi

export function getIndustryData (parameter) {
  return axios({
    url: industryApi.getIndustryData,
    method: 'get',
    params: parameter
  })
}

export function saveIndustry (parameter) {
  return axios({
    url: industryApi.saveIndustry,
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

export function delIndustry (ids, parameter) {
  return axios({
    url: industryApi.delIndustry + `/${ids}`,
    method: `delete`,
    params: parameter
  })
}

export function getIndustryList (parameter) {
  return axios({
    url: industryApi.getIndustryList,
    method: 'get',
    params: parameter
  })
}
