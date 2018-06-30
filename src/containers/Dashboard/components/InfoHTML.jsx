import React from 'react';
import ReactDOMServer from 'react-dom/server'

class InfoHTML {

    userInfo = function (user) {
        const artists = user.artists.slice(0,6).map(a => (<p key={a}>{a}</p>));
        const tracks = user.tracks.slice(0,6).map(t => (<p key={t}>{t}</p>));

        const html = (
            <div className="userInfo">
                <div className="userName">
                    <p>here's what <b>{user.display_name}</b> likes to listen to</p>
                </div>
                <div className="userPrefs">
                    <div className="userArtists">
                        <p><b>artists</b></p>
                        {artists}
                    </div>
                    <div className="userTracks">
                        <p><b>tracks</b></p>
                        {tracks}
                    </div>
                </div>
                <div className="extraInfo">
                <p>click to select/deselect <b>{user.display_name}</b></p>
                </div>
            </div>
        )

        return ReactDOMServer.renderToStaticMarkup(html);
    }
}

export default new InfoHTML();