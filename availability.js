/*
 * Calendar availability checker - calls the Google Apps Script web app
 * deployed under Julia's own Google account (see
 * apps-script/calendar-availability.gs and apps-script/DEPLOY.md).
 *
 * Rule confirmed with the site owner 2026-07-24: ANY event on the
 * calendar blocks time (personal or professional), with a 2-hour buffer
 * AFTER an event ends but NOT before - a new booking can run right up to
 * the start of an existing appointment with no cushion required going in.
 *
 * CHANGED 2026-07-24: the form now collects an explicit departure time
 * (not just a duration derived from play hours), since the estimate tool
 * separately tracks "how long Julia plays" vs. "how long she's on-site"
 * (downtime formula). This checks the FULL on-site span - that's when
 * she's actually unavailable for another booking, not just the playing
 * portion.
 */

const AVAILABILITY_API_URL = "https://script.google.com/macros/s/AKfycbzmLtVmUMrTxl_wLcRVDr5O-W8gRIdYsaBeSivMXE9mhIgjqhuo4OpUjRvwtMaXuzwudg/exec";
const BUFFER_HOURS_AFTER = 2;

/**
 * Checks whether a requested date/start-time/end-time span conflicts with
 * anything on Julia's calendar. Returns { available: true } or
 * { available: false, conflict: { title, start, end } }.
 * Throws a plain Error (not InvalidZipError) on a system-level failure -
 * the caller treats that as any other system failure (shows the modal).
 */
async function checkAvailability(dateStr, startTimeStr, endTimeStr) {
    let response;
    try {
        response = await fetch(AVAILABILITY_API_URL + "?date=" + encodeURIComponent(dateStr));
    } catch (e) {
        throw new Error("Couldn't reach the calendar availability service.");
    }
    if (!response.ok) {
        throw new Error("Couldn't check calendar availability right now.");
    }

    const data = await response.json();
    if (data.error) {
        throw new Error("Couldn't check calendar availability right now.");
    }

    const requestStart = new Date(dateStr + "T" + startTimeStr);
    const requestEnd = new Date(dateStr + "T" + endTimeStr);

    for (const ev of data.busy) {
        if (ev.allDay) {
            return { available: false, conflict: { title: ev.title, allDay: true } };
        }

        const eventStart = new Date(ev.start);
        const eventEnd = new Date(ev.end);
        const blockedUntil = new Date(eventEnd.getTime() + BUFFER_HOURS_AFTER * 60 * 60 * 1000);

        const overlaps = requestStart < blockedUntil && requestEnd > eventStart;
        if (overlaps) {
            return { available: false, conflict: { title: ev.title, start: ev.start, end: ev.end } };
        }
    }

    return { available: true };
}
