const d3 = require("d3");
const axios = require('axios');

// right now the repo name is just a stub as we always return fake data.
axios.get('/data/someRepo')
    .then(res => drawGraph(res.data));

function drawGraph(data) {
    var svg = d3.select("svg");
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var width = 960;
    var height = 600;

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var eachUser = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter().append("g");

    eachUser.append("circle")
        .attr("r", d => d["PR reviews"] / 2)
        .attr("fill", d => color(Math.random() * 10))
        .call(d3.drag()
            .on("drag", (d) => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
            .on("start", (d) => {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("end", (d) => {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            })
        );

    eachUser.append("text")
        .text(d => {return d.name;})
        .attr("dy", ".2em")
        .attr("font-size", d => d["PR reviews"] / 7)
        .style("text-anchor", "middle");


    simulation
        .nodes(data.nodes)
        .on("tick", () => {
        eachUser
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        });
}
