import { axios } from '@/utils/request'

const projectApi = {
  getProjectList: '/project/projectListData',
  delProject: '/project/delProject',
  auditProject: '/project/auditProject',
  auditProjectRecords: '/project/auditProjectRecords',
  saveProject: '/project/saveProject',
  project: '/project/project',
  projectMedias: '/project/projectMedias',
  projectTerminals: '/project/projectTerminals',
  uploadTerminals: '/mps/project/uploadTerminals',
  projectSchedulingList: '/project/projectSchedulingListData',
  exportVacancy: '/project/exportVacancy'
}

export default projectApi

export function getProjectList (parameter) {
  return axios({
    url: projectApi.getProjectList,
    method: 'get',
    params: parameter
  })
}

export function delProject (ids, parameter) {
  return axios({
    url: projectApi.delProject + `/${ids}`,
    method: 'delete',
    data: parameter
  })
}

export function auditProject (parameter) {
  return axios({
    url: projectApi.auditProject,
    method: 'post',
    data: parameter
  })
}

export function auditProjectRecords (id) {
  return axios({
    url: projectApi.auditProjectRecords + `/${id}`,
    method: 'get'
  })
}

export function saveProject (parameter) {
  return axios({
    url: projectApi.saveProject,
    method: 'post',
    data: parameter
  })
}

export function project (id, parameter) {
  return axios({
    url: projectApi.project + `/${id}`,
    method: 'get',
    data: parameter
  })
}

export function getProjectMedias (id, parameter) {
  return axios({
    url: projectApi.projectMedias + `/${id}`,
    method: 'get',
    data: parameter
  })
}

export function getProjectTerminals (id, parameter) {
  return axios({
    url: projectApi.projectTerminals + `/${id}`,
    method: 'get',
    data: parameter
  })
}

export const uploadTerminals = projectApi.uploadTerminals

export function projectSchedulingList (parameter) {
  return axios({
    url: projectApi.projectSchedulingList,
    method: 'get',
    params: parameter
  })
}

export function exportVacancy (parameter) {
  return axios({
    url: projectApi.exportVacancy,
    method: 'get',
    params: parameter
  })
}
