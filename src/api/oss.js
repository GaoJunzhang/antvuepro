import { axios } from '@/utils/request'
const ossApi = {
  uploadOss: '/mps/oss/uploadOss',
  uploadAvatar: '/mps/oss/uploadAvatar',
  deleteOss: '/oss/delete'
}

export default ossApi

export function deleteOss (parameter) {
  return axios({
    url: ossApi.deleteOss,
    method: `delete`,
    params: parameter
  })
}
export const uploadOss = ossApi.uploadOss
export const uploadAvatar = ossApi.uploadAvatar
