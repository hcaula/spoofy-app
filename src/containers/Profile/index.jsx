import React, { Component } from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';
import { API } from '../../utils';
import sample from '../../assets/imgs/sample.png';
import './index.css';

export default class Profile extends Component {
    
    render() {
        const user = API.getUser();
        
        if (!user) {
            return <Redirect to="/login"/>
        }
        
        const url = user.images[0].url;
        console.log(user.images[0])
        return (
            <div className="profile">
                <Card centered>
                    <Image src={url}/>
                    <Card.Content>
                        <Card.Header>{user.display_name}</Card.Header>
                        <Card.Description>{user.email}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <a>
                        <Icon name='music' />
                            {user.genres.length} genres listened
                        </a>
                    </Card.Content>
                    <div>
                        <Button primary>Save</Button>
                        <Button secondary>Cancel</Button>
                    </div>
                </Card>
            </div>
        );
    }
    
}