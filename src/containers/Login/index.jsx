import React, { Component } from 'react';
import SpotifyButton from './components/SpotifyButton';
import backgroundImage from '../../assets/imgs/Live-Music-cropped.jpg';

class Login extends Component {
    render() {
        return (
            <div style={styles.home}>
                <div style={styles.header}>
                    <h1 style={styles.title}>{`spoofy stats`}</h1>
                    <SpotifyButton />
                </div>
            </div>
        );
    }
}

const styles = {
    home: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 0,
        padding: 0,
        border: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    },
    header: {
        marginTop: '13%',
        padding: 20,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        color: 'white',
    },
    title: {
        fontSize: 70,
        color: '#FFFFFF',
        margin: 0,
        marginBottom: 30,
    }
};

export default Login;