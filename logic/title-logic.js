
const path = require('path');
const fs = require("fs");
const { determineLogoBasedOnCountryAndAge, getCountryLocation, getLocationDetails } = require('./country-rating-logic.js');

/**
 * Determines if the age entered is safe for the title and returns the HTML
 * @param {int} enteredAge 
 * @param {string} ipAddress 
 * @param {JSON} details 
 * @returns 
 */
function determineAgeRating(enteredAge, ipAddress, details) {

    let titleAgeRating = 0;
    let ratingImage = "";
    enteredAge = parseInt(enteredAge);

    // Get the location details
    const location = getLocationDetails(ipAddress);

    // First, determine the age rating for the title based on the location
    if (location.eu = "1") {
        titleAgeRating = parseInt(details.rating.PEGI);
        ratingImage = `/images/pegi/${details.rating.PEGI}.svg`;
    } else if (location.country == "US") {
        titleAgeRating = parseInt(details.rating.ESRB);
        ratingImage = `/images/esrb/${details.rating.ESRB}.svg`;
    } else if (location.country == "DJCTQ") {
        titleAgeRating = parseInt(details.rating.DJCTQ);
        ratingImage = `/images/djctq/${details.rating.DJCTQ}.svg`;
    } else if (location.country == "CERO") {
        titleAgeRating = parseInt(details.rating.CERO);
        ratingImage = `/images/cero/${details.rating.CERO}.svg`;
    } else if (location.country == "GRAC") {
        titleAgeRating = parseInt(details.rating.GRAC);
        ratingImage = `/images/grac/${details.rating.GRAC}.svg`;
    } else if (location.country == "OFLC") {
        titleAgeRating = parseInt(details.rating.OFLC);
        ratingImage = `/images/oflc/${details.rating.OFLC}.svg`;
    } else if (location.country == "USK") {
        titleAgeRating = parseInt(details.rating.USK);
        ratingImage = `/images/usk/${details.rating.USK}.svg`;
    } else if (location.country == "ACB") {
        titleAgeRating = parseInt(details.rating.ACB);
        ratingImage = `/images/acb/${details.rating.ACB}.svg`;
    } else if (location.country == "IMDA") {
        titleAgeRating = parseInt(details.rating.IMDA);
        ratingImage = `/images/imda/${details.rating.IMDA}.svg`;
    } else if (location.country == "FPB") {
        titleAgeRating = parseInt(details.rating.FPB);
        ratingImage = `/images/fpb/${details.rating.FPB}.svg`;
    } else if (location.country == "KMRB") {
        titleAgeRating = parseInt(details.rating.KMRB);
        ratingImage = `/images/kmrb/${details.rating.KMRB}.svg`;
    } else if (location.country == "PCBP") {
        titleAgeRating = parseInt(details.rating.PCBP);
        ratingImage = `/images/pcbp/${details.rating.PCBP}.svg`;
    } else if (location.country == "GCAM") {
        titleAgeRating = parseInt(details.rating.GCAM);
        ratingImage = `/images/gcam/${details.rating.GCAM}.svg`;
    } else if (location.country == "MRO") {
        titleAgeRating = parseInt(details.rating.MRO);
        ratingImage = `/images/mro/${details.rating.MRO}.svg`;
    } else if (location.country == "CSRR") {
        titleAgeRating = parseInt(details.rating.CSRR);
        ratingImage = `/images/csrr/${details.rating.CSRR}.svg`;
    } else if (location.country == "OFLC") {
        titleAgeRating = parseInt(details.rating.OFLC);
        ratingImage = `/images/oflc/${details.rating.OFLC}.svg`;
    }

    return { titleAgeRating, ratingImage };

}

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
function buildTitleDetails(id, ipAddress, age) {

    const buffer = fs.readFileSync(path.join(__dirname, '/../title-details.html'));
    const fileContent = buffer.toString();
    const location = getLocationDetails(ipAddress);
    
    // Load the ratings json file
    const jsonDetails = fs.readFileSync(path.join(__dirname, `/../title-details/${id}.json`));
    let details = JSON.parse(jsonDetails);

    // Determine the age rating details
    const ageRating = determineAgeRating(age, ipAddress, details);

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
