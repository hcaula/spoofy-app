import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Sidebar, Button, Image, Menu, Icon } from 'semantic-ui-react';
import Graph from './components/Graph';
import { API } from '../../utils';
import './index.css';
import sample from '../../assets/imgs/sample.png';

class Dashboard extends Component {

    
    state = {
        visible: false,
        ready: false,
        users: []
    }

    componentDidMount() {
        this.loadData();
    }
    
    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    async loadData() {
        const users = await API.getAllUsers();
        this.setState({ ready: true, users });
    }

    render() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const { visible } = this.state;

        const user = API.getUser();

        if (!user) {
            return <Redirect to="/login"/>
        }        

        return (
            <Sidebar.Pushable>

                <div className="Dashboard">
                    <div className="DashboardTitle">
                        <p>{`thank you for joining, ${user.display_name}`}</p>
                        <p>{`please, select the people you believe have similar taste in music with you`}</p>
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