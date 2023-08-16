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
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.post('/title', (req, res) => {
    let data = req.body;
    console.log(JSON.stringify(data));

    // Get the location from the IP address
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // If the IP address is localhost, use my IP address
    if (ip = "::1") {
        ip = "81.152.36.114";
    }

    const location = lookup(ip).country;
    console.log(location);

    // Load the HTML file
    const buffer = fs.readFileSync(path.join(__dirname, '/title-details.html'));
    const fileContent = buffer.toString();

    // Load the ratings details file
    const detailsBuffer = fs.readFileSync(path.join(__dirname, '/details.html'));
    const detailsContent = detailsBuffer.toString();

    // Append the ratings details based on the location
    let htmlToReturn = fileContent.replace("<!--{{Details}}-->", detailsContent);

    // Suggest alternative titles

    // Return the HTML
    res.setHeader("Content-Type", "text/html")
    res.send(htmlToReturn);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})