import React, { Component } from 'react';

import Forecast from './components/Forecast/Forecast'

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
