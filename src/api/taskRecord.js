import { axios } from '@/utils/request'

const taskRecordApi = {
  getTaskRecordList: '/taskRecord/taskRecordListData',
  taskRecordMedias: '/taskRecord/taskRecordMedias',
  taskRecordTerminals: '/taskRecord/taskRecordTerminals'
}

export default taskRecordApi

export function getTaskRecordList (parameter) {
  return axios({
    url: taskRecordApi.getTaskRecordList,
    method: 'get',
    params: parameter
  })
}

export function taskRecordMedias (parameter) {
  return axios({
    url: taskRecordApi.taskRecordMedias,
    method: 'get',
    params: parameter
  })
}

export function taskRecordTerminals (parameter) {
  return axios({
    url: taskRecordApi.taskRecordTerminals,
    method: 'get',
    params: parameter
  })
}
