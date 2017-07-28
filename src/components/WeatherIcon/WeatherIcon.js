import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Svg from '../Svg/Svg';

export default class WeatherIcon extends Component {
  static propTypes = {
    icon: PropTypes.number,
    isNight: PropTypes.bool,
    styling: PropTypes.string,
    variant: PropTypes.string
  }

  render() {

    const {icon, styling} = this.props; // eslint-disable-line no-shadow
    const styles = require('./WeatherIcon.scss');

    // @todo: Good work Jez. Overcomplicated much?
    const variant = (() => {
      switch (this.props.variant ) {
        case 'colour' :
          return 'col'
        case 'outline' : default :
          return 'ol'
      }
    })()

    let smallIcon
    if (typeof icon === undefined || icon === null) {
      smallIcon = ''; // <Icon icon="panorama_fish_eye" styling={styles.weatherIconNoIcon} />;
    } else {
      const iconName = `${icon.toLowerCase().replace(' ', '-')}`
      //smallIcon = <Svg image={require(`url-loader!./icons/${iconName}s.svg`)} />
      smallIcon = iconName
    }

    return (
      <div className={styles.weatherIcon + ' ' + styling ? styling : ''}>
        {smallIcon}
      </div>
    );
  }
}
