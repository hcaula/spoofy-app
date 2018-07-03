import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Sidebar, Button, Menu, Icon } from 'semantic-ui-react';
import Graph from './components/Graph';
import SongRow from './components/SongRow';
import { API } from '../../utils';
import './index.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
        visible: false,
        ready: false,
        playlistReady: true,
        users: [],
        playlist: [],
        spotifyIframe: getSpotifyIframe('spotify:track:4BQOi5mYZozFR4HnOy5F79'),
        defaultLinkWeight: 5
    }

    componentDidMount() {
        this.loadData();
    }

    logout = () => { this.setState({ redirect: true }); }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    loadData = async () => {
        const users = await API.getAllUsers();
        if (users) this.setState({ ready: true, users });
        else this.setState({ redirect: true });
    }

    getPlaylist = async (selected) => {
        try {
            this.setState({ playlistReady: false });

            /* Automatically toggles playlist sidebar */
            if (!this.state.visible && selected.length == 1) this.toggleVisibility();

            const ids = selected.map(s => s.id);
            const multipliers = selected.map(s => s.multiplier);
            const body = await API.getPlaylist(ids, multipliers);

            /* Empties the playlist state so that React
            knows that it changed and re-render component */
            this.setState({
                playlist: []
            });

            this.setState({
                playlist: body.playlist
            });

            this.setState({ playlistReady: true });

        } catch (err) {
            this.state.redirect = true;
        }
    }

    handleSongSelect = (song) => {
        this.setState({
            spotifyIframe: getSpotifyIframe(song.uri)
        })
    }

    handleSliderChange = (e) => {
        this.setState({
            defaultLinkWeight: e
        })

        this.refs.graph.drawGraph();
        this.refs.graph.setNodesAndLinks(e);
    }

    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const { visible } = this.state;

        const user = API.getUser();

        if (!user || this.state.redirect) return <Redirect to="/login" />

        let playlistDiv;
        if (!this.state.playlistReady) {
            playlistDiv = (
                <div className="loadingPlaylist">
                    <Icon name='sync' />
                    <p>loading playlist...</p>
                </div>
            )
        } else if (this.state.playlist.length == 0) {
            playlistDiv = (
                <div className="emptyPlaylist">
                    <h1>playlist is empty</h1>
                    <h4>please, select users so that we can generate a playlist for you</h4>
                </div>
            )
        } else {
            playlistDiv = (
                <div className='songs' style={{ height: height - 80 }}>
                    {this.state.playlist.map((s, i) =>
                        <SongRow key={i} song={s} onClick={this.handleSongSelect} />
                    )}
                </div>
            )
        }

        return (
            <Sidebar.Pushable>

                <div className="Dashboard">
                    <div className="DashboardTitle">
                        <h1>{`hi, ${user.display_name.toLowerCase()}`}</h1>
                        <h3 onClick={this.logout} className="logoutButton">logout</h3>
                        <p>genre-user affinity: <b>{this.state.defaultLinkWeight}</b></p>
                        <div>
                            <Slider
                                min={1}
                                max={10}
                                defaultValue={this.state.defaultLinkWeight}
                                step={1}
                                onChange={(e) => this.handleSliderChange(e)}
                            />
                        </div>
                    </div>

                    <div className="sidebar-toggle">
                        <Button onClick={this.toggleVisibility} icon>
                            {visible ?
                                <Icon name='angle right' /> :
                                <Icon name='angle left' />
                            }
                        </Button>
                    </div>

                    {!this.state.ready ? null :
                        <Graph
                            ref='graph'
                            users={this.state.users}
                            user={user}
                            width={width}
                            height={height}
                            getPlaylist={this.getPlaylist}
                            defaultLinkWeight={this.state.defaultLinkWeight}
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
                        {playlistDiv}
                    </div>
                </Sidebar>

            </Sidebar.Pushable>
        );
    }
}

export default withRouter(Dashboard);