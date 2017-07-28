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
        name: 'greenvale vic'
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
    return precis.toLowerCase()
  }

  render() {
    const weather = this.phillycast(this.state.forecast[0].value)
    const place = this.state.location.name

    return (
      <section>
        <h1 style={{
          fontSize: '100px',
          fontWeight: '700',
          color: `black`,
          textTransform: `uppercase`
        }}>
          <div>It&rsquo;s</div>
          <div>always</div>
          <div><span>{weather}</span>
          <span> in</span></div>
          <div>{place}!</div>
        </h1>
      </section>
    )
  }
}
