const { lookup } = require('geoip-lite');
const countries = require('i18n-iso-countries');

/**
 * Get the country location from the IP address
 * @param {*} ipAddress 
 * @returns 
 */
function getCountryLocation(ipAddress) {
    return lookup(ipAddress).country;
}

/**
 * Get the country location from the IP address
 * @param {*} ipAddress 
 * @returns 
 */
function getLocationDetails(ipAddress) {
    return lookup(ipAddress);
}

/**
 * Returns an Array of all country codes for ESRB - ie. The Americas
 * @returns Array
 */
function returnAllESRB() {
    return ["US", "CA", "AS", "AR", "BS", "BZ", "BM", "BO", "VG", "CO", "CR", "EC", "SV", "GF", "GU", "GT", "GY", "HN", "MX", "NI", "MP", "PA", "PY", "PE", "PR", "WS", "SR", "VI", "UY", "VE"];
}

/**
 * Returns array of all country codes for PEGI - ie. Europe
 * @returns Array
 */
function returnAllPEGI() {
    return ["AL", "AT", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GR", "HU", "IS", "IN", "IE", "IL", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "ME", "NL", "NO", "PL", "PT", "RO", "RS", "SK", "SI", "ES", "SE", "CH", "TR", "GB"];
}

/**
 * Returns a user friendly country name from the country code
 * @param {string} countryCode 
 * @returns 
 */
function getUserFriendlyCountryNameFromCountryCode(countryCode) {
    return countries.getName(countryCode, "en");
}

/**
 * Determines if the age entered is safe for the title and returns the HTML
 * countryOverride gives you the option to test a different country. 
 * TODO: This code is a bit messy and could do with a tidy up!
 * @param {int} enteredAge 
 * @param {string} ipAddress 
 * @param {JSON} details 
 * @param {JSON} countryOverride
 * @returns 
 */
function determineAgeRating(enteredAge, ipAddress, details, countryOverride) {

    let titleAgeRating = 0;
    let ratingImage = '';
    let isBanned = false;
    enteredAge = parseInt(enteredAge);

    // Get the location details
    let location = getLocationDetails(ipAddress);

    if (countryOverride) {
        location.country = countryOverride;
    }

    // First, determine the age rating for the title based on the location
    if (returnAllESRB().includes(location.country)) { // Americas
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.ESRB);
        ratingImage = `/images/esrb/${details.rating.ESRB}.svg`;
        ratingAuthority = "ESRB";
    } else if (location.country == "BR") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.DJCTQ);
        ratingImage = `/images/djctq/${details.rating.DJCTQ}.svg`;
        ratingAuthority = "DJCTQ";
    } else if (location.country == "JP") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.CERO);
        ratingImage = `/images/cero/${details.rating.CERO}.svg`;
        ratingAuthority = "CERO";
    } else if (location.country == "KR") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.GRAC);
        ratingImage = `/images/grac/${details.rating.GRAC}.svg`;
        ratingAuthority = "GRAC";
    } else if (location.country == "NZ") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.OFLC);
        ratingImage = `/images/oflc/${details.rating.OFLC}.svg`;
        ratingAuthority = "OFLC";
    } else if (location.country == "DE") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.USK);
        ratingImage = `/images/usk/${details.rating.USK}.svg`;
        ratingAuthority = "USK";
    } else if (location.country == "AU") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.ACB);
        ratingImage = `/images/acb/${details.rating.ACB}.svg`;
        ratingAuthority = "ACB";
    } else if (location.country == "SG") { // Singapore defaults to ESRB ratings
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.IMDA);
        ratingImage = `/images/esrb/${details.rating.IMDA}.svg`;
        ratingAuthority = "IMDA";
    } else if (location.country == "ZA") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.FPB);
        ratingImage = `/images/fpb/${details.rating.FPB}.svg`;
        ratingAuthority = "FPB";
    } else if (location.country == "RU") {
        isBanned = parseInt(details.rating.PCBP) ? false : true;
        titleAgeRating = parseInt(details.rating.PCBP);
        ratingImage = `/images/pcbp/${details.rating.PCBP}.png`;
        ratingAuthority = "PCBP";
    } else if (location.country == "SA") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.GCAM);
        ratingImage = `/images/gcam/${details.rating.GCAM}.png`;
        ratingAuthority = "GCAM";
    } else if (location.country == "AE") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.MRO);
        ratingImage = `/images/mro/${details.rating.MRO}.png`;
        ratingAuthority = "MRO";
    } else if (location.country == "TW") {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.CSRR);
        ratingImage = `/images/csrr/${details.rating.CSRR}.svg`;
        ratingAuthority = "CSRR";
    } else if (returnAllPEGI().includes(location.country)) { // PEGI - Europe
        isBanned = parseInt(details.rating.PEGI) ? false : true;
        titleAgeRating = parseInt(details.rating.PEGI);
        ratingImage = `/images/pegi/${details.rating.PEGI}.svg`;
        ratingAuthority = "PEGI";
    } 
    // IARC - This is the default fallback for countries that don't have a rating system 
    else {
        isBanned = parseInt(details.rating.ESRB) ? false : true;
        titleAgeRating = parseInt(details.rating.PEGI);
        ratingImage = `/images/IARC/${details.rating.PEGI}.svg`;
        ratingAuthority = "IARC";
    }

    // One last check to see if the title is banned, and return the correct image
    if (isBanned) {
        ratingImage = '/images/not-available.svg';
    }

    return { titleAgeRating, ratingImage, isBanned, ratingAuthority };

}

module.exports = { determineAgeRating, getCountryLocation, getLocationDetails, getUserFriendlyCountryNameFromCountryCode };