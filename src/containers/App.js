import React, { Component } from 'react';
import {Cookies} from "react-cookie";

import '../styles/App.css';

import {Home} from './Home.js';
import {Dashboard} from './Dashboard.js';

const getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class App extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  state = {ready: false};
  

  componentDidMount() {
    this.login()
      .then(res => {
        this.setState({ user: res.user, ready: true });
      })
      .catch(err => console.log(err));
  }

  logout = async () => {
    const cookie = new Cookies();
    const token = cookie.get('spoofy');

    const api = process.env.REACT_APP_SPOOFYAPI;
    const response = await fetch(api + '/logout', {
      headers: {'access_token': token}
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    else {
      cookie.remove('spoofy');
      this.setState({user: false});
    }
}

  login = async () => {
    const cookie = new Cookies();
    let access_token = (getParameterByName('token') || cookie.get('spoofy'));

    if(access_token) cookie.set('spoofy', access_token);

    const api = process.env.REACT_APP_SPOOFYAPI;
    console.log(api);
    const response = await fetch(api + '/login', {
      headers: {'access_token': access_token}
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    let div;
    if(this.state.user) div = <Dashboard logout={this.logout} user={this.state.user} />
    else div = <Home />

    return this.state.ready ? <div className="App">{div}</div> : '';
  }
}

export default App;
