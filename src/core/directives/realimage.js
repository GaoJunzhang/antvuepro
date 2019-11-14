import Vue from 'vue'
import { imageIsExist } from '@/utils/img'

const realImg = Vue.directive('real-img', async function (el, binding) {
  const imgURL = binding.value
  const defaultURL = el.getAttribute('default-img')
  if (imgURL) {
    const exist = await imageIsExist(imgURL)
    if (exist) {
      el.setAttribute('src', imgURL)
    } else {
      if (defaultURL) {
        el.setAttribute('src', defaultURL)
      }
    }
  }
})

export default realImg
