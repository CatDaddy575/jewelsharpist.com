/*
 * Calendar Availability Checker - runs on Google's servers under Julia's
 * own Google account (via Apps Script), NOT a separate service or API key.
 * Deployed as a Web App, it exposes one read-only endpoint the estimate
 * tool calls to check whether a requested date/time conflicts with
 * anything already on her calendar.
 *
 * Why this instead of a "real" backend (Cloudflare Worker, etc.): this
 * runs directly under the Google account that's already logged in and
 * already owns the calendar - no new account, no API key, no hosting,
 * and the calendar never has to be made public. Apps Script's own web app
 * URL is the entire "backend."
 *
 * Rule (confirmed with the site owner 2026-07-24): ANY event on the
 * calendar blocks time, personal or professional. Buffer is 2 hours
 * AFTER an event ends, not before - a new booking can run right up until
 * an existing appointment starts with no cushion required going in, but
 * needs a 2-hour gap after anything that already happened. All-day
 * events block the entire day.
 */

function doGet(e) {
  var dateParam = e.parameter.date; // expected format: YYYY-MM-DD

  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return jsonResponse({ error: "date parameter is required, format YYYY-MM-DD" });
  }

  var cal = CalendarApp.getDefaultCalendar();
  var dayStart = new Date(dateParam + "T00:00:00");
  var dayEnd = new Date(dateParam + "T23:59:59");

  var events = cal.getEvents(dayStart, dayEnd);
  var busy = events.map(function (ev) {
    return {
      title: ev.getTitle(),
      start: ev.getStartTime().toISOString(),
      end: ev.getEndTime().toISOString(),
      allDay: ev.isAllDayEvent()
    };
  });

  return jsonResponse({ date: dateParam, busy: busy, bufferHoursAfter: 2 });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
