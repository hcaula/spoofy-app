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
    }

    state = { ready: false, error: false };

    componentDidMount() {
        const token = getQueryParam('token');
        if (token) {
            this.login()
                .then(res => {
                    this.user = res.user;
                    this.token = res.access_token;
                    this.setState({ ready: true });
                })
                .catch(error => {
                    this.setState({ error: true });
                });
        } else this.setState({ ready: true });
    }

    login = async (access_token) => {
        const api = process.env.REACT_APP_SPOOFYAPI;
        const response = await fetch(api + '/login', {
            headers: { 'access_token': access_token }
        });

        const body = await response.json();
        if (response.status !== 200) this.setState({ error: body });
        else {
            body.access_token = access_token;
            return body;
        }
    };

    render() {
        if (this.state.error) return <Error error={this.state.error}/>;
        else if (this.user) return <Dashboard user={this.state.user} token={this.state.access_token} />
        else if (!this.state.ready) return <Waiting />;
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
