import { action, computed, observable } from 'mobx'

import { url, apiKey } from '../credentials.json'

const defaultStrings = {
  its: 'it\'s',
  always: 'always',
  in: 'in'
}

const defaultBackgroundColour = '#F2E936'
const defaultTextColour = '#111111'

export default class ForecastStore {
  easterEggs = require('./easterEggs.json')

  constructor() {
    // alias some eggs.
    this.easterEggs.philly = this.easterEggs['philadelphia']
    this.easterEggs.shitty = this.easterEggs['ankh morpork']
  }

  @observable strings = {...defaultStrings}
  @observable location = { name: 'philadelphia' }
  @observable locationOptions = []
  @observable geohash
  @observable forecast = 'sunny'
  @observable easterEgg = false
  @observable backgroundColour = defaultBackgroundColour
  @observable textColour = defaultTextColour

  @computed get multipleLocations() {
    if ( this.locationOptions.length > 0 ) {
      return true
    }
    return false
  }

  @computed get place() {
    return this.location.name
  }

  @computed get weather() {
    if(this.easterEgg) {
      return this.forecast
    }

    let phillycast = this.forecast

    if (this.forecast.substring(this.forecast.length - 1) !== 'y'){
      phillycast = `${this.forecast}y`
    }

    // there's always one...
    if (phillycast === 'Fogy') {
      phillycast = 'Foggy'
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

  @action findLocation(query) {
    this.forecast = 'search'
    console.info(`[findLocation]: ${query}`)

    this.clearSearch()

    // check easterEggs first.
    if( typeof this.easterEggs[query] !== 'undefined' ){
      this.setEasterEgg(this.easterEggs[query])
      this.easterEgg = true
      return
    }

    this.itsNotEasterAnymore()

    this.getRequest(`search/v1/locations/?q=${query}`).then(
      (locations) => {
        if(typeof locations !== 'undefined' && locations.length > 0){
          switch( locations.length ){
            case 1 : {
              this.setLocation({...locations[0].attributes })
              break;
            }
            default : {
              this.setLocation({...locations[0].attributes })
              this.setLocationOptions(locations)
            }
          }
        } else {
            // no matches
            this.setLocationFailed(query)
        }
      }
    )
  }

  getForecast() {
    if (typeof this.geohash !== undefined) {
      return this.getRequest(`forecasts/v1/grid/three-hourly/${this.location.geohash}/icons`)
    }
  }

  @action clearSearch(){
    this.locationOptions = []
  }

  @action setLocationOptions(locations) {
    this.locationOptions = locations
  }

  @action setLocation(location){
    this.location = {...location}
    // location changed, so trigger a forecast update
    this.updateForecast()
  }

  @action setLocationFailed(location) {
    this.forecast = 'really'
    this.strings = {...defaultStrings, always: 'never anything'}
  }

  @action setForecast(forecast){
    // @todo make this use the current forecast, and not just the first grid entry
    this.forecast = forecast.forecast[0].value
  }

  @action updateForecast() {
    this.getForecast().then(
      (forecasts) => this.setForecast({forecast: {...forecasts.attributes.icon_descriptor.forecast_data }})
    )
  }

  @action setEasterEgg(egg) {
    console.info(`[easterEgg!]: ${JSON.stringify(egg)}`)
    this.location.name = egg.location
    this.forecast = egg.forecast
    if(typeof egg.strings !== undefined) {
      this.strings = {...defaultStrings, ...egg.strings}
    }
    if(typeof egg.backgroundColour === 'undefined'){
      this.backgroundColour = defaultBackgroundColour
    } else {
      this.backgroundColour = egg.backgroundColour
    }
    if(typeof egg.textColour === 'undefined'){
      this.textColour = defaultTextColour
    } else {
      this.textColour = egg.textColour
    }
  }

  @action itsNotEasterAnymore() {
    this.easterEgg = false
    this.strings = {...defaultStrings}
    this.backgroundColour = defaultBackgroundColour
    this.textColour = defaultTextColour
  }
}
