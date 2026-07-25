/*
 * Sends the visitor's own estimate to their own inbox via a Google Apps
 * Script deployed under Julia's account (see
 * apps-script/send-estimate-email.gs and apps-script/DEPLOY.md).
 *
 * Added 2026-07-26 at the site owner's request: the estimate total no
 * longer displays on the page - it only ever reaches the visitor via
 * their own inbox now, to raise the bar against scraping the pricing
 * formula by repeatedly querying the tool.
 *
 * Deliberately POSTs a plain string body with no explicit Content-Type
 * header - setting "application/json" would trigger a CORS preflight
 * (OPTIONS) request, which Apps Script Web Apps don't handle. Apps
 * Script reads e.postData.contents regardless of the declared type, so
 * this works without a preflight.
 */

const SEND_ESTIMATE_EMAIL_API_URL = "https://script.google.com/macros/s/AKfycbxVNEV5sCMatb9cWSjJxEcW10qJgj-GoSjRkktE4R0MGYFOzjT6ErKytzo-AmMmIICS/exec";

async function sendEstimateEmail(toEmail, subject, body) {
    let response;
    try {
        response = await fetch(SEND_ESTIMATE_EMAIL_API_URL, {
            method: "POST",
            body: JSON.stringify({ to: toEmail, subject: subject, body: body })
        });
    } catch (e) {
        throw new Error("Couldn't reach the email service.");
    }
    if (!response.ok) {
        throw new Error("Couldn't send the estimate email right now.");
    }
    const data = await response.json();
    if (data.error) {
        throw new Error("Couldn't send the estimate email right now.");
    }
    return true;
}
