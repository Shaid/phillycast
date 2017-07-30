import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ContentEditable from 'react-contenteditable'
import debounce  from 'lodash.debounce'

@inject('forecastStore')
@observer
export default class Forecast extends Component {

  constructor() {
    super()
    this.state = {
      forecast: [
        {value: 'sunny'},
      ],
      location: {
        name: 'philadelphia'
      }
    }
  }

  componentDidMount() {
    this.props.forecastStore.updateForecast()
    this.editableChange = debounce(this.editableChange, 300)
  }

  editableChange(input) {
    const filtered = input.replace(/\W+/g, ' ');
    if(filtered.length >= 3) {
      this.setState({location: { name: filtered}})
    }
  }

  render() {
    const place = this.props.forecastStore.location

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
          lineHeight: '90px',
          color: `black`,
          textTransform: `uppercase`
        }}>
          <div style={{ position: 'relative', top: '20px', left: '-50px', transform: 'rotateZ(5deg)'}}>It&rsquo;s</div>
          <div style={{ fontSize: '108px'}}>always</div>
          <div><span style={{ display: 'inline-block', fontSize: '128px', transform: 'rotateZ(-2deg)'}}>{weather}</span>
          <span> in</span></div>
          <div style={{ position: 'relative', top: '-30px'}}>
            <ContentEditable html={place} spellCheck={false} onChange={(event) => this.editableChange(event.target.value)} />
          </div>
        </h1>
      </section>
    )
  }
}
