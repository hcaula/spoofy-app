import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Sidebar, Button, Image, Menu, Icon } from 'semantic-ui-react';
import Graph from './components/Graph';
import SongRow from './components/SongRow';
import { API } from '../../utils';
import './index.css';
import sample from '../../assets/imgs/sample.png';

class Dashboard extends Component {

    
    state = {
        visible: true,
        ready: false,
        users: []
    }

    componentDidMount() {
        this.loadData();
    }
    
    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    async loadData() {
        const users = await API.getAllUsers();
        if (users) this.setState({ ready: true, users });
        else this.setState({ redirect: true });
    }

    async getPlaylist(ids) {
        const body = await API.getPlaylist(ids);
        console.log(body);
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
                        <h1>{`thank you for joining, ${user.display_name}`}</h1>
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
                        <Image src={user.image.url} size='small' circular centered/>
                        <SongRow/>
                        <SongRow/>
                        <SongRow/>
                        <div className='play'>
                            <iframe src="https://open.spotify.com/embed?uri=spotify:album:1DFixLWuPkv3KT3TnV35m3" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                        </div>
                    </div>
                </Sidebar>

            </Sidebar.Pushable>
        );
    }
}

export default withRouter(Dashboard);