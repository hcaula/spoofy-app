import React, { Component } from 'react';

export class Error extends Component {

    render() {
        return (
            <p> {this.props.error.message} </p>
        );
    }
}

export default Error;