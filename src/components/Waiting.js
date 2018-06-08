import React, { Component } from 'react';

export class Waiting extends Component {

    render() {
        return (
            <div className="Wating">
                <p> {this.props.message} </p>
            </div>
        );
    }
}

export default Waiting;