import React from 'react';
import ReactDOMServer from 'react-dom/server'

class InfoHTML {

    userInfo = function(user){
        const html = (
            <div className="userInfo">
                <p>Hello!</p>
                <p>{user.display_name}</p>
            </div>
        )

        return ReactDOMServer.renderToStaticMarkup(html);
    }
}

export default new InfoHTML();