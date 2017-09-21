import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ContentEditable from 'react-contenteditable'
import debounce from 'lodash.debounce'

@inject('forecastStore')
@observer
class SearchBox extends Component {

  componentDidMount() {
    this.editableChange = debounce(this.editableChange, 1000)
  }

  editableChange(input) {
    const filtered = this.shittySanitize(input)
    if(filtered.length >= 3) {
      this.props.forecastStore.findLocation(filtered)
    }
  }

  shittySanitize(string) {
    // lets create a div, whack the content in and perform the worlds worst sanitisation on it.
    // @todo consider loading another 45kb of js simply to use Google / Closure's html-sanitizer
    let bargearse = document.createElement('div')
    bargearse.innerHTML = string.replace(/\W+/g, ' ');
    return bargearse.textContent || bargearse.innerText || ""
  }

  render(){
    const { locationOptions, multipleLocations, place } = this.props.forecastStore
    console.log(locationOptions, multipleLocations, place)

    /*
    let otherPlaces = []

    if ( multipleLocations ) {
      locationOptions.forEach((location) => {
        otherPlaces.push(<div>{location.attributes.name}</div>)
      })
    }
    */

    return (
      <div style={{ position: 'relative', top: '-44px', right: '40px'}}>
        <ContentEditable html={place} spellCheck={false} onBlur={(event) => false} onChange={(event) => this.editableChange(event.target.value)} />
      </div>
    )
  }
}

export default SearchBox
