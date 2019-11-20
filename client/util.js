

const sizeHelper = require("./size.js");

function buildText(allUsers) {
    let prefixes = ["@", "Reviews: ", "Approves: "];
    let attrs = ["name", "PR reviews", "PR approves"];
    let initialOffset = -1;
    for (let i = 0; i < 3; i ++) {
        allUsers
            .append("text")
            .text(d =>prefixes[i] + d[attrs[i]])
            .attr("dy",  initialOffset + i + "em")
            .attr("font-size", sizeHelper.resizeText)
            .style("text-anchor", "middle");
    }    
}

function generateColor() {
    let colorArr = [];
    for (let i = 0; i < 3; i ++) {
        let timeSeed = new Date().getSeconds();
        colorArr.push((timeSeed * 31 + (17 * Math.random() * 100 )) % 0xff);
    }
    
    return "rgb("+ colorArr[0] + "," + colorArr[1] + "," + colorArr[2] + ")"; 
}

module.exports = {
   buildText: buildText,
   generateColor: generateColor
}