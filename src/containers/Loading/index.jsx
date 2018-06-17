import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { API } from '../../utils';

export default class Loading extends Component {
    
    state = {
        path: null
    }

    async componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        const token = parsed.token;

        if (!token) {
            this.setState({
                path: '/login'
            });
            return;
        }

        try {
            await API.login(token);
            parsed = queryString.parse(window.location.search);
            this.setState({
                path: parsed.new === 'true' ? '/profile':'/'
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    render() {
        if (!this.state.path) {
            return (
                <div>
                    Loading data
                </div>
            );
        }

        return <Redirect to={this.state.path}/>;
    }
    
}