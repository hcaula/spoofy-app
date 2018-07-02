import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Sidebar, Button, Image, Menu, Icon } from 'semantic-ui-react';
import Graph from './components/Graph';
import { API } from '../../utils';
import './index.css';
import sample from '../../assets/imgs/sample.png';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class Dashboard extends Component {

    state = {
        visible: false,
        ready: false,
        users: [],
        defaultLinkWeight: 4
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

    async getPlaylist(selected) {
        const ids = selected.map(s => s.id);
        const multipliers = selected.map(s => s.multiplier);
        const body = await API.getPlaylist(ids, multipliers);
        console.log(body);
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

        if (!user || this.state.redirect) return <Redirect to="/login"/>

        return (
            <Sidebar.Pushable>

                <div className="Dashboard">
                    <div className="DashboardTitle">
                        <h1>{`thank you for joining, ${user.display_name}`}</h1>
                        <p>to <b>zoom</b>, use scroll</p>
                        <p>to <b>move</b>, click on a white space and drag</p>
                        <p>you can also drag nodes around</p>
                        <p>Minimal weight for genre-user affinity: {this.state.defaultLinkWeight}</p>
                        <div>
                            <Slider
                                min={1}
                                max={10}
                                defaultValue={this.state.defaultLinkWeight}
                                step={0.1}
                                onChange={(e) => this.handleSliderChange(e)}
                            />
                        </div>
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
                        <Image src={sample} size='small' circular centered/>
                    </div>
                </Sidebar>

            </Sidebar.Pushable>
        );
    }
}

export default withRouter(Dashboard);