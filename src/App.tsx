import React from 'react';
import Clock from './Clock';
import './App.css'
const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Analog Clock</h1>
            <Clock />
        </div>
    );
};

export default App;
