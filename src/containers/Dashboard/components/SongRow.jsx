import React, { Component } from 'react';
import { Grid, Icon } from 'semantic-ui-react';

export default class SongRow extends Component {

    render() {
        const key = 1;
        const musicName = 'Plastic Love';
        const artist = 'Takeuchi Mariya';
        const duration = '4:28';
        let stars = [0, 0, 0, 0, 0];

        return (
            <div className='song-row'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={1}>
                            <span>{key}</span>
                        </Grid.Column>
                        <Grid.Column width={10} align='left'>
                            <span className='name'>{musicName}</span>
                            <br/>
                            <span className='artist'>{artist}</span>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <span className='duration'>{duration}</span>
                            <br/>
                            <div className='rating'>
                                {stars.map(star => 
                                    <Icon name={`star${star === 0 ? ' outline':''}`}/>
                                )}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

}