import { action, computed, observable } from 'mobx'

import { url, apiKey } from '../credentials.json'

const defaultStrings = {
  its: 'it\'s',
  always: 'always',
  in: 'in'
}

const defaultBackgroundColour = '#F2E936'

export default class ForecastStore {
  easterEggs = {
    'winterfell': {
      location: 'Winterfell',
      forecast: 'coming',
      strings: {...this.strings, its: 'winter', always: 'is always'},
      backgroundColour: '#44acc9',

    },
    'mordor': {
      location: 'Mordor',
      forecast: 'simply walk ',
      strings: {its: 'one', always: 'does not', in: 'into'},
      backgroundColour: '#c40006',
    },
    'my house' : {
      location: 'My house',
      forecast: 'rockin',
      strings: {...this.strings, in: 'at'},
    },
    'home': {
      location: 'home',
      forecast: 'place',
      strings: {its: 'there', always: 'is no', in: 'like'},
    },
  }

  @observable strings = {...defaultStrings}
  @observable location = { name: 'philadelphia' }
  @observable geohash
  @observable forecast = 'sunny'
  @observable easterEgg = false
  @observable backgroundColour = defaultBackgroundColour

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
              //this.setLocationOptions(locations)
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
    this.strings = {...egg.strings}
    if(typeof egg.backgroundColour === 'undefined'){
      this.backgroundColour = defaultBackgroundColour
    } else {
      this.backgroundColour = egg.backgroundColour
    }
  }

  @action itsNotEasterAnymore() {
    this.easterEgg = false
    this.strings = {...defaultStrings}
    this.backgroundColour = defaultBackgroundColour
  }
}
