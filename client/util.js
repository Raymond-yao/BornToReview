

const sizeHelper = require("./size.js");
const d3 = require("d3");
const axios = require('axios');
let tooltipData = {};

function buildText(allUsers, userToolTip) {
    let prefixes = ["@", "Reviews: ", "Approves: "];
    let attrs = ["name", "PR reviews", "PR approves"];
    let initialOffset = -1;
    for (let i = 0; i < 3; i ++) {
        let text = allUsers
            .append("text")
            .text(d =>prefixes[i] + d[attrs[i]])
            .attr("dy",  initialOffset + i + "em")
            .attr("font-size", sizeHelper.resizeText)
            .style("text-anchor", "middle");

            if (i === 0) {
                // add mouse over to username only
                text
                    .attr("font-family", "")
                    .attr("class", "user-name-text")
                    .attr("hovered", "false")
                    .on("click", (d) => {
                        // fast hack to make hyperlink: I don't want to adjust svg again...
                        window.location.href="https://github.com/" + d.name;
                        return false;
                    })
                    .on("mouseover", (d) => {
                        buildTooltip(d, userToolTip);
                    })
                    .on("mouseout", (d) => {
                        userToolTip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }
    }
}

function buildTooltip(d, userToolTip) {
    if (tooltipData[d.name]) {
        userToolTip.transition()
            .duration(200)
            .style("opacity", 1);
        userToolTip.html(tooltipBuilder(tooltipData[d.name]));
    } else {
        userToolTip.transition()
        .duration(200)
        .style("opacity", 1);
        userToolTip.html(pendingTooltip());
        adjustPendingTooltip(userToolTip);

        // use closure to memorize the coordinates of mouse over event
        // as after axios's promise gets resolved the coordinates are lost.
        let corX = d3.event.pageX;
        let corY = d3.event.pageY;

        axios.get('/user/' + d.name)
            .then(userData => {
                tooltipData[d.name] = userData;
                adjustRealTooltipPos(userToolTip, corX, corY);
                userToolTip.html(tooltipBuilder(userData));
            })
            .catch(err => {
                userToolTip.html(defaultTooltip());
            })
    }
}

function adjustPendingTooltip(userToolTip) {
    if (d3.event.pageX + 300 < window.innerWidth) {
        userToolTip.style("left", (d3.event.pageX + 10) + "px");
    } else {
        userToolTip.style("left", (window.innerWidth - 300) + "px");
    }

    if (d3.event.pageY - 28 + 200 < window.innerHeight) {
        userToolTip.style("top", (d3.event.pageY - 28) + "px");
    } else {
        userToolTip.style("top", (window.innerHeight - 202) + "px");
    }
}

function adjustRealTooltipPos(userToolTip, x, y) {
    if (x + 300 < window.innerWidth) {
        userToolTip.style("left", (x + 10) + "px");
    } else {
        userToolTip.style("left", (window.innerWidth - 300) + "px");
    }

    if (y - 28 + 500 < window.innerHeight) {
        userToolTip.style("top", (y - 28) + "px");
    } else {
        userToolTip.style("top", (window.innerHeight - 514 ) + "px");
    }
}

function pendingTooltip() {
    return  '<div class="card tooltip-card" style="width: 18rem;">' +
            '<div class="spinning-container"><div class="spinning"></div></div></div>';
}

function defaultTooltip() {
    return  '<div class="card tooltip-card" style="width: 18rem;">' +
            '<img src="/image/github-octocat.png" class="card-img-top"><div class="card-body">' +
            '<h5 class="card-title">@GitHub_user</h5>' +
            '<p class="card-text">No Introduction</p>' +
            '</div></div>';
}

function getOrElse(stuff, els) {
    return stuff ? stuff : els;
}

function getOrNone(stuff) {
    return getOrElse(stuff, "None");
}

function tooltipBuilder(userData) {
    let template =  '<div class="card tooltip-card" style="width: 18rem;">' +
                    '<img src="$img-src" class="card-img-top"><div class="card-body">' +
                    '<h5 class="card-title">$user-name</h5>' +
                    '<table style="width:100%">' +
                    '<tr><td class="info-title" valign="top">Email: </td><td valign="top" class="info-container">$email</td></tr>' +
                    '<tr><td class="info-title" valign="top">Bio:</td><td valign="top" class="info-container">$bio</td></tr>' +
                    '<tr><td class="info-title" valign="top">Location: </td><td valign="top" class="info-container">$location</td></tr>' +
                    '</table></div></div>';

    let finalTooltip = template.replace("$img-src", userData.data.avatar_url)
            .replace("$user-name", getOrElse(userData.data.name, userData.data.login))
            .replace("$email", getOrNone(userData.data.email))
            .replace("$bio", getOrNone(userData.data.bio))
            .replace("$location", getOrNone(userData.data.location));

    return finalTooltip;
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
};