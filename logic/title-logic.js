const path = require('path');
const fs = require("fs");
const { determineAgeRating, getLocationDetails, getUserFriendlyCountryNameFromCountryCode } = require('./country-rating-logic.js');

/**
 * Builds the HTML for the age rating
 * @param {int} enteredAge 
 * @param {string} result 
 * @param {string} title 
 * @returns 
 */
function buildAgeRatingHtml(enteredAge, result, title) {

    // Is the title banned in this location?
    if (result.isBanned) {
        return `<div class="relative bg-red-600 isolate px-6 lg:px-8"><div class="mx-auto max-w-2xl" style="padding-top: 8rem;padding-bottom: 5rem;"><div class="hidden sm:mb-8 sm:flex sm:justify-center"></div><div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-white">Unfortunately, ${title} is not available in your country.</h1></div></div></div>`;
    }

    // Then decide if the title is safe for the entered age and return the HTML
    if (enteredAge < result.titleAgeRating) {
        return `<div class="relative bg-red-600 isolate px-6 lg:px-8"><div class="mx-auto max-w-2xl" style="padding-top: 8rem;padding-bottom: 5rem;"><div class="hidden sm:mb-8 sm:flex sm:justify-center"></div><div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-white">No, ${title} is not safe for a ${enteredAge} year old.</h1></div></div></div>`;
    }
    else if (enteredAge >= result.titleAgeRating) {
        return `<div class="relative bg-green-600 isolate px-6 lg:px-8"><div class="mx-auto max-w-2xl" style="padding-top: 8rem;padding-bottom: 5rem;"><div class="hidden sm:mb-8 sm:flex sm:justify-center"></div><div class="text-center"><h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-white">Yes, ${title} is safe for a ${enteredAge} year old.</h1></div></div></div>`;
    }

}

/**
 * Loads the alternate title HTML based on the age entered
 * @param {int} age 
 * @returns 
 */
function loadAlternateTitle(age) {

    let filePath = '';

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
    detailsContent = detailsContent.replace("<!--{{steamStoreLink}}-->", details.storeLink.steam);
    detailsContent = detailsContent.replace("<!--{{xboxStoreLink}}-->", details.storeLink.xbox);
    detailsContent = detailsContent.replace("<!--{{platforms}}-->", details.platforms);

    // Hide the content issues section if there are no content issues
    if (details.otherIssues === '') {
        detailsContent = detailsContent.replace("{{hideIssues}}", "display: none;");
    }

    // Append the ratings details based on the location
    let htmlToReturn = fileContent.replace("<!--{{Details}}-->", detailsContent);

    // Determine if the title is safe for the entered age
    htmlToReturn = htmlToReturn.replace("<!--{{ageAppropriate}}-->", buildAgeRatingHtml(age, ageRating, details.title));

    // Replace the age in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{age}}-->", age);

    // Display the ratings details
    htmlToReturn = htmlToReturn.replace("<!--{{ratingsImageUrl}}-->", ageRating.ratingImage);

    // Write a friendly age category for certain country ratings
    if (ageRating.friendlyAgeTitle == "Everyone") {
        htmlToReturn = htmlToReturn.replace("<!--{{ratedAge}}-->", ageRating.friendlyAgeTitle);
    } else {
        htmlToReturn = htmlToReturn.replace("<!--{{ratedAge}}-->", ageRating.titleAgeRating);
    }

    htmlToReturn = htmlToReturn.replace("<!--{{ratedAge2}}-->", ageRating.titleAgeRating);
    htmlToReturn = htmlToReturn.replace("<!--{{ratingAuthority}}-->", ageRating.ratingAuthority);
    htmlToReturn = htmlToReturn.replace("{{ratingUrl}}", ageRating.ratingUrl);

    // Html title
    htmlToReturn = htmlToReturn.replace("<!--{{gameTitle}}-->", details.title);

    // Replace the country in the HTML file
    htmlToReturn = htmlToReturn.replace("<!--{{Location}}-->", `<strong>${getUserFriendlyCountryNameFromCountryCode(location.country)}</strong>`);
    return htmlToReturn;
}

/**
 * Builds the alternative title suggestion HTML
 * @param {string} ipAddress 
 * @param {int} age 
 * @returns 
 */
function buildSuggestionDetails(ipAddress, age) {
    const buffer = fs.readFileSync(path.join(__dirname, '/../suggestion.html'));
    let fileContent = buffer.toString();

    const location = getLocationDetails(ipAddress);

    fileContent = fileContent.replace("<!--{{EnteredAge}}-->", age);
    fileContent = fileContent.replace("<!--{{alternateTitle}}-->", loadAlternateTitle(age));

    // Replace the country in the HTML file
    fileContent = fileContent.replace("<!--{{Location}}-->", `<strong>${getUserFriendlyCountryNameFromCountryCode(location.country)}</strong>`);

    return fileContent;

}

module.exports = { buildTitleDetails, buildSuggestionDetails };
