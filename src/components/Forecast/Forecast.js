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
    this.editableChange = debounce(this.editableChange, 500)
  }

  editableChange(input) {
    const filtered = input.replace(/\W+/g, ' ');
    if(filtered.length >= 3) {
      this.props.forecastStore.findLocation(filtered)
    }
  }

  render() {
    const { place, strings, weather } = this.props.forecastStore
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
          color: `black`,
          textTransform: `uppercase`
        }}>
          <div style={{ position: 'relative', top: '28px', left: '-100px', transform: 'rotateZ(5deg)'}}>{strings.its}</div>
          <div style={{ position: 'relative', left: '-90px', fontSize: '108px'}}>{strings.always}</div>
          <div><span style={{ display: 'inline-block', fontSize: '148px', transform: 'rotateZ(-1deg)'}}>{weather}</span>
          <span style={{ position: 'relative', left: '-25px', fontSize: '50px'}}> {strings.in}</span></div>
          <div style={{ position: 'relative', top: '-44px', right: '40px'}}>
            <ContentEditable html={place} spellCheck={false} onBlur={(event) => false} onChange={(event) => this.editableChange(event.target.value)} />
          </div>
        </h1>
      </section>
    )
  }
}
