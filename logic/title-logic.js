
const path = require('path');
const fs = require("fs");
const { determineAgeRating, getLocationDetails } = require('./country-rating-logic.js');

function buildAgeRatingHtml(enteredAge, result, title) {

    // Then decide if the title is safe for the entered age and return the HTML
    if (enteredAge < result.titleAgeRating) {
        return `<div class="relative bg-red-600 isolate px-6 lg:px-8"><div class="mx-auto max-w-2xl" style="padding-top: 8rem;padding-bottom: 5rem;"><div class="hidden sm:mb-8 sm:flex sm:justify-center"></div><div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-white">No, ${title} is not safe for a ${enteredAge} year old.</h1></div></div></div>`;
    }
    else if (enteredAge >= result.titleAgeRating) {
        return `<div class="relative bg-green-600 isolate px-6 lg:px-8"><div class="mx-auto max-w-2xl" style="padding-top: 8rem;padding-bottom: 5rem;"><div class="hidden sm:mb-8 sm:flex sm:justify-center"></div><div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-white">Yes, ${title} is safe for a ${enteredAge} year old.</h1></div></div></div>`;
    }

}

// TODO: Update this to include the correct alternate titles based on age
function loadAlternateTitle(age) {

    let filePath = "";

    if (age <= 7) {
        filePath = path.join(__dirname, '/../alternate-titles/age3.html');
    } else if (age < 12) {
        filePath = path.join(__dirname, '/../alternate-titles/age7.html');
    } else if (age < 16) {
        filePath = path.join(__dirname, '/../alternate-titles/age12.html');
    } else if (age < 18) {
        filePath = path.join(__dirname, '/../alternate-titles/age16.html');
    } else if (age >= 18) {
        filePath = path.join(__dirname, '/../alternate-titles/age18.html');
    }

    const buffer = fs.readFileSync(filePath);
    return buffer.toString();
}

/**
 * Build the HTML details of the game title.
 * @param {string} id 
 * @param {string} ipAddress 
 * @returns HTML string with full details of the game title
 */
function buildTitleDetails(id, ipAddress, age, countryOverride) {

    const buffer = fs.readFileSync(path.join(__dirname, '/../title-details.html'));
    const fileContent = buffer.toString();
    const location = getLocationDetails(ipAddress);
    
    // Load the ratings json file
    const jsonDetails = fs.readFileSync(path.join(__dirname, `/../data/${id}.json`));
    let details = JSON.parse(jsonDetails);

    // Determine the age rating details
    const ageRating = determineAgeRating(age, ipAddress, details, countryOverride);

    // Load in the HTML template for the game details
    const detailsBuffer = fs.readFileSync(path.join(__dirname, `/../data/template.html`));
    let detailsContent = detailsBuffer.toString();

    detailsContent = detailsContent.replace("<!--{{title}}-->", details.title);
    detailsContent = detailsContent.replace("<!--{{studio}}-->", details.studio);
    detailsContent = detailsContent.replace("<!--{{outline}}-->", details.outline);
    detailsContent = detailsContent.replace("<!--{{contentIssues}}-->", details.contentIssues);
    detailsContent = detailsContent.replace("<!--{{otherIssues}}-->", details.otherIssues);
    detailsContent = detailsContent.replace("<!--{{alternateTitle}}-->", loadAlternateTitle(age));
    detailsContent = detailsContent.replace("<!--{{imageUrl}}-->", `/images/${id}.png`);
    detailsContent = detailsContent.replace("<!--{{age}}-->", age);

    // Append the ratings details based on the location
    let htmlToReturn = fileContent.replace("<!--{{Details}}-->", detailsContent);

    // Determine if the title is safe for the entered age
    htmlToReturn = htmlToReturn.replace("<!--{{ageAppropriate}}-->", buildAgeRatingHtml(age, ageRating, details.title));

    // Replace the age in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{age}}-->", age);

    // Display the correct Ratings image
    // TODO: Need to fix this properly
    htmlToReturn = htmlToReturn.replace("<!--{{ratingsImageUrl}}-->", ageRating.ratingImage);

    htmlToReturn = htmlToReturn.replace("<!--{{ipAddress}}-->", `${ipAddress}-${location.country}`);

    // Replace the country in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{Location}}-->", `<strong>${location.country}</strong>`);
    return htmlToReturn;
}

function buildSuggestionDetails(location, age) {
    const buffer = fs.readFileSync(path.join(__dirname, '/../suggestion.html'));
    let fileContent = buffer.toString();

    fileContent = fileContent.replace("<!--{{EnteredAge}}-->", age);

    // TODO: Think about different locations and the appropriate age suggestions
    fileContent = fileContent.replace("<!--{{alternateTitle}}-->", loadAlternateTitle(age));

    return fileContent;

}

module.exports = { buildTitleDetails, buildSuggestionDetails };
