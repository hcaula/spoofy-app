import React, { Component } from 'react';

import { List } from './List';

import Error from '../components/Error';
import Waiting from '../components/Waiting';

import '../styles/Dashboard.css';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.token = this.props.token;
        this.isNew = this.props.isNew;
        this.users = [];
    }

    state = { ready: false, error: false };

    componentDidMount() {
        if (this.isNew) {
            this.requestTop(this.token)
                .then(res => {
                    if (res.status != 200) this.setState({ error: res });
                    else this.afterTopReq();
                });
        } else this.afterTopReq();
    }

    afterTopReq = function () {
        this.requestUsers(this.token)
            .then(res => {
                if (res.status != 200) this.setState({ error: res });
                else {
                    this.users = res.users;
                    this.setState({ ready: true });
                }
            })
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

    requestUsers = async (access_token) => {
        const api = process.env.REACT_APP_SPOOFYAPI;
        const response = await fetch(api + '/api/v2/all/users', {
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
            <div className="Dashboard">
                <div className="DashboardTitle">
                    <h1> thank you for joining, {this.user.display_name} </h1>
                    <h2> please, select the people you believe have similar taste in music with you </h2>
                    <p> (soon, we'll have a graph visualization of your friends. for now, we just want to do some tests) </p>
                </div>

                <List users={this.users} />
            </div>
        );
    }
}