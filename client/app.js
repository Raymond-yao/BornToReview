const d3 = require("d3");
const axios = require('axios');
const sizeHelper = require('./size.js');
const util = require('./util.js');

axios.get('/data/someRepo')
    .then(res => drawGraph(res.data));

function toggleFilterBoard() {
    let board = document.querySelector("#filter-board");
    board.style.opacity = board.style.opacity == "0" ? "1" : "0";
    board.style.visibility = board.style.visibility == "hidden" ? "visible" : "hidden";
}

function updateTopVal() {
    document.querySelector("#top-user-val").textContent = document.querySelector("#top-user-range").value;
}

document.querySelector(".filter-button").addEventListener("click", toggleFilterBoard);
document.querySelector("#top-user-range").addEventListener("input", updateTopVal);

function drawGraph(data) {
    let svg = d3.select("svg");
    let width = window.innerWidth * 0.9;
    let height = window.innerHeight - 60;
    svg.style("width", width).style("height", height);

    let simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).distance(200).id((d) => { return d.name; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    let userToolTip = d3.select("body").append("div")	
        .attr("class", "user-tooltip")				
        .style("opacity", 0);

    let edges = svg
        .append("g")
        .attr("class", "edges")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("showing", "ap")
        .attr("stroke", "#34d058")
        .attr("stroke-width", sizeHelper.resizeEdge)
        .on("click", d => {
            let color = {
                "ap": "#34d058",
                "re": "red"
            }
            let dataAttr = {
                "ap": "approves",
                "re": "request_changes"
            }
            let e = d3.event.target;
            e.setAttribute("showing", e.getAttribute("showing") === "ap" ? "re" : "ap");
            let currentColor = e.getAttribute("showing");
            e.setAttribute("stroke", color[currentColor]);
            e.setAttribute("stroke-width", sizeHelper.edgeSizeHelper(d[dataAttr[currentColor]]));
        });
    

    let eachUser = svg
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
            edges.attr("x1", (d) => { return d.source.x; })
                .attr("y1", (d) => { return d.source.y; })
                .attr("x2", (d) => { return d.target.x; })
                .attr("y2", (d) => { return d.target.y; });

            eachUser.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        });
}
