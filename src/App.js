import React, { Component } from 'react';
import City from './components/city'
import './App.css';

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            dice: {
                d4: 4,
                d6: 0,
                d8: 0,
                d10: 0,
                d12: 0,
                d20: 0
            }
        };
    }

    handleChange(event)
    {
        this.setState({
            dice: Object.assign({}, this.state.dice, {
                [event.target.name]: event.target.valueAsNumber
            })
        });
    }

    render()
    {
        return (
            <div className="App">
                <div>
                    {Object.keys(this.state.dice).map(die =>
                        <div key={die}>{die}: <input name={die} type="number" value={this.state.dice[die]} onChange={this.handleChange.bind(this)} /></div>
                    )}
                </div>
                <City dice={this.state.dice} />
            </div>
        );
    }
}

export default App;
