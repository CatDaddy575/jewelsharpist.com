/*
 * Estimate Emailer - runs on Google's servers under Julia's own Google
 * account (via Apps Script), same pattern as calendar-availability.gs.
 * Deployed as a Web App, it exposes one endpoint the estimate tool calls
 * to email a visitor their own estimate.
 *
 * Added 2026-07-26 at the site owner's request: the estimate total no
 * longer displays on the page at all - it's only ever delivered to the
 * visitor's own inbox, to raise the bar against casual scraping/repeated
 * querying of the pricing tool.
 *
 * Uses POST (not GET) specifically because the request body contains the
 * visitor's real email address - personal data does not belong in a URL
 * query string / server access log.
 */

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: "Invalid request body" });
  }

  var to = data.to;
  var subject = data.subject;
  var body = data.body;

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return jsonResponse({ error: "A valid recipient email is required" });
  }
  if (!subject || !body) {
    return jsonResponse({ error: "subject and body are required" });
  }

  try {
    GmailApp.sendEmail(to, subject, body, {
      name: "Jewels Harpist",
      replyTo: "jewelsharpist@gmail.com"
    });
  } catch (err) {
    return jsonResponse({ error: "Failed to send email: " + err.message });
  }

  return jsonResponse({ sent: true });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
