import React, { Component } from 'react';

import '../styles/List.css';

export class List extends Component {
    constructor(props) {
        super(props);
        this.users = this.props.users;
    }

    render() {
        console.log(this.users);
        const items = this.users.map(user => (
            <h3>{user.display_name}</h3>
        ));
        return (
            <div className="List">
                {items}
            </div>
        )
    }
}