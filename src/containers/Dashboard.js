import React, { Component } from 'react';
import Chart from './Chart.js'
import Button from '../components/Button.js'

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
    }

    render() {
        return (
            <div>
                <h1> Dashboard </h1>
                <h2> Name: {this.user.display_name}</h2>
                <h2> ID: {this.user._id}</h2>
                
                <Button onClick={this.props.logout}>Logout</Button>

                <Chart data={[5,10,1,3]} size={[500,500]}></Chart>
            </div>
        );
    }
}