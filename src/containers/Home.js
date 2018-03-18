import React, { Component } from 'react';

export class Home extends Component {

    spotifyUrl() {
        console.log(process.env);
        let client_id = process.env.REACT_APP_SPOTIFY_CLIENTID;
        let response_type = 'code';
        let redirect_uri = process.env.REACT_APP_SPOTIFY_REDIRECTURI;
        let scope = 'user-read-recently-played user-read-email user-read-private'
        
        let host = 'accounts.spotify.com';
        let path = '/authorize/?';
        path += `client_id=${client_id}&`;
        path += `response_type=${response_type}&`;
        path += `redirect_uri=${redirect_uri}&`;
        path += `scope=${scope}&`;
        path += `show_dialog=${true}`;
        
        let uri = `https://${host}${path}`;
        
        return uri;
    }

    render() {
        return (
            <div>
                <h1> Home page </h1>
                <a href={this.spotifyUrl()}>
                    <button>Login with Spotify</button>
                </a>
            </div>
        );
    }
}
  