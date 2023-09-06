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


function determineLogoBasedOnCountryAndAge(location, age){
    //if lookup = eu then
    //PEGI

    // else if USA, Canada, American Samoa, Argentina, Bahamas, Belize, Bermuda, Bolivia, British Virgin Islands, Colombia, Costa Rica, Ecuador, El Salvador, French Guiana, Guam, Guatemala, Guyana, Honduras, Mexico, Nicaragua, Northern Mariana Islands, Panama, Paraguay, Peru, Puerto Rico, Samoa, Suriname, US Virgin Islands, Uruguay, and Venezuela 

    //https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes

}

module.exports = { determineLogoBasedOnCountryAndAge, getCountryLocation, getLocationDetails };