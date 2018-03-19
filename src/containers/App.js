import React, { Component } from 'react';

import '../styles/App.css';

import {Home} from './Home.js';
import {Dashboard} from './Dashboard.js';


class App extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this);
  }

  state = {};

  componentDidMount() {
    this.login()
      .then(res => this.setState({ user: res.user }))
      .catch(err => console.log(err));
  }

  logout = async () => {
    const api = process.env.REACT_APP_SPOOFYAPI;
    const response = await fetch(api + './logout', {
        credentials: 'include'
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    else this.setState({user: false});
}

  login = async () => {
    const api = process.env.REACT_APP_SPOOFYAPI;
    const response = await fetch(api + '/login', {
      credentials: 'include'
    });

    const body = await response.json();

    console.log(body);

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    let div;
    if(this.state.user) div = <Dashboard logout={this.logout} user={this.state.user} />
    else div = <Home />

    return (
      <div className="App">{div}</div>
    )
  }
}

export default App;
