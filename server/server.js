const express = require("express");
const path = require("path");
const fs = require("fs");
const logger = require('tracer').console();
require('dotenv').config();

const Github = require("./module/github");
let github = new Github();
const {getPRData} = require('./module/pr-analysis-util');

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

app.get('/data/:owner/:repo', async (req, res) => {
    const data = await getPRData(req.params.owner, req.params.repo);
    res.send(data);
});

app.listen(8080);