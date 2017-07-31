import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react'

import ForecastStore from './stores/ForecastStore'
import Forecast from './components/Forecast/Forecast'

const stores = {
  forecastStore: new ForecastStore()
}

@observer
class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <div style={{
          display: 'flex',
          flex: '1 1 auto',
          flexFlow: 'row nowrap',
          alignItems: 'center',
          backgroundColor: stores.forecastStore.backgroundColour,
          height: '100vh',
          width: '100vw',
          transition: 'background-color 0.5s ease-in-out',
          transform: 'rotateZ(0)',
        }}>
          <Forecast />
        </div>
      </Provider>
    );
  }
}

export default App;
