const { buildTitleDetails, buildSuggestionDetails } = require('./logic/title-logic.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

// The public folder contains the CSS and JS files
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

/**
 * This is the endpoint that is called when the user clicks on a title
 */
app.get('/title/:title/:id/:age/:countryoverride', (req, res) => {
    let title = req.params.title;
    let id = req.params.id;
    let age = req.params.age;
    let countryoverride = req.params.countryoverride;

    // Build the HTML to return
    let htmlToReturn = buildTitleDetails(id, getIpAddress(req), age, countryoverride);

    // Return the HTML
    res.setHeader("Content-Type", "text/html")
    res.send(htmlToReturn);
})

/**
 * This is the endpoint that is called when the user chooses to see a suggested list 
 */
app.get('/suggest/:age', (req, res) => {
    let age = req.params.age;

    // Build the HTML to return
    let htmlToReturn = buildSuggestionDetails(getIpAddress(req), age);

    // Return the HTML
    res.setHeader("Content-Type", "text/html")
    res.send(htmlToReturn);
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

/**
 * Get the IP address of the user
 * @param {*} req 
 * @returns 
 */
function getIpAddress(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(req.connection.remoteAddress);

    // If the IP address is localhost, use my IP address
    if (ip = "::1") {
        ip = "81.152.36.114";
    }

    return ip;
}
