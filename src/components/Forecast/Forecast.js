import React, { Component } from 'react'

import { url, apiKey } from '../../credentials.json'

export default class Forecast extends Component {

  constructor() {
    super()
    this.state = {
      forecast: [
        {value: 'something'},
      ],
      location: {
        name: 'hobart'
      }
    }
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

  getLocation() {
    return this.getRequest(`search/v1/locations/?q=${this.state.location.name}`)
  }

  async getForecast() {
    if (typeof this.state.location.geohash !== undefined) {
      return this.getRequest(`forecasts/v1/grid/three-hourly/${this.state.location.geohash}/icons`)
    }
  }

  componentDidMount() {
    this.getLocation().then(
      (location) => {
        this.setState({location: {...location[0].attributes }})
        this.getForecast().then(
          (forecasts) => this.setState({forecast: {...forecasts.attributes.icon_descriptor.forecast_data }})
        )
      }
    )
  }

  phillycast(precis){
    let phillycast = precis

    if (precis.substring(precis.length - 1) !== 'y'){
      phillycast = `${precis}y`
    }

    return phillycast.toLowerCase()
  }

  render() {
    const weather = this.phillycast(this.state.forecast[0].value)
    const place = this.state.location.name

    return (
      <section>
        <h1 style={{
          fontSize: '72px',
          fontWeight: '700',
          lineHeight: '90px',
          color: `black`,
          textTransform: `uppercase`
        }}>
          <div style={{ position: 'relative', top: '20px', left: '-50px', transform: 'rotateZ(5deg)'}}>It&rsquo;s</div>
          <div style={{ fontSize: '108px'}}>always</div>
          <div><span style={{ display: 'inline-block', fontSize: '128px', transform: 'rotateZ(-2deg)'}}>{weather}</span>
          <span> in</span></div>
          <div style={{ position: 'relative', top: '-30px'}}><span spellCheck='false' contentEditable>{place}</span>!</div>
        </h1>
      </section>
    )
  }
}
