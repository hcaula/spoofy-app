import React from 'react';
import ReactDOMServer from 'react-dom/server'

class InfoHTML {

    userInfo = function(user){
        const html = (
            <div className="userInfo">
                <p><b>{user.display_name}</b></p>
                <p>Gamers rise up!</p>
                <p>Bottom Text</p>
            </div>
        )

        return ReactDOMServer.renderToStaticMarkup(html);
    }
}

export default new InfoHTML();