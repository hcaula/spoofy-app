import React, { Component } from 'react';

import '../styles/Spotify.css';
import logo from '../assets/imgs/spotify_green.png';

export class Spotify extends Component {

    spotifyUrl() {
        const client_id = process.env.REACT_APP_SPOTIFY_CLIENTID;
        const response_type = 'code';
        const redirect_uri = process.env.REACT_APP_SPOTIFY_REDIRECTURI;
        const scope = 'user-read-email user-read-private user-top-read';

        const host = 'accounts.spotify.com';
        let path = '/authorize/?';
        path += `client_id=${client_id}&`;
        path += `response_type=${response_type}&`;
        path += `redirect_uri=${redirect_uri}&`;
        path += `scope=${scope}&`;
        path += `show_dialog=${true}`;

        const uri = `https://${host}${path}`;

        return uri;
    }

    render() {
        return (
            <a href={this.spotifyUrl()} className="SpotifyLogin">
                <div className="SpotifySpotify">
                    <img src={logo} alt="spoofy" />
                </div>
                <div className="SpotifyLoginLink">
                    login with Spotify
                </div>
            </a>
        );
    }
}

export default Spotify;