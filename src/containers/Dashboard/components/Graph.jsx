import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';
import { event } from 'd3';

import { GraphHelper } from '../../../utils/'

class Graph extends Component {

    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.users = this.props.users;
        this.default_weight = 4;
    }

    componentDidMount() {
        this.genreNodes = GraphHelper.setGenreNodes(this.users, this.default_weight);
        this.userNodes = GraphHelper.setUserNodes(this.users);
        this.nodes = this.genreNodes.concat(this.userNodes)
        this.links = GraphHelper.setLinks(this.users, this.genreNodes, this.default_weight);

        this.drawGraph();
    }

    drawGraph() {
        const svg = select('svg');
        const graph = svg.append('g');
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        const user_radius = 20;

        const simulation = forceSimulation()
            .force("link", forceLink().id(d => d.id).distance(200))
            .force("charge", forceManyBody())
            .force("center", forceCenter(width / 2, height / 2))
            .force('collision', forceCollide().radius(d => 200));

        const link = graph.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.links)
            .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(d.weight))
            .attr("class", "links")

        simulation
            .nodes(this.nodes)
            .on("tick", ticked)

        simulation.force("link")
            .links(this.links)

        const node = graph.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.nodes)
            .enter()
            .append('circle')
            .attr('r', g => g.weight ? getRadius(g.weight) : user_radius)
            .attr('fill', g => g.type === 'genre' ? 'blue' : 'red')
            .attr("class", g => g.type)
            .attr("id", g => `node_${g.id}`)
            .call(drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        const text = graph.append("g")
            .attr("class", "texts")
            .selectAll("circle")
            .data(this.nodes)
            .enter()
            .append("text")
            .text(d => d.name)
            .attr("text-anchor", "middle")

        node.append("title")
            .text(d => d.id);

        const zoom_svg = zoom()
            .on("zoom", () => {
                graph.attr('transform', event.transform) 

                selectAll('.user')
                .attr('r', () => user_radius/event.transform.k)
            });

        svg.call(zoom_svg);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            text
                .attr("x", d => d.x)
                .attr("y", d => (d.weight ? d.y + getRadius(d.weight) / 8 : d.y));
        }

        function getRadius(weight) {
            const max = 60;
            const min = 10;
            const mult = weight * 2;

            if (mult < min) return min;
            if (mult > max) return max;
            else return mult;
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
        return (
            <svg ref={node => this.node = node} width={this.props.width} height={this.props.height}></svg>
        )
    }
}
export default Graph