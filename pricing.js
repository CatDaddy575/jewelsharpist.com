/*
 * Jewels Harpist quote pricing - client-side twin of the real pricing engine
 * at Projects\bubbas\quote_pricing_bubba\quote_pricing_bubba.py.
 *
 * This site is static (GitHub Pages, no backend), so the bubba itself can't
 * run for a live visitor - the rules below are a manual port of the same
 * logic and the same numbers. The bubba (and its pricing_rules.json) is the
 * source of truth; if a rate ever changes, update the bubba first, then
 * mirror the change here.
 *
 * distanceMiles must be REAL driving distance (see distance.js) - beyond
 * travel.customQuoteBeyondMiles (200), this refuses a total the same way
 * gap-time does, since a venue that far needs an overnight stay and meal
 * per diem with no fixed rate.
 */

const PRICING_RULES = {
    eventTypes: {
        wedding: {
            basePrice: 425,
            baseLabel: "Wedding ceremony (flat) — includes arrival ~30 min prior and any requested song with 2 weeks notice"
        },
        party: {
            basePrice: 325,
            baseLabel: "Party or corporate event performance — first hour"
        },
        funeral: {
            basePrice: 325,
            baseLabel: "Funeral/memorial performance — standard rate, first hour"
        }
    },
    additionalHourRates: {
        firstHour: 200,
        eachHourAfter: 150
    },
    travel: {
        freeRadiusMiles: 25,
        ratePerMile: 1.0,
        customQuoteBeyondMiles: 200
    },
    // Starts empty on purpose - no real extra-fee prices exist yet. Add
    // entries here (and to the bubba's pricing_rules.json) once Julia sets
    // real prices for specific add-ons.
    knownExtras: {}
};

const QUOTE_NOTES = [
    "Song requests are included at no extra charge (2 weeks notice required).",
    "Additional musicians (violin, guitar, cello) are available via referral and priced separately — not included in this estimate."
];

function round2(n) {
    return Math.round(n * 100) / 100;
}

function additionalHoursPrice(count) {
    if (count <= 0) return 0;
    const rates = PRICING_RULES.additionalHourRates;
    return rates.firstHour + rates.eachHourAfter * (count - 1);
}

function calculateTravel(distanceMiles) {
    const { freeRadiusMiles, ratePerMile } = PRICING_RULES.travel;
    const excessOneWay = Math.max(0, distanceMiles - freeRadiusMiles);
    const billableMiles = excessOneWay * 2;
    return {
        distanceMiles,
        freeRadiusMiles,
        billableMiles,
        ratePerMile,
        fee: round2(billableMiles * ratePerMile)
    };
}

function resolveExtras(extras) {
    return extras.map(function (item) {
        if (item.key) {
            const entry = PRICING_RULES.knownExtras[item.key];
            if (!entry) {
                throw new Error("Unknown extra: " + item.key);
            }
            return { label: entry.label, fee: entry.fee };
        }
        if (item.label && item.fee != null) {
            return { label: item.label, fee: item.fee };
        }
        throw new Error("Each extra needs either a catalog key or a label + fee");
    });
}

/**
 * Mirrors quote_pricing_bubba.py's handler() exactly - same required
 * fields, same refusal to invent a total for gap-time events.
 *
 * params: { eventType, distanceMiles, addOnHours = 0, hasGap = false, extras = [] }
 */
function calculateQuote(params) {
    const eventType = params.eventType;
    if (!PRICING_RULES.eventTypes[eventType]) {
        throw new Error("eventType must be one of: " + Object.keys(PRICING_RULES.eventTypes).join(", "));
    }

    const distanceMiles = Number(params.distanceMiles);
    if (params.distanceMiles == null || isNaN(distanceMiles) || distanceMiles < 0) {
        throw new Error("Please enter a valid, non-negative travel distance.");
    }

    const addOnHours = Number.isInteger(params.addOnHours) ? params.addOnHours : parseInt(params.addOnHours || 0, 10);
    if (isNaN(addOnHours) || addOnHours < 0) {
        throw new Error("Hours must be a whole, non-negative number.");
    }

    const hasGap = !!params.hasGap;
    const extras = resolveExtras(params.extras || []);
    const extrasTotal = round2(extras.reduce(function (sum, e) { return sum + e.fee; }, 0));

    const eventRules = PRICING_RULES.eventTypes[eventType];
    const base = { label: eventRules.baseLabel, price: eventRules.basePrice };
    const travel = calculateTravel(distanceMiles);

    const customQuoteReasons = [];
    if (hasGap) {
        customQuoteReasons.push("This event has non-contiguous performance times (a gap between blocks). There's no fixed rate for idle/waiting time.");
    }
    if (distanceMiles > PRICING_RULES.travel.customQuoteBeyondMiles) {
        customQuoteReasons.push("This venue is more than " + PRICING_RULES.travel.customQuoteBeyondMiles + " miles away, which typically requires an overnight stay and meal per diem.");
    }

    if (customQuoteReasons.length > 0) {
        return {
            eventType: eventType,
            needsCustomQuote: true,
            customQuoteReason: customQuoteReasons.join(" ") + " Julia will follow up directly to price this instead of an automatic quote.",
            base: base,
            additionalHours: null,
            travel: travel,
            extras: extras,
            extrasTotal: extrasTotal,
            total: null,
            notes: QUOTE_NOTES
        };
    }

    const addHoursPrice = additionalHoursPrice(addOnHours);
    const total = round2(base.price + addHoursPrice + travel.fee + extrasTotal);

    return {
        eventType: eventType,
        needsCustomQuote: false,
        customQuoteReason: null,
        base: base,
        additionalHours: {
            count: addOnHours,
            price: addHoursPrice,
            rateDescription: "+$" + PRICING_RULES.additionalHourRates.firstHour + " first additional hour, +$" +
                PRICING_RULES.additionalHourRates.eachHourAfter + " each hour after that"
        },
        travel: travel,
        extras: extras,
        extrasTotal: extrasTotal,
        total: total,
        notes: QUOTE_NOTES
    };
}
