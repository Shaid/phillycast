import { action, computed, observable } from 'mobx'

import { url } from '../credentials.json'
import { isFunction } from 'util';

const defaultStrings = {
  its: 'it\'s',
  always: 'always',
  in: 'in'
}

const defaultBackgroundColour = '#F2E936'
const defaultForegroundColour = '#000000'

export default class ForecastStore {
  easterEggs = {
    'ankh morpork': {
      location: 'ankh morpork',
      forecast: 'shitty',
      backgroundColour: '#bf6403',
    },
    'home': {
      location: 'home',
      forecast: 'place',
      strings: {its: 'there', always: 'is no', in: 'like'},
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
      strings: {in: 'at'},
    },
    'philadelphia': {
      location: 'philadelphia',
      forecast: 'sunny',
    },
    'recursion': {
      location: 'recursion?',
      forecast: 'mean',
      strings: {its: 'did', always: 'you', in: ''}
    },
    'tardis': {
      location: 'tardis',
      forecast: 'the inside',
      strings: {always: 'bigger on', in: 'in the'},
      backgroundColour: '#003D67',
      foregroundColour: '#fafafa',
    },
    'time': {
      location: 'time',
      forecast: 'timey-wimey',
      strings: {always: 'wibbely-wobbely', in: 'stuff,'},
      backgroundColour: '#003D67',
      foregroundColour: '#fafafa',
    },
    'turtles': {
      location: 'turtles',
      forecast: 'down',
      strings: {its: 'all', always: 'the way', in: 'it\'s'},
      backgroundColour: '#9FC740',
      foregroundColour: '#fafafa',
    },
    'winterfell': {
      location: 'Winterfell',
      forecast: 'coming',
      strings: {its: 'winter', always: 'is always'},
      backgroundColour: '#44acc9',
    },
  }

  @observable strings = {...defaultStrings}
  @observable location = { name: 'philadelphia' }
  @observable geohash
  @observable forecast = { icon_descriptor: 'sunny' }
  @observable easterEgg = false
  @observable backgroundColour = defaultBackgroundColour
  @observable foregroundColour = defaultForegroundColour


  @computed get place() {
    return this.location.name
  }

  @computed get weather() {
    if(this.easterEgg) {
      return this.forecast
    }

    const { icon_descriptor }  = this.forecast

    let phillycast = icon_descriptor
    
    if (phillycast && isFunction(phillycast.substring) && phillycast.substring(phillycast.length - 1) !== 'y'){
      phillycast = `${phillycast}y`

      // there's always one...
      if (phillycast === 'Fogy') {
        phillycast = 'Foggy'
      }
    }

    return phillycast
  }

  async getRequest(uri) {
    const headers = new Headers()

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
    this.forecast = { icon_descriptor: 'search' }
    console.info(`[findLocation]: ${query}`)

    // check easterEggs first.
    if( typeof this.easterEggs[query] !== 'undefined' ){
      this.setEasterEgg(this.easterEggs[query])
      this.easterEgg = true
      return
    }

    this.itsNotEasterAnymore()

    this.getRequest(`v1/locations?search=${query}`).then(
      (locations) => {
        if(typeof locations !== 'undefined' && locations.length > 0){
          switch( locations.length ){
            case 1 : {
              this.setLocation({...locations[0] })
              break;
            }
            default : {
              this.setLocation({...locations[0] })
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
      return this.getRequest(`v1/locations/${this.location.geohash.substring(0, 6)}/forecasts/daily`)
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
    this.forecast = forecast
  }

  @action updateForecast() {
    this.getForecast().then(
      (forecasts) => {
        this.setForecast(forecasts[0])
      }
    )
  }

  @action setEasterEgg(egg) {
    console.info(`[easterEgg!]: ${JSON.stringify(egg)}`)
    this.location.name = egg.location
    this.forecast = egg.forecast
    if(typeof egg.strings !== undefined) {
      this.strings = {...defaultStrings, ...egg.strings}
    }
    
    this.backgroundColour = egg.backgroundColour ? egg.backgroundColour : defaultBackgroundColour
    this.foregroundColour = egg.foregroundColour ? egg.foregroundColour : defaultForegroundColour

    /*
    if(typeof egg.backgroundColour === 'undefined'){
      this.backgroundColour = defaultBackgroundColour
    } else {
      this.backgroundColour = egg.backgroundColour
    }*/

  }

  @action itsNotEasterAnymore() {
    this.easterEgg = false
    this.strings = {...defaultStrings}
    this.backgroundColour = defaultBackgroundColour
    this.foregroundColour = defaultForegroundColour
  }
}
