import { action, computed, observable } from 'mobx'

import { url, apiKey } from '../../credentials.json'

export default class ForecastStore {
  @observable location = 'philadelphia'
  @observable geohash
  @observable forecast = 'sunny'

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

  getLocation() {
    return this.getRequest(`search/v1/locations/?q=${this.location}`)
  }

  getForecast() {
    if (typeof this.geohash !== undefined) {
      return this.getRequest(`forecasts/v1/grid/three-hourly/${this.geohash}/icons`)
    }
  }

  phillycast(precis){
    let phillycast = precis

    if (precis.substring(precis.length - 1) !== 'y'){
      phillycast = `${precis}y`
    }

    return phillycast.toLowerCase()
  }

  @action setLocation(location){
    this.location = location.name
    this.geohash = location.geohash
  }

  @action setForecast(forecast){
    // @todo make this use the current forecast, and not just the first grid entry
    this.forecast = this.phillycast(forecast[0].value)
  }

  @action updateForecast() {
    this.getLocation().then(
      (location) => {
        if(typeof location !== 'undefined' && location.length > 0){
          this.setLocation({...location[0].attributes })
          this.getForecast().then(
            (forecasts) => this.setForecast({forecast: {...forecasts.attributes.icon_descriptor.forecast_data }})
          )
        }
      }
    )
  }
}
