const d3 = require("d3");

const data = {
    nodes: [
        {"name": "raymond", "PR reviews": 150, "PR approves": 323},
        {"name": "will", "PR reviews": 100, "PR approves": 13},
        {"name": "user 1", "PR reviews": 25, "PR approves": 30},
        {"name": "user 2", "PR reviews": 65, "PR approves": 23},
        {"name": "adam", "PR reviews": 75, "PR approves": 31},
        {"name": "billy", "PR reviews": 215, "PR approves": 233},
        {"name": "elisa", "PR reviews": 105, "PR approves": 133}
    ],
    linkes: [
        {"src": "raymond", "dest": "will"},
        {"src": "raymond", "dest": "elisa"},
        {"src": "raymond", "dest": "adam"},
        {"src": "billy", "dest": "adam"}
    ]
}

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