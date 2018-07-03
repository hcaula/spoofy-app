import React, { Component } from 'react';
import { Grid, Icon } from 'semantic-ui-react';

export default class SongRow extends Component {

    state = {
        rating: 0,
        tempRating: 0
    }

    constructor(props) {
        super(props);
        this.song = this.props.song;
        this.width = this.props.width;
    }

    editRating = (flag, rating) => {
        let st = {};
        if (flag)
            st.rating = rating;
        else
            st.tempRating = rating;
        this.setState(st);
    }

    render() {
        const { name, artist } = this.song;
        let stars = [];
        for (let i = 0; i < 5; i++)
            stars.push(
                <Icon
                    key={i}
                    name={`star${i >= this.state.tempRating ? ' outline' : ''}`}
                    onMouseOver={() => this.editRating(false, i + 1)}
                    onClick={() => this.editRating(true, i + 1)}
                    style={{ cursor: 'pointer' }}
                />
            );

        const ori_sb_wth = 475;
        const width = this.props.width;
        const ratio = Math.ceil(width/ori_sb_wth);

        return (
            <div className='song-row'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ratio * 1} onClick={() => this.props.onClick(this.props.song)} style={{ cursor: 'pointer', marginTop: 8 }}>
                            <Icon name='sound' />
                        </Grid.Column>
                        <Grid.Column width={ratio * 9} align='left' onClick={() => this.props.onClick(this.props.song)} style={{ cursor: 'pointer' }}>
                            <span className='name'>{name}</span>
                            <br />
                            <span className='artist'>{artist}</span>
                        </Grid.Column>
                        <Grid.Column width={ratio * 5} style={{ marginTop: 8 }}>
                            <div className='rating' onMouseLeave={() => this.editRating(false, this.state.rating)}>
                                {stars}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

}