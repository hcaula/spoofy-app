import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { API } from '../../utils';
import './index.css';

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
            const isNew = parsed.new === 'true';
            if (isNew) {
                await API.requestTopInfo();
            }
            this.setState({
                path: isNew ? '/profile':'/'
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    render() {
        if (!this.state.path) {
            return (
                <div className="loading">
                    Loading data
                </div>
            );
        }

        return <Redirect to={this.state.path}/>;
    }
    
}