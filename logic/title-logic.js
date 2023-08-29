const { lookup } = require('geoip-lite');
const path = require('path');
const fs = require("fs");

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

// TODO: Update this to include the correct alternate titles based on age
function loadAlternateTitle(age) {

    let fileContent = "";

    if (age <= 3) {
        const buffer = fs.readFileSync(path.join(__dirname, '/../alternate-titles/age3.html'));
        fileContent = buffer.toString();
    }
    else {
        const buffer = fs.readFileSync(path.join(__dirname, '/../alternate-titles/age7.html'));
        fileContent = buffer.toString();
    }

    return fileContent.replace("<!--{{age}}-->", age);
}

/**
 * Build the HTML details of the game title.
 * @param {string} id 
 * @param {string} location 
 * @returns HTML string with full details of the game title
 */
function buildTitleDetails(id, location, age) {

    const buffer = fs.readFileSync(path.join(__dirname, '/../title-details.html'));
    const fileContent = buffer.toString();

    // Load the ratings json file
    const jsonDetails = fs.readFileSync(path.join(__dirname, `/../title-details/${id}.json`));
    let details = JSON.parse(jsonDetails);

    // Load in the HTML template for the game details
    const detailsBuffer = fs.readFileSync(path.join(__dirname, `/../title-details/template.html`));
    let detailsContent = detailsBuffer.toString();

    detailsContent = detailsContent.replace("<!--{{title}}-->", details.title);
    detailsContent = detailsContent.replace("<!--{{studio}}-->", details.studio);
    detailsContent = detailsContent.replace("<!--{{outline}}-->", details.outline);
    detailsContent = detailsContent.replace("<!--{{contentIssues}}-->", details.contentIssues);
    detailsContent = detailsContent.replace("<!--{{otherIssues}}-->", details.otherIssues);
    detailsContent = detailsContent.replace("<!--{{alternateTitle}}-->", loadAlternateTitle(age));
    detailsContent = detailsContent.replace("<!--{{imageUrl}}-->", `/images/${id}.png`);

    // Append the ratings details based on the location
    let htmlToReturn = fileContent.replace("<!--{{Details}}-->", detailsContent);

    // Determine if the title is safe for the entered age
    htmlToReturn = htmlToReturn.replace("<!--{{ageAppropriate}}-->", determineAgeRating(age, location, details));

    // Replace the age in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{age}}-->", age);

    // Display the correct Ratings image
    // TODO: Need to fix this properly
    htmlToReturn = htmlToReturn.replace("<!--{{ratingsImageUrl}}-->", `/images/pegi/${details.rating.PEGI}.png`);


    // Replace the country in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{Location}}-->", `<strong>${location}</strong>`);
    return htmlToReturn;
}

module.exports = { buildTitleDetails, getCountryLocation };
