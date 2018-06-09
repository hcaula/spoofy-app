import React, { Component } from 'react';

import '../styles/App.css';
import '../styles/Graph.css';

const searchByField = function(value, param, array) {
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
        this.getGenreNodes();
        this.createGraph();
    }

    componentDidMount() {this.init()}
    componentDidUpdate() {this.init()}

    getGenreNodes() {
        this.genreNodes = [];
        this.users.forEach(u => {
            u.genres.forEach(g => {
                g.id = g._id;
                delete g._id;
                const index = searchByField(g.name, 'name', this.genreNodes);
                if (index > -1) this.genreNodes[index].weight += g.weight;
                else this.genreNodes.push(g);
            });
        });
        this.genreNodes = this.genreNodes.sort((a, b) => b.weight - a.weight);
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