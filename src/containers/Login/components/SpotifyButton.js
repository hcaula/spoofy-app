import React, { Component } from 'react';
import logo from '../../../assets/imgs/spotify_green.png';
import './index.css';

export class SpotifyButton extends Component {

    render() {
        const client_id = process.env.REACT_APP_SPOTIFY_CLIENTID;
        const response_type = 'code';
        const redirect_uri = process.env.REACT_APP_SPOTIFY_REDIRECTURI;
        const scope = 'user-read-email user-read-private user-top-read playlist-modify-public playlist-modify-private playlist-read-collaborative user-modify-playback-state';

        const host = 'accounts.spotify.com';
        let path = '/authorize/?';
        path += `client_id=${client_id}&`;
        path += `response_type=${response_type}&`;
        path += `redirect_uri=${redirect_uri}&`;
        path += `scope=${scope}&`;
        path += `show_dialog=${true}`;

        const uri = `https://${host}${path}`;

        return (
            <a href={uri} className="SpotifyLogin">
                <div className="SpotifySpotify">
                    <img src={logo} alt="spoofy" />
                </div>
                <div className="SpotifyLoginLink">
                    {`login with Spotify`}
                </div>
            </a>
        );
    }
}

export default SpotifyButton;