import React, { Component } from 'react';

import '../styles/List.css';

export class List extends Component {
    constructor(props) {
        super(props);
        this.users = this.props.users;
        this.selectedUsers = [];
    }

    getGenresHTML = function (user) {
        const genres = user.genres.map((g, i) => {
            if (i > 5) return;
            return (
                <div className="ListItemGenre" key={g.name}>
                    <p>{g.name}</p>
                </div>
            )
        });

        return genres;
    }

    getMediaHTML = function (user, type) {
        const media = user[type.toLowerCase()].map((m, i) => {
            let className;
            if (i > 5) return;
            else className = 'ListItem' + type;
            return (
                <div className={className} key={m}>
                    <p>{m}</p>
                </div>
            )
        });

        return media;
    }

    render() {
        const items = this.users.map((user, i) => {
            const genres = this.getGenresHTML(user);
            const tracks = this.getMediaHTML(user, 'Tracks');
            const artists = this.getMediaHTML(user, 'Artists');

            return (
                <div className="ListItem">
                    <div className="ListItemBttnImg">
                        <img className="ListItemImg" src={user.images[0].url} />
                    </div>
                    <div className="ListItemInfo">
                        <h2>{user.display_name}</h2>
                        <div className="ListItemTop">
                            <div className="ListItemGenres">
                                <h3>genres</h3>
                                {genres}
                            </div>
                            <div className="ListItemArtists">
                                <h3>artists</h3>
                                {artists}
                            </div>
                            <div className="ListItemTracks">
                                <h3>tracks</h3>
                                {tracks}
                            </div>
                        </div>
                    </div>
                </div>
            )
        });
        return (
            <div className="List">
                {items}
            </div>
        )
    }
}