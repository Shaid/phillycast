import React, { Component } from 'react';
import './App.css';

import Forecast from './components/Forecast/Forecast'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Forecast />
      </div>
    );
  }
}

export default App;
