/*
 * Client-side real driving-distance estimator - twin of
 * Projects\bubbas\distance_estimator_bubba\distance_estimator_bubba.py.
 *
 * Two free, keyless, CORS-friendly services chained together:
 * 1. zippopotam.us - zip code -> lat/long centroid.
 * 2. OSRM's public routing server (router.project-osrm.org) - two lat/long
 *    points -> real driving distance along actual roads.
 *
 * Confirmed via live testing that both allow direct cross-origin browser
 * requests (Google's Calendar/geocoding equivalents do not) - since this
 * site has no backend to hide an API key behind, it can only ever call
 * services like these. The bubba and this file deliberately use the same
 * two services so the tested numbers here match what's actually live.
 *
 * OSRM's public server is a free community service, not an SLA-backed
 * product - it can be slow or occasionally unavailable. An unrecognized
 * zip throws InvalidZipError (the visitor typed something fixable).
 * Every other failure throws LookupUnavailableError (a system-level
 * problem, not the visitor's fault) - the caller treats these two error
 * types differently: InvalidZipError gets an inline "check your zip"
 * message, everything else (including any truly unexpected exception)
 * gets the full "something's wrong, try again later" failure modal.
 */

const DISTANCE_RULES = {
    baseZip: "31401",
    baseLat: 32.0749,
    baseLon: -81.0883
};

const METERS_PER_MILE = 1609.344;

class LookupUnavailableError extends Error {}
class InvalidZipError extends Error {}

async function lookupZipLatLon(zip) {
    let response;
    try {
        response = await fetch("https://api.zippopotam.us/us/" + zip);
    } catch (e) {
        throw new LookupUnavailableError("Couldn't reach the zip code lookup service.");
    }

    if (response.status === 404) {
        throw new InvalidZipError("'" + zip + "' isn't a recognized US zip code.");
    }
    if (!response.ok) {
        throw new LookupUnavailableError("Couldn't look up that zip code right now.");
    }

    const data = await response.json();
    const place = data.places && data.places[0];
    if (!place) {
        throw new InvalidZipError("'" + zip + "' isn't a recognized US zip code.");
    }

    return { lat: parseFloat(place.latitude), lon: parseFloat(place.longitude) };
}

async function lookupDrivingMiles(lat1, lon1, lat2, lon2) {
    const url = "https://router.project-osrm.org/route/v1/driving/" +
        lon1 + "," + lat1 + ";" + lon2 + "," + lat2 + "?overview=false";

    let response;
    try {
        response = await fetch(url);
    } catch (e) {
        throw new LookupUnavailableError("Couldn't reach the driving-distance service.");
    }
    if (!response.ok) {
        throw new LookupUnavailableError("Couldn't calculate driving distance right now.");
    }

    const data = await response.json();
    if (data.code !== "Ok" || !data.routes || !data.routes[0]) {
        throw new LookupUnavailableError("Couldn't calculate driving distance for that location.");
    }

    return data.routes[0].distance / METERS_PER_MILE;
}

/**
 * Looks up a US zip code and returns real one-way DRIVING miles from
 * Julia's base zip (31401). Throws a plain Error for a visitor-fixable
 * problem (unrecognized zip), or LookupUnavailableError for a system-level
 * failure (network down, service unreachable) - never guesses a distance
 * it doesn't have.
 */
async function estimateDistanceFromZip(zip) {
    const dest = await lookupZipLatLon(zip);
    const drivingMiles = await lookupDrivingMiles(
        DISTANCE_RULES.baseLat, DISTANCE_RULES.baseLon, dest.lat, dest.lon
    );

    return {
        destinationZip: zip,
        drivingMiles: Math.round(drivingMiles * 10) / 10
    };
}
