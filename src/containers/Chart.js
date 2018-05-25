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
        this.user = this.props.user;
    }

    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    createBarChart() {

        const imageSize = 50;

        const findUser = function (id) {
            for (let i in graph.users) {
                const user = graph.users[i];
                if (user._id === id) return user.display_name;
            }
        }

        let graph = this.relations;

        const svg = select("svg");
        const defs = svg.append('defs');
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        /* Restricts relations to the logged user */
        // graph.relations = graph.relations.filter(rel => rel.user_1 == this.user._id || rel.user_2 == this.user._id)

        graph.relations = graph.users.reduce((array, u) => {
            let relations = graph.relations.filter(rel => rel.user_1 == u._id || rel.user_2 == u._id);
            relations = relations.sort((a, b) => b.affinity - a.affinity);
            const cutRelations = relations.filter(rel => rel.affinity > 10);
            if(cutRelations.length == 0) cutRelations.push(relations[0]);
            cutRelations.forEach(r => array.push(r));
            return array;
        }, []);

        /* Restricts relactions to a certain affinity threshold */
        // graph.relations = graph.relations.filter(rel => rel.affinity > 10);

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
            .force("link", forceLink().id(d => d.display_name).distance(d => (imageSize * 10) - d.affinity * 5).strength(1))
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

        defs.selectAll('patterns')
            .data(graph.users)
            .enter()
            .append('pattern')
            .attr('id', d => d._id)
            .attr("height", 1)
            .attr("width", 1)
            .append('image')
            .attr('transform', `translate(-${imageSize},-${imageSize})`)
            .attr('preserveAspectRatio', "xMidYMid meet")
            .attr('xlink:href', d => d.images[0].url)

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.users)
            .enter()
            .append('circle')
            .attr('r', imageSize)
            .attr('fill', d => `url(#${d._id})`)
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
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;

        return (
            <svg ref={node => this.node = node} width={innerWidth} height={2000}>
            </svg>

        )

    }
}
export default BarChart