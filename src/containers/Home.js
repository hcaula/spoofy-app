import React, { Component } from 'react';

import '../styles/Home.css';
import logo from '../assets/imgs/spotify_green.png';

export class Home extends Component {

    spotifyUrl() {
        let client_id = process.env.REACT_APP_SPOTIFY_CLIENTID;
        let response_type = 'code';
        let redirect_uri = process.env.REACT_APP_SPOTIFY_REDIRECTURI;
        let scope = 'user-read-recently-played user-read-email user-read-private playlist-read-private playlist-read-collaborative user-top-read'
        
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
            <div className="Home">
                <div className="HomeHeader">
                    <h1 className="HomeTitle"> spoofy stats</h1>
                    <a href={this.spotifyUrl()} className="HomeLogin">
                        <div className="HomeSpotify">
                            <img src={logo} alt="spoofy"/>
                        </div>
                        <div className="HomeLoginLink">
                            login with Spotify
                        </div>
                    </a>
                </div>
            </div>
        );
    }
}
  