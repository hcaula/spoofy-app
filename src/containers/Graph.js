import React, { Component } from 'react';

import '../styles/App.css';
import '../styles/Graph.css';

const searchByField = function (value, param, array) {
    let index = -1;
    array.forEach((el, i) => {
        if (el[param] === value) {
            index = i;
            return;
        }
    });
    return index;
}

class Graph extends Component {
    constructor(props) {
        super(props)
        this.createGraph = this.createGraph.bind(this)
        this.user = this.props.user;
        this.users = this.props.users;
    }

    init() {
        this.setGenreNodes();
        this.setUserNodes();
        this.setLinks();
        this.createGraph();
    }

    componentDidMount() { this.init() }
    componentDidUpdate() { this.init() }

    setGenreNodes() {
        this.genreNodes = [];
        this.users.forEach(u => {
            u.genres.forEach((g, i) => {
                const index = searchByField(g.name, 'name', this.genreNodes);
                if (index > -1) this.genreNodes[index].weight += g.weight;
                else this.genreNodes.push({
                    id: g._id,
                    name: g.name,
                    type: 'genre',
                    weight: g.weight
                });
            });
        });
        this.genreNodes = this.genreNodes.sort((a, b) => b.weight - a.weight);
    }

    setUserNodes() {
        this.userNodes = this.users.map(u => {
            return {
                id: u._id,
                image: u.images[0].url,
                type: 'user'
            }
        });
    }

    setLinks() {
        this.links = [];
        this.users.forEach(u => {
            u.genres.forEach(g => {
                const index = searchByField(g.name, 'name', this.genreNodes);
                let id;
                if (index > -1) id = this.genreNodes[index].id;
                else id = g._id;
                this.links.push({
                    source: u._id,
                    target: id,
                    weight: g.weight,
                    name: g.name
                });
            });
        });
    }

    createGraph() {
    }

    render() {
        return (
            <svg ref={node => this.node = node} className="Graph"></svg>
        )
    }
}
export default Graph