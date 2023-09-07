const { lookup } = require('geoip-lite');

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
 * Returns an Array of all ESRB ratings
 * @returns Array
 */
function returnAllESRB() {
    return ["US", "CA", "AS", "AR", "BS", "BZ", "BM", "BO", "VG", "CO", "CR", "EC", "SV", "GF", "GU", "GT", "GY", "HN", "MX", "NI", "MP", "PA", "PY", "PE", "PR", "WS", "SR", "VI", "UY", "VE"];
}

function returnAllPEGI() {
    return ["AL", "AT", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GR", "HU", "IS", "IN", "IE", "IL", "IT", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "ME", "NL", "NO", "PL", "PT", "RO", "RS", "SK", "SI", "ES", "SE", "CH", "TR", "GB"];
}

/**
 * Determines if the age entered is safe for the title and returns the HTML
 * countryOverride gives you the option to test a different country
 * @param {int} enteredAge 
 * @param {string} ipAddress 
 * @param {JSON} details 
 * @param {JSON} countryOverride
 * @returns 
 */
function determineAgeRating(enteredAge, ipAddress, details, countryOverride) {

    let titleAgeRating = 0;
    let ratingImage = '';
    enteredAge = parseInt(enteredAge);

    // Get the location details
    let location = getLocationDetails(ipAddress);

    if (countryOverride) {
        location.country = countryOverride;
    }

    // First, determine the age rating for the title based on the location
    if (returnAllESRB().includes(location.country)) { // Americas
        titleAgeRating = parseInt(details.rating.ESRB);
        ratingImage = `/images/esrb/${details.rating.ESRB}.svg`;
    } else if (location.country == "BR") {
        titleAgeRating = parseInt(details.rating.DJCTQ);
        ratingImage = `/images/djctq/${details.rating.DJCTQ}.svg`;
    } else if (location.country == "JP") {
        titleAgeRating = parseInt(details.rating.CERO);
        ratingImage = `/images/cero/${details.rating.CERO}.svg`;
    } else if (location.country == "KR") {
        titleAgeRating = parseInt(details.rating.GRAC);
        ratingImage = `/images/grac/${details.rating.GRAC}.svg`;
    } else if (location.country == "NZ") {
        titleAgeRating = parseInt(details.rating.OFLC);
        ratingImage = `/images/oflc/${details.rating.OFLC}.svg`;
    } else if (location.country == "DE") {
        titleAgeRating = parseInt(details.rating.USK);
        ratingImage = `/images/usk/${details.rating.USK}.svg`;
    } else if (location.country == "AU") {
        titleAgeRating = parseInt(details.rating.ACB);
        ratingImage = `/images/acb/${details.rating.ACB}.svg`;
    } else if (location.country == "SG") {
        titleAgeRating = parseInt(details.rating.IMDA);
        ratingImage = `/images/imda/${details.rating.IMDA}.svg`;
    } else if (location.country == "ZA") {
        titleAgeRating = parseInt(details.rating.FPB);
        ratingImage = `/images/fpb/${details.rating.FPB}.svg`;
    } else if (location.country == "RU") {
        titleAgeRating = parseInt(details.rating.PCBP);
        ratingImage = `/images/pcbp/${details.rating.PCBP}.svg`;
    } else if (location.country == "SA") {
        titleAgeRating = parseInt(details.rating.GCAM);
        ratingImage = `/images/gcam/${details.rating.GCAM}.svg`;
    } else if (location.country == "AE") {
        titleAgeRating = parseInt(details.rating.MRO);
        ratingImage = `/images/mro/${details.rating.MRO}.svg`;
    } else if (location.country == "TW") {
        titleAgeRating = parseInt(details.rating.CSRR);
        ratingImage = `/images/csrr/${details.rating.CSRR}.svg`;
    } else if (returnAllPEGI().includes(location.country)) { // PEGI - Europe
        titleAgeRating = parseInt(details.rating.PEGI);
        ratingImage = `/images/pegi/${details.rating.PEGI}.svg`;
    } else if (location.country == "DE") {
        titleAgeRating = parseInt(details.rating.USK);
        ratingImage = `/images/pegi/${details.rating.USK}.svg`;
    }
    // IARC - This is the default fallback for countries that don't have a rating system 
    else {
        titleAgeRating = parseInt(details.rating.ESRB);
        ratingImage = `/images/IARC/${details.rating.ESRB}.svg`;
    }

    return { titleAgeRating, ratingImage };

}

module.exports = { determineAgeRating, getCountryLocation, getLocationDetails };