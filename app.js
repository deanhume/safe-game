const  { buildTitleDetails, getCountryLocation } = require('./logic/title-logic.js');
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
app.get('/title/:title/:id/:age', (req, res) => {
    let title = req.params.title;
    let id = req.params.id;
    let age = req.params.age;

    // Get the location from the IP address
    const location = getCountryLocation(req);

    // Build the HTML to return
    let htmlToReturn = buildTitleDetails(id, location, age);

    // Return the HTML
    res.setHeader("Content-Type", "text/html")
    res.send(htmlToReturn);
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

