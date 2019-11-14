import { axios } from '@/utils/request'

const weatherApi = {
  weatherList: '/weather/weatherListData',
  weatherCityData: '/weather/weatherCityData',
  delUserWeather: '/weather/delUserWeather',
  addUserWeather: '/weather/addUserWeather'
}

export default weatherApi

export function getWeatherList (parameter) {
  return axios({
    url: weatherApi.weatherList,
    method: 'get',
    params: parameter
  })
}

export function weatherCityData (parameter) {
  return axios({
    url: weatherApi.weatherCityData,
    method: 'get',
    params: parameter
  })
}

export function delUserWeather (ids, parameter) {
  return axios({
    url: weatherApi.delUserWeather + `/${ids}`,
    method: 'delete',
    data: parameter
  })
}

export function addUserWeather (parameter) {
  return axios({
    url: weatherApi.addUserWeather,
    method: 'post',
    data: parameter
  })
}
