import React, { Component } from 'react';

import Error from '../components/Error';
import Waiting from '../components/Waiting';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.token = this.props.token;
        this.isNew = this.props.isNew;
    }

    state = { ready: false, error: false };

    componentDidMount() {
        if (this.isNew) {
            this.requestTop(this.token)
                .then(res => {
                    if (res.status != 200) this.setState({ error: res });
                    else this.setState({ ready: true });
                });
        } else this.setState({ ready: true });
    }

    requestTop = async (access_token) => {
        const api = process.env.REACT_APP_SPOOFYAPI;
        const response = await fetch(api + '/api/v2/me/top', {
            method: 'POST',
            headers: { 'access_token': access_token }
        });

        const body = await response.json();
        body.status = response.status;
        return body;
    };

    render() {
        if (this.state.error) return <Error error={this.state.error} />;
        else if (!this.state.ready) return <Waiting message="Hi! We're requesting your top tracks" />;
        else return (
            <div>
                <h1> Dashboard </h1>
                <h2> Name: {this.user.display_name}</h2>
                <h2> ID: {this.user._id}</h2>
            </div>
        );
    }
}