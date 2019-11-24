const express = require("express");
const path = require("path");
const fs = require("fs");
const logger = require('tracer').console();

const Github = require("./module/github");
let github = new Github();

let app = express();
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

app.get('/insight', (req, res) => {
    fs.readFile(
        path.join(__dirname + '/../public/app.html'),
        {encoding: 'UTF-8'},
        (err, data) => {
            // a hack here to achieve an easy template engine.
            let finalHtml = data
                .replace("$repoName", req.query.name)
                .replace("$repoOwner", req.query.owner);
            res.send(finalHtml);
        }
    );
});

app.get('/user/:username', (req, res) => {
    github.getUser(req.params.username).then(data => {
        res.send(data);
    });
});

app.get('/data/:owner/:repo', (req, res) => {

    let mock_data = {
        nodes: [
            {"name": "Raymond-yao", "PR reviews": 150, "PR approves": 323},
            {"name": "WillCZhang", "PR reviews": 100, "PR approves": 13},
            {"name": "vczh", "PR reviews": 25, "PR approves": 30},
            {"name": "azusa0127", "PR reviews": 65, "PR approves": 23},
            {"name": "micromoon1997", "PR reviews": 75, "PR approves": 31},
            {"name": "y396920969", "PR reviews": 215, "PR approves": 233},
            {"name": "Leoaqr", "PR reviews": 115, "PR approves": 133}
        ],
        links: [
            {"source": "Raymond-yao", "target": "WillCZhang", "approves": 33, "request_changes": 100},
            {"source": "Raymond-yao", "target": "Leoaqr", "approves": 133, "request_changes": 2},
            {"source": "Raymond-yao", "target": "micromoon1997", "approves": 5, "request_changes": 300},
            {"source": "y396920969", "target": "micromoon1997", "approves": 50, "request_changes": 30}
        ]
    };

    res.send(mock_data);
});

app.listen(8080);