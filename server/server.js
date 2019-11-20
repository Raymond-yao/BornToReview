const express = require("express");
const path = require("path");
const fs = require("fs");
let app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

app.get('/insight', (req, res) => {
    var appHtml = fs.readFile(
        path.join(__dirname + '/../public/app.html'),
        {encoding: 'UTF-8'},
        (err, data) => {
            // a hack here to achieve an easy template engine.
            let finalHtml = data
                .replace("$repoName", req.query.name)
                .replace("$repoOwner", req.query.owner);
            res.send(finalHtml);
        }
    )
});

app.get('/data/:repo', (req, res) => {
    let mock_data = {
        nodes: [
            {"name": "raymond", "PR reviews": 150, "PR approves": 323},
            {"name": "will", "PR reviews": 100, "PR approves": 13},
            {"name": "user 1", "PR reviews": 25, "PR approves": 30},
            {"name": "user 2", "PR reviews": 65, "PR approves": 23},
            {"name": "adam", "PR reviews": 75, "PR approves": 31},
            {"name": "billy", "PR reviews": 215, "PR approves": 233},
            {"name": "elisa", "PR reviews": 115, "PR approves": 133}
        ],
        links: [
            {"source": "raymond", "target": "will"},
            {"source": "raymond", "target": "elisa"},
            {"source": "raymond", "target": "adam"},
            {"source": "billy", "target": "adam"}
        ]
    };

    res.send(mock_data);
});

app.listen(8080);