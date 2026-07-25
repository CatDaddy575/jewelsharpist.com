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
 * REVISED 2026-07-24 to a single unified model across all event types:
 * base price includes the first hour, additional play time is priced in
 * half-hour increments ($100 first additional half hour, $75 each half
 * hour after - exactly the old $200/$150 whole-hour curve halved), and a
 * downtime formula replaced the old "gap time -> needs custom quote"
 * refusal: if the total on-site span exceeds DOUBLE the total play time,
 * the ENTIRE gap (not just the excess) is billed at a flat $/hour rate.
 *
 * distanceMiles must be REAL driving distance (see distance.js) - beyond
 * travel.customQuoteBeyondMiles (200), this refuses a total (this is now
 * the ONLY refusal case), since a venue that far needs an overnight stay
 * and meal per diem with no fixed rate.
 */

const PRICING_RULES = {
    eventTypes: {
        wedding: {
            basePrice: 425,
            baseLabel: "Wedding performance — first hour (includes arrival ~30 min prior and any requested song with 2 weeks notice)"
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
    additionalHalfHourRates: {
        firstHalfHour: 100,
        eachHalfHourAfter: 75
    },
    downtime: {
        thresholdMultiplier: 2,
        ratePerHour: 20
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

function additionalPlayTimePrice(additionalHalfHours) {
    if (additionalHalfHours <= 0) return 0;
    const rates = PRICING_RULES.additionalHalfHourRates;
    return rates.firstHalfHour + rates.eachHalfHourAfter * (additionalHalfHours - 1);
}

function calculateDowntime(totalSpanHours, totalPlayHours) {
    const { thresholdMultiplier, ratePerHour } = PRICING_RULES.downtime;
    const thresholdHours = thresholdMultiplier * totalPlayHours;
    const applies = totalSpanHours > thresholdHours;
    const gapHours = round2(totalSpanHours - totalPlayHours);
    const fee = applies ? round2(gapHours * ratePerHour) : 0;
    return {
        applies: applies,
        spanHours: totalSpanHours,
        playHours: totalPlayHours,
        thresholdHours: thresholdHours,
        gapHours: gapHours,
        ratePerHour: ratePerHour,
        fee: fee
    };
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
 * fields, same refusal to invent a total beyond the 200-mile gate.
 *
 * params: { eventType, distanceMiles, totalPlayHours = 1, totalSpanHours = totalPlayHours, extras = [] }
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

    const totalPlayHours = params.totalPlayHours != null ? Number(params.totalPlayHours) : 1;
    if (isNaN(totalPlayHours) || totalPlayHours < 1) {
        throw new Error("Total play time cannot be less than 1 hour.");
    }
    if (Math.round(totalPlayHours * 2) !== totalPlayHours * 2) {
        throw new Error("Total play time must be in half-hour increments.");
    }

    const totalSpanHours = params.totalSpanHours != null ? Number(params.totalSpanHours) : totalPlayHours;
    if (isNaN(totalSpanHours) || totalSpanHours < totalPlayHours) {
        throw new Error("The total event span can't be shorter than the total play time.");
    }

    const extras = resolveExtras(params.extras || []);
    const extrasTotal = round2(extras.reduce(function (sum, e) { return sum + e.fee; }, 0));

    const eventRules = PRICING_RULES.eventTypes[eventType];
    const base = { label: eventRules.baseLabel, price: eventRules.basePrice };
    const travel = calculateTravel(distanceMiles);

    if (distanceMiles > PRICING_RULES.travel.customQuoteBeyondMiles) {
        return {
            eventType: eventType,
            needsCustomQuote: true,
            customQuoteReason: "This venue is more than " + PRICING_RULES.travel.customQuoteBeyondMiles + " miles away, which typically requires an overnight stay and meal per diem. Julia will follow up directly to price this instead of an automatic quote.",
            base: base,
            additionalPlayTime: null,
            downtime: null,
            travel: travel,
            extras: extras,
            extrasTotal: extrasTotal,
            total: null,
            notes: QUOTE_NOTES
        };
    }

    const additionalPlayHours = round2(totalPlayHours - 1);
    const additionalHalfHours = Math.round(additionalPlayHours * 2);
    const additionalPlayPrice = additionalPlayTimePrice(additionalHalfHours);
    const downtime = calculateDowntime(totalSpanHours, totalPlayHours);

    const total = round2(base.price + additionalPlayPrice + downtime.fee + travel.fee + extrasTotal);

    return {
        eventType: eventType,
        needsCustomQuote: false,
        customQuoteReason: null,
        base: base,
        additionalPlayTime: {
            hours: additionalPlayHours,
            price: additionalPlayPrice,
            rateDescription: "+$" + PRICING_RULES.additionalHalfHourRates.firstHalfHour + " first additional half hour, +$" +
                PRICING_RULES.additionalHalfHourRates.eachHalfHourAfter + " each half hour after that"
        },
        downtime: downtime,
        travel: travel,
        extras: extras,
        extrasTotal: extrasTotal,
        total: total,
        notes: QUOTE_NOTES
    };
}
