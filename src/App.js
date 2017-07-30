import React, { Component } from 'react';
import { Provder } from 'mobx-react'

import ForecastStore from './stores/ForecastStore'
import Forecast from './components/Forecast/Forecast'

const stores = {
  forecastStore: new ForecastStore()
}

class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <div style={{
          display: 'flex',
          flex: '1 1 auto',
          flexFlow: 'row nowrap',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}>
          <Forecast />
        </div>
      </Provider>
    );
  }
}

export default App;
