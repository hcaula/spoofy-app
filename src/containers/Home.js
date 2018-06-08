import React, { Component } from 'react';

import Spotify from '../components/Spotify';

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
        this.user = {};
        this.token = "";
    }

    componentDidMount() {
        this.login();
    }

    login = async () => {
        const access_token = getQueryParam('token');

        const api = process.env.REACT_APP_SPOOFYAPI;
        const response = await fetch(api + '/login', {
            headers: { 'access_token': access_token }
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        else {
            body.access_token = access_token;
            return body;
        }
    };

    render() {
        return (
            <div className="Home">
                <div className="HomeHeader">
                    <h1 className="HomeTitle"> spoofy stats</h1>
                    <Spotify />
                </div>
            </div>
        );
    }
}
