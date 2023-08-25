const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require("fs");
const { lookup } = require('geoip-lite');
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

/**
 * Get the country location from the IP address
 * @param {*} req 
 * @returns 
 */
function getCountryLocation(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // If the IP address is localhost, use my IP address
    if (ip = "::1") {
        ip = "81.152.36.114";
    }

    // Get the location from the IP address
    const location = lookup(ip).country;
    return location;
}

/**
 * Build the HTML details of the game title.
 * @param {string} id 
 * @param {string} location 
 * @returns HTML string with full details of the game title
 */
function buildTitleDetails(id, location, age) {
    const buffer = fs.readFileSync(path.join(__dirname, '/title-details.html'));
    const fileContent = buffer.toString();

    // Load the ratings details file
    const detailsBuffer = fs.readFileSync(path.join(__dirname, `/title-details/${id}.html`));
    let detailsContent = detailsBuffer.toString();

    detailsContent = detailsContent.replace("<!--{{age}}-->", age);

    // Append the ratings details based on the location
    let htmlToReturn = fileContent.replace("<!--{{Details}}-->", detailsContent);

    // Replace the age in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{age}}-->", age);

    // Replace the country in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{Location}}-->", `<strong>${location}</strong>`);
    return htmlToReturn;
}