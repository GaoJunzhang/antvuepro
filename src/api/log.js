import { axios } from '@/utils/request'
const logApi = {
  getLogData: '/operationLog/getLogData'
}

export function getLogData (parameter) {
  return axios({
    url: logApi.getLogData,
    method: 'get',
    params: parameter
  })
}
