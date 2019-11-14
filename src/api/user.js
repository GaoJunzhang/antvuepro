import { axios } from '@/utils/request'

const userApi = {
  getUserList: '/user/userListData',
  saveUser: '/user/saveUser',
  delUser: '/user/delUser',
  user: '/user/userDetail',
  changePassword: '/user/changePassword',
  resetPassword: '/user/resetPassword'
}

export default userApi

export function getUserList (parameter) {
  return axios({
    url: userApi.getUserList,
    method: 'get',
    params: parameter
  })
}

export function saveUser (parameter) {
  return axios({
    url: userApi.saveUser,
    method: 'post',
    data: parameter
  })
}

export function user (id, parameter) {
  return axios({
    url: userApi.user + `/${id}`,
    method: 'get',
    data: parameter
  })
}

export function delUser (ids, parameter) {
  return axios({
    url: userApi.delUser + `/${ids}`,
    method: 'delete',
    data: parameter
  })
}

export function resetPassword (parameter) {
  return axios({
    url: userApi.resetPassword,
    method: 'post',
    data: parameter
  })
}

export function changePassword (parameter) {
  return axios({
    url: userApi.changePassword,
    method: 'post',
    data: parameter
  })
}
