import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Sidebar, Button, Image, Menu, Icon } from 'semantic-ui-react';
import Graph from './components/Graph';
import { API } from '../../utils';
import './index.css';
import sample from '../../assets/imgs/sample.png';

class Dashboard extends Component {

    
    constructor(props) {
        super(props);
        this.user = API.getUser();
        this.token = API.getToken();
        this.state = {
            visible: false,
            ready: false,
            error: false,
            users: []
        };
        if (!this.token) {
            props.history.push('/login')
        }
    }
    
    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    async componentDidMount() {
        if (this.isNew) {
            await API.requestTopInfo();
        }
        const users = await API.getAllUsers();
        this.setState({ ready: true, users });
    }

    render() {
        const { visible } = this.state;
        const width = window.innerWidth;
        const height = window.innerHeight;

        return (
            <Sidebar.Pushable>

                <div className="Dashboard">
                    <div className="DashboardTitle">
                        <p>{`thank you for joining, ${this.user.display_name}`}</p>
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
                        user={this.user}
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