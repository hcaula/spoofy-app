import React, { Component } from 'react'
import '../styles/App.css'
import { select, selectAll } from 'd3-selection'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'
import { drag } from 'd3-drag'
import { event } from 'd3'

class BarChart extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
        this.relations = this.props.relations;
    }

    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    createBarChart() {

        const imageSize = 75;

        const findUser = function (id) {
            for (let i in graph.users) {
                const user = graph.users[i];
                if (user._id === id) return user.display_name;
            }
        }

        let graph = this.relations;

        const svg = select("svg");
        const defs = svg.append('svg:defs');
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        graph.users = graph.users.map(user => {
            let ret = user;
            ret.id = user.display_name;
            return ret;
        })

        graph.relations = graph.relations.map(rel => {
            let ret = rel;
            ret.source = findUser(ret.user_1);
            ret.target = findUser(ret.user_2);
            ret.value = Math.sqrt(ret.affinity);
            return ret;
        })

        const simulation = forceSimulation()
            .force("link", forceLink().id(d => d.display_name).distance(d => (imageSize * 4) - d.affinity * 10).strength(0.8))
            .force("charge", forceManyBody())
            .force("center", forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.relations)
            .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(d.affinity));

        simulation
            .nodes(graph.users)
            .on("tick", ticked)

        simulation.force("link")
            .links(graph.relations)

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.users)
            .enter().append("image")
            .attr('r', imageSize)
            .attr("xlink:href", d => d.images[0].url)
            .attr("height", imageSize)
            .attr("width", imageSize)
            .attr("x", d => 0)
            .attr("y", d => 0)
            .call(drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(d => d.display_name);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("x", d => d.x - imageSize/2)
                .attr("y", d => d.y - imageSize/2);
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
        return <svg ref={node => this.node = node}
            width={1000} height={1000}>
        </svg>
    }
}
export default BarChart