import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Sidebar, Button, Menu, Icon } from 'semantic-ui-react';
import Graph from './components/Graph';
import SongRow from './components/SongRow';
import { API } from '../../utils';
import './index.css';

const getSpotifyIframe = (uri) => {
    return (
        <iframe 
            title='spotify-iframe'
            src={`https://open.spotify.com/embed?uri=${uri}`}
            width={80}
            height={80}
            frameBorder={0}
            allowtransparency="true"
            allow="encrypted-media"
        />
    );
}

class Dashboard extends Component {

    state = {
        visible: true,
        ready: false,
        users: [],
        playlist: [],
        spotifyIframe: getSpotifyIframe('spotify:track:4BQOi5mYZozFR4HnOy5F79')
    }

    componentDidMount() {
        this.loadData();
    }
    
    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    loadData = async () => {
        const users = await API.getAllUsers();
        if (users) this.setState({ ready: true, users });
        else this.setState({ redirect: true });
    }

    getPlaylist = async (ids) => {
        try {
            const body = await API.getPlaylist(ids);
            this.setState({
                playlist: body.playlist
            });
        } catch (err) {
            console.log(err);
        }
    }

    handleSongSelect = (song) => {
        this.setState({
            spotifyIframe: getSpotifyIframe(song.uri)
        })
    }

    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const { visible } = this.state;

        const user = API.getUser();

        if (!user || this.state.redirect) return <Redirect to="/login"/>

        return (
            <Sidebar.Pushable>

                <div className="Dashboard">
                    <div className="DashboardTitle">
                        <h1>{`hi, ${user.display_name.toLowerCase()}`}</h1>
                        <p>to <b>zoom</b>, use scroll</p>
                        <p>to <b>move</b>, click on a white space and drag</p>
                        <p>you can also drag nodes around</p>
                    </div>

                    <div className="sidebar-toggle">
                        <Button onClick={this.toggleVisibility} icon>
                            {visible ? 
                                <Icon name='times'/>:
                                <Icon name='music'/>
                            }
                        </Button>
                    </div>
                    
                    {!this.state.ready ? null:
                        <Graph
                            users={this.state.users}
                            user={user}
                            width={width}
                            height={height}
                            getPlaylist={this.getPlaylist}
                        />
                    }
                </div>

                <Sidebar
                    as={Menu}
                    animation='overlay'
                    width='very wide'
                    direction='right'
                    visible={visible}
                    icon='labeled'
                    vertical
                    inverted
                    id="sidebar"
                >
                    <div className='playlist'>
                        <div className='play'>
                            {this.state.spotifyIframe}
                        </div>
                        <div className='songs' style={{height: height - 80}}>
                            {this.state.playlist.map((s, i) =>
                                <SongRow key={i} song={s} onClick={this.handleSongSelect}/>
                            )}
                        </div>
                    </div>
                </Sidebar>

            </Sidebar.Pushable>
        );
    }
}

export default withRouter(Dashboard);