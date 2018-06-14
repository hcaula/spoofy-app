import React, { Component } from 'react';

import { select, selectAll } from 'd3-selection'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'
import { drag } from 'd3-drag'
import { event } from 'd3'

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

        this.nodes = this.genreNodes.concat(this.userNodes)
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
                if (g.weight > 0) {
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
                }
            });
        });
    }

    createGraph() {
        const svg = select('svg');
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const simulation = forceSimulation()
            .force("link", forceLink().id(d => d.id).distance(200))
            .force("charge", forceManyBody())
            .force("center", forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.links)
            .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(d.weight));

        simulation
            .nodes(this.nodes)
            .on("tick", ticked)

        simulation.force("link")
            .links(this.links)

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.nodes)
            .enter()
            .append('circle')
            .attr('r', g => g.weight ? g.weight * 2 : 5 * 2)
            .attr('fill', g => g.type === 'genre' ? 'blue' : 'red')
            .call(drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        // const text = svg.append("g")
        // .attr("class", "texts")
        // .selectAll("circle")
        // .data(this.nodes)
        // .enter()
        // .append("text")
        // .attr("x", d => d.x)
        // .attr("y", d => d.y)
        // .text(d => d.name)

        node.append("title")
            .text(d => d.id);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }

        function dragstarted(d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }

    render() {
        const width = 1000;
        const height = 1000;
        return (
            <svg ref={node => this.node = node} width={width} height={height} className="Graph"></svg>
        )
    }
}
export default Graph