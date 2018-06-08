import React, { Component } from 'react';

import { Dashboard } from './Dashboard.js';

import Spotify from '../components/Spotify';
import Error from '../components/Error';
import Waiting from '../components/Waiting';

import '../styles/Home.css';

const getQueryParam = (name, url) => {
    if (!url) url = window.location.href;
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export class Home extends Component {

    constructor(props) {
        super(props);
        this.user;
        this.token;
        this.isNew = false;
    }

    state = { ready: false, error: false };

    componentDidMount() {
        const token = getQueryParam('token');
        if (token) {
            this.login(token)
                .then(res => {
                    if (res.status != 200) this.setState({ error: res });
                    else {
                        this.user = res.user;
                        this.token = res.access_token;

                        const isNew = getQueryParam('new');
                        if (isNew == 'true') this.isNew = true;

                        this.setState({ ready: true });
                    }
                })
                .catch(error => {
                    this.setState({ error: error });
                });
        } else this.setState({ ready: true });
    }

    login = async (access_token) => {
        const api = process.env.REACT_APP_SPOOFYAPI;
        const response = await fetch(api + '/login', {
            headers: { 'access_token': access_token }
        });

        const body = await response.json();
        body.access_token = access_token;
        body.status = response.status;
        return body;
    };

    render() {
        if (this.state.error) return <Error error={this.state.error} />;
        else if (this.user) return <Dashboard user={this.user} token={this.token} isNew={this.isNew} />
        else if (!this.state.ready) return <Waiting message="Hold on..." />;
        else return (
            <div className="Home">
                <div className="HomeHeader">
                    <h1 className="HomeTitle"> spoofy stats</h1>
                    <Spotify />
                </div>
            </div>
        );
    }
}
