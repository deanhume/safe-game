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
 * Determines if the age entered is safe for the title and returns the HTML
 * @param {int} enteredAge 
 * @param {string} location 
 * @param {JSON} details 
 * @returns 
 */
function determineAgeRating(enteredAge, location, details) {

    let titleAgeRating = 0;
    enteredAge = parseInt(enteredAge);

    // First, determine the age rating for the title based on the location
    if (location == "US") {
        titleAgeRating = parseInt(details.rating.ESRB);
    } else if (location == "GB") {
        titleAgeRating = parseInt(details.rating.PEGI);
    }

    // Then decide if the title is safe for the entered age and return the HTML
    if (enteredAge < titleAgeRating) {
        return `<div class="relative bg-red-600 isolate px-6 lg:px-8"><div class="mx-auto max-w-2xl" style="padding-top: 8rem;padding-bottom: 5rem;"><div class="hidden sm:mb-8 sm:flex sm:justify-center"></div><div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-white">No, ${details.title} is not safe for a ${enteredAge} year old.</h1></div></div></div>`;
    }
    else if (enteredAge >= titleAgeRating) {
        return `<div class="relative bg-green-600 isolate px-6 lg:px-8"><div class="mx-auto max-w-2xl" style="padding-top: 8rem;padding-bottom: 5rem;"><div class="hidden sm:mb-8 sm:flex sm:justify-center"></div><div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-white">Yes, ${details.title} is safe for a ${enteredAge} year old.</h1></div></div></div>`;
    }
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
    const jsonDetails = fs.readFileSync(path.join(__dirname, `/title-details/${id}.json`));
    let details = JSON.parse(jsonDetails);

    const detailsBuffer = fs.readFileSync(path.join(__dirname, `/title-details/template.html`));
    let detailsContent = detailsBuffer.toString();

    detailsContent = detailsContent.replace("<!--{{title}}-->", details.title);
    detailsContent = detailsContent.replace("<!--{{studio}}-->", details.studio);
    detailsContent = detailsContent.replace("<!--{{outline}}-->", details.outline);
    detailsContent = detailsContent.replace("<!--{{contentIssues}}-->", details.contentIssues);
    detailsContent = detailsContent.replace("<!--{{otherIssues}}-->", details.otherIssues);
    detailsContent = detailsContent.replace("<!--{{age}}-->", age);
    detailsContent = detailsContent.replace("<!--{{imageUrl}}-->", `/images/${id}.png`);

    // Append the ratings details based on the location
    let htmlToReturn = fileContent.replace("<!--{{Details}}-->", detailsContent);

    // Determine if the title is safe for the entered age
    htmlToReturn = htmlToReturn.replace("<!--{{ageAppropriate}}-->", determineAgeRating(age, location, details));

    // Replace the age in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{age}}-->", age);

    // Replace the country in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{Location}}-->", `<strong>${location}</strong>`);
    return htmlToReturn;
}