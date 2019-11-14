import { axios } from '@/utils/request'

const cmdApi = {
  getCmdStatus: '/cmd/cmdStatus',
  reboot: '/cmd/reboot',
  setTime: '/cmd/setTime',
  getTime: '/cmd/getTime',
  setOnOff: '/cmd/setOnOff',
  getOnOff: '/cmd/getOnOff',
  setServer: '/cmd/setServer',
  getServer: '/cmd/getServer',
  sendTask: '/cmd/sendTask',
  sendDefaultTask: '/cmd/sendDefaultTask',
  setCity: '/cmd/setCity',
  getCity: '/cmd/getCity',
  sendUpgrade: '/cmd/sendUpgrade',
  checkTask: '/cmd/checkTask',
  selfCmd: '/cmd/selfCmd'
}

export default cmdApi

export function getCmdStatus (parameter) {
  return axios({
    url: cmdApi.getCmdStatus,
    method: 'get',
    params: parameter
  })
}

export function reboot (parameter) {
  return axios({
    url: cmdApi.reboot,
    method: 'post',
    data: parameter
  })
}

export function setTime (parameter) {
  return axios({
    url: cmdApi.setTime,
    method: 'post',
    data: parameter
  })
}

export function getTime (parameter) {
  return axios({
    url: cmdApi.getTime,
    method: 'get',
    params: parameter
  })
}

export function setOnOff (parameter) {
  return axios({
    url: cmdApi.setOnOff,
    method: 'post',
    data: parameter
  })
}

export function getOnOff (parameter) {
  return axios({
    url: cmdApi.getOnOff,
    method: 'get',
    params: parameter
  })
}

export function setServer (parameter) {
  return axios({
    url: cmdApi.setServer,
    method: 'post',
    data: parameter
  })
}

export function getServer (parameter) {
  return axios({
    url: cmdApi.getServer,
    method: 'get',
    params: parameter
  })
}

export function sendTask (parameter) {
  return axios({
    url: cmdApi.sendTask,
    method: 'post',
    data: parameter
  })
}

export function sendDefaultTask (parameter) {
  return axios({
    url: cmdApi.sendDefaultTask,
    method: 'get',
    params: parameter
  })
}

export function setCity (parameter) {
  return axios({
    url: cmdApi.setCity,
    method: 'post',
    data: parameter
  })
}

export function getCity (parameter) {
  return axios({
    url: cmdApi.getCity,
    method: 'get',
    params: parameter
  })
}

export function sendUpgrade (parameter) {
  return axios({
    url: cmdApi.sendUpgrade,
    method: 'post',
    data: parameter
  })
}

export function checkTask (parameter) {
  return axios({
    url: cmdApi.checkTask,
    method: 'get',
    params: parameter
  })
}

export function selfCmd (parameter) {
  return axios({
    url: cmdApi.selfCmd,
    method: 'get',
    params: parameter
  })
}
