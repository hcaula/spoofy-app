import React, { Component } from 'react';

export class Error extends Component {

    render() {
        return (
            <div className="Error">
                <p> An error has occurred: </p>
                <p> {this.props.error.error} </p>
            </div>
        );
    }
}

export default Error;