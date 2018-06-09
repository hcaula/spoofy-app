import React, { Component } from 'react';

import '../styles/App.css';
import '../styles/Graph.css';

class Graph extends Component {
    constructor(props) {
        super(props)
        this.createGraph = this.createGraph.bind(this)
        this.user = this.props.user;
        this.users = this.props.users;
    }

    componentDidMount() {
        this.createGraph();
    }

    componentDidUpdate() {
        this.createGraph();
    }

    createGraph() {
        console.log(this.users);
    }

    render() {
        return (
            <svg ref={node => this.node = node} className="Graph"></svg>
        )
    }
}
export default Graph