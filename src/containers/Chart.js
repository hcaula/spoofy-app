import React, { Component } from 'react'
import '../styles/App.css'
import { select } from 'd3-selection'
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
        let graph = this.relations;

        const svg = select("svg");
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        /* Removing the week affinities */
        graph.relations = graph.relations.sort((a,b) => b.affinity - a.affinity);
        graph.relations = graph.relations.slice(0, graph.relations.length/2);

        graph.relations = graph.relations.map(rel => {
            let ret = rel;
            ret.value = rel.affinity;
            return ret;
        });

        const simulation = forceSimulation()
            .force("link", forceLink().id(function (d) { return d.id; }))
            .force("charge", forceManyBody())
            .force("center", forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.relations)
            .enter().append("line")
            .attr("stroke-width", function (d) { return Math.sqrt(d.affinity); });

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.users)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", function (d) { return 'blue'; })
            .call(drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) { return d.display_name; });

        simulation
            .nodes(graph.users)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.relations);

        function ticked() {
            link
                .attr("x1", function (d) { return findUser(d.user_1).x; })
                .attr("y1", function (d) { return findUser(d.user_1).y; })
                .attr("x2", function (d) { return findUser(d.user_2).x; })
                .attr("y2", function (d) { return findUser(d.user_2).y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        const findUser = function(id) {
            for (let i in graph.users) {
                const user = graph.users[i];
                if(user._id == id) return user;
            }
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
            width={500} height={500}>
        </svg>
    }
}
export default BarChart