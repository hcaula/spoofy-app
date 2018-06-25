import React from 'react';
import ReactDOMServer from 'react-dom/server'

class InfoHTML {

    genreInfo = function(name, id){
        const html = (
            <div className="genreInfo">
                <p>Hello!</p>
                <p>{name}</p>
            </div>
        )

        return ReactDOMServer.renderToStaticMarkup(html);
    }
}

export default new InfoHTML();