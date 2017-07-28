import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Svg extends Component {
  static propTypes = {
    className: PropTypes.string,
    image: PropTypes.string,
    style: PropTypes.object,
  }

  render() {
    return (
      <span className={this.props.className} style={this.props.style} dangerouslySetInnerHTML={{__html: this.props.image}} />
    );
  }
}
