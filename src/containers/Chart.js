import React, { Component } from 'react'
import '../styles/App.css'
import { select } from 'd3-selection'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'

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
        const svg = select("svg");
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const simulation = forceSimulation()
            .force("link", forceLink().id(function (d) { return d.id; }))
            .force("charge", forceManyBody())
            .force("center", forceCenter(width / 2, height / 2));

        console.log(this.relations);

        // d3.json("miserables.json", function (error, graph) {
        //     if (error) throw error;

        //     var link = svg.append("g")
        //         .attr("class", "links")
        //         .selectAll("line")
        //         .data(graph.links)
        //         .enter().append("line")
        //         .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

        //     var node = svg.append("g")
        //         .attr("class", "nodes")
        //         .selectAll("circle")
        //         .data(graph.nodes)
        //         .enter().append("circle")
        //         .attr("r", 5)
        //         .attr("fill", function (d) { return color(d.group); })
        //         .call(d3.drag()
        //             .on("start", dragstarted)
        //             .on("drag", dragged)
        //             .on("end", dragended));

        //     node.append("title")
        //         .text(function (d) { return d.id; });

        //     simulation
        //         .nodes(graph.nodes)
        //         .on("tick", ticked);

        //     simulation.force("link")
        //         .links(graph.links);

        //     function ticked() {
        //         link
        //             .attr("x1", function (d) { return d.source.x; })
        //             .attr("y1", function (d) { return d.source.y; })
        //             .attr("x2", function (d) { return d.target.x; })
        //             .attr("y2", function (d) { return d.target.y; });

        //         node
        //             .attr("cx", function (d) { return d.x; })
        //             .attr("cy", function (d) { return d.y; });
        //     }
        // });

        // function dragstarted(d) {
        //     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        //     d.fx = d.x;
        //     d.fy = d.y;
        // }

        // function dragged(d) {
        //     d.fx = d3.event.x;
        //     d.fy = d3.event.y;
        // }

        // function dragended(d) {
        //     if (!d3.event.active) simulation.alphaTarget(0);
        //     d.fx = null;
        //     d.fy = null;
        // }
    }

    render() {
        return <svg ref={node => this.node = node}
            width={500} height={500}>
        </svg>
    }
}
export default BarChart