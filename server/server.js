const express = require("express");
const path = require("path");
let app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    // temporary hack
    res.redirect(200, "/index.html");
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
        linkes: [
            {"src": "raymond", "dest": "will"},
            {"src": "raymond", "dest": "elisa"},
            {"src": "raymond", "dest": "adam"},
            {"src": "billy", "dest": "adam"}
        ]
    };

    res.send(mock_data);
});

app.listen(8080);