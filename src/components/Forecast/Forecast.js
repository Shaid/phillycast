import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import SearchBox from '../SearchBox/SearchBox'

@inject('forecastStore')
@observer
export default class Forecast extends Component {

  render() {
    const { foregroundColour, place, strings, weather } = this.props.forecastStore
    console.log(this.props.forecastStore)
    return (
      <section style={{
        display: 'flex',
        flex: '1 1 auto',
        flexFlow: 'column nowrap',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: '700',
          letterSpacing: '-2px',
          lineHeight: '95px',
          color: foregroundColour,
          textTransform: `uppercase`,
          transition: 'color 0.5s ease-in-out',
          transform: 'rotateZ(0)',
        }}>
          <div style={{ position: 'relative', top: '28px', left: '-100px', transform: 'rotateZ(5deg)'}}>{strings.its}</div>
          <div style={{ position: 'relative', left: '-90px', fontSize: '108px'}}>{strings.always}</div>
          <div><span style={{ display: 'inline-block', fontSize: '148px', transform: 'rotateZ(-1deg)'}}>{weather}</span>
          <span style={{ position: 'relative', left: '-15px', fontSize: '50px'}}> {strings.in}</span></div>
          <SearchBox />
        </h1>
      </section>
    )
  }
}
