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
    const filtered = input.replace(/\W+/g, ' ');
    if(filtered.length >= 3) {
      this.props.forecastStore.findLocation(filtered)
    }
  }

  render(){
    const { locationOptions, multipleLocations, place } = this.props.forecastStore
    console.log(locationOptions)
    let otherPlaces = []
    /*
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
