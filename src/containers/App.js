import React, { Component } from 'react';

import '../styles/App.css';

import {Home} from './Home.js';
import {Dashboard} from './Dashboard.js';


class App extends Component {
  state = {};

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ user: res.user }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/login', {
      credentials: 'same-origin'
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    if(this.state.user) {
      return <Dashboard user={this.state.user} />
    }
    else return <Home />
  }
}

export default App;
