import React, { Component } from 'react';

export class Error extends Component {

    render() {
        return (
            <div className="Error">
                <p> An error has occurred: </p>
                <p> {JSON.stringify(this.props.error)} </p>
            </div>
        );
    }
}

export default Error;