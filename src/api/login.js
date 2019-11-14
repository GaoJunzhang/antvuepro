import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getInfo () {
  return axios({
    url: '/user/info',
    method: 'get'
  })
}
