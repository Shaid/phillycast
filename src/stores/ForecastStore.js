import { action, computed, observable } from 'mobx'

import { url, apiKey } from '../credentials.json'

export default class ForecastStore {
  @observable location = { name: 'philadelphia' }
  @observable geohash
  @observable forecast = 'sunny'

  @computed get place() {
    return this.location.name
  }

  @computed get weather() {
    let phillycast = this.forecast

    if (this.forecast.substring(this.forecast.length - 1) !== 'y'){
      phillycast = `${this.forecast}y`
    }

    return phillycast.toLowerCase()
  }

  async getRequest(uri) {
    const headers = new Headers()
    headers.append('X-Api-Key', apiKey)

    const request = await (
      await (fetch(`${url}${uri}`, { headers: headers })
      .then((response) => {
        return response.json()
      })).then((result) => {
        return result.data
      })
    )

    return request
  }

  findLocation(query) {
    this.getRequest(`search/v1/locations/?q=${query}`).then(
      (location) => {
        console.log(location)
        if(typeof location !== 'undefined' && location.length > 0){
          this.setLocation({...location[0].attributes })
        }
      }
    )
  }

  getForecast() {
    if (typeof this.geohash !== undefined) {
      return this.getRequest(`forecasts/v1/grid/three-hourly/${this.location.geohash}/icons`)
    }
  }

  @action setLocation(location){
    console.log(location)
    this.location = {...location}
    // location changed, so trigger a forecast updateLocation
    this.updateForecast()
  }

  @action setForecast(forecast){
    // @todo make this use the current forecast, and not just the first grid entry
    console.log(forecast)
    this.forecast = forecast.forecast[0].value
  }

  @action updateLocation() {
    this.getLocation().then(

    )
  }

  @action updateForecast() {
    this.getForecast().then(
      (forecasts) => this.setForecast({forecast: {...forecasts.attributes.icon_descriptor.forecast_data }})
    )
  }
}
