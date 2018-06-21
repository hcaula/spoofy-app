import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { API } from '../../utils';
import './index.css';

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default class Loading extends Component {

    state = {
        path: null
    }

    async componentDidMount() {
        const token = getParameterByName('token', window.location.search);

        if (!token) {
            this.setState({
                path: '/login'
            });
            return;
        }

        try {
            await API.login(token);
            const isNew = getParameterByName('isNew', window.location.search);
            if (isNew === 'true') {
                await API.requestTopInfo();
            }
            this.setState({
                path: isNew ? '/profile' : '/'
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

        return <Redirect to={this.state.path} />;
    }

}