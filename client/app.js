const d3 = require("d3");
const axios = require('axios');
const sizeHelper = require('./size.js');
const util = require('./util.js');

axios.get('/data/someRepo')
    .then(res => drawGraph(res.data));

function drawGraph(data) {
    var svg = d3.select("svg");
    var width = window.innerWidth * 0.9;
    var height = width / 2;
    svg.style("width", width).style("height", height);

    var simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).distance(200).id((d) => { return d.name; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var userToolTip = d3.select("body").append("div")	
        .attr("class", "user-tooltip")				
        .style("opacity", 0);

    var eachEdge = svg
        .append("g")
        .attr("class", "edges")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke-width", sizeHelper.resizeEdge);

    var eachUser = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("id", (d) => "user_" + d.name)
        .call(d3
            .drag()
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

    eachUser.append("circle")
        .attr("r", sizeHelper.resizeCircle)
        .attr("fill", util.generateColor);
    
    util.buildText(eachUser, userToolTip);

    simulation
        .nodes(data.nodes)
        .on("tick", () => {
            eachEdge.attr("x1", (d) => { return d.source.x; })
                .attr("y1", (d) => { return d.source.y; })
                .attr("x2", (d) => { return d.target.x; })
                .attr("y2", (d) => { return d.target.y; });

            eachUser.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        });
}
