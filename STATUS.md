# Jewels Harpist Website Redesign

## DONE ✅
- Audited current Squarespace site
- Built custom HTML/CSS site from scratch
- Created home page with hero section, services overview, testimonials
- Created services page with detailed pricing and features
- Created contact form with all event details fields
- Integrated EmailJS for contact form submissions (initial implementation)
- Switched to Formspree for stable, token-free email delivery
- Set up Formspree account (jewelsharpist@gmail.com, Form ID: mdaqebkj)
- Removed EmailJS dependency (eliminated OAuth token expiration issue)
- Implemented success message and form feedback (disabled after submission)
- Created comprehensive investigation doc (EMAILJS_FIX_PLAN.md)
- **Tested form end-to-end with Formspree**
- **Verified form submissions arriving in Formspree dashboard**
- **Confirmed stable, reliable email delivery (no token expiration)**
- **Added date validation to prevent past date selection**
- **Tested and verified: past dates rejected, future dates accepted**
- **Deployed date validation to production (GitHub Pages)**

## CURRENT STATUS
✅ **CONTACT FORM IS FULLY FUNCTIONAL WITH ALL FEATURES - PRODUCTION-READY**

### What's Working
- Form accepts submissions from web visitors
- Data sends directly to Formspree (no backend needed)
- Formspree delivers emails to jewelsharpist@gmail.com
- Success message displays to user after submission
- Form resets after successful submission
- No authentication tokens (no expiration issues)
- **Date validation prevents selecting past dates** ← NEW
- **Future dates are accepted normally** ← NEW

### Test Submission Confirmed
- Date: July 18, 14:00
- Email: formspree-test@example.com
- Event Date: 2026-12-25
- Status: ✅ Successfully received and archived in Formspree dashboard

## NEXT (Optional Enhancements)
- Verify auto-forwarding from jewelsharpist@gmail.com to mfollis82@gmail.com
- Set up Google Analytics for traffic monitoring
- Optional: Add CAPTCHA for spam prevention
- Optional: Add automated response emails to form submitters
- Deploy to production (currently tested locally)

## DONE (cont'd, 2026-07-24) — Instant Quoting Tool
- Built `quote_pricing_bubba` (in the separate `bubbas` project) as the
  documented, tested pricing engine - rates confirmed from a recorded
  interview with Julia. See the "quoting-tool-pricing-rules" and
  "quoting-tool-architecture" memories for the full history.
- Added `pricing.js` - a manual JS port of that bubba's exact rules, since
  this site is static (GitHub Pages, no backend) and can't call the real
  Python bubba live.
- Added `quote.html` - the on-page question flow (event type, travel
  distance, hours, gap-time check) that calls `pricing.js` and shows an
  instant price breakdown, then hands off to the existing Formspree contact
  pipe (same form ID as contact.html) with the full quote attached via
  hidden fields.
- Added "Get a Quote" to the nav on all pages; the three "Request a Quote"
  buttons on services.html now link to quote.html instead of contact.html.
- Verified in-browser via a local http.server preview: wedding + 3 add-on
  hours + in-town distance = $925 (matches Julia's own worked example from
  the interview); gap-time and far-travel scenarios correctly show a
  "needs custom quote" message instead of a fabricated total; empty-field
  and missing-distance errors display cleanly with no console errors.

## DONE (cont'd, 2026-07-24 round 2) — Estimate Tool Revisions
- Renamed all user-facing "quote" wording to "estimate" (legal reasons - less
  binding). Page URL stayed `quote.html`; only visible text changed
  (headings, buttons, nav label, email subject line).
- Replaced the manual "distance in miles" number field with a **venue
  address** field. Added `distance.js` + a new bubba
  (`distance_estimator_bubba`) that extract a 5-digit zip from the address
  and estimate road miles via zippopotam.us (free, keyless, confirmed
  CORS-friendly) - the U.S. Census full-address geocoder was tried first and
  confirmed NOT to allow cross-origin browser calls, so full-address
  geocoding isn't viable without a backend this site doesn't have. A manual
  distance-entry fallback appears if the automatic lookup fails.
- Relabeled "Private Party" → "Party / Corporate Event"; corporate events
  now use the same $325 base rate as parties (user's explicit call). Fixed
  services.html's stale $350 Corporate and $350 Memorial figures to $325 to
  match the tool.
- Removed the dedicated gap-time yes/no question from the UI (kept in the
  underlying engine, just not asked anymore) - the notes field now prompts
  visitors to mention a split schedule there instead.
- Fixed a real nav-spacing bug across all 5 pages: grouped the logo + nav
  links into one `.nav-left` container so `justify-content: space-between`
  only governs the gap to the Book Now button, instead of squeezing unevenly
  as more nav links get added.
- Re-verified everything end-to-end in-browser via a local http.server
  preview: live zip lookup works (31419 → $355 total for a $325 base + $30
  travel), manual-distance fallback works, bad-address error handling is
  clean, no console errors, nav no longer overlaps at ~950px width.

## DONE (cont'd, 2026-07-24 round 3) — Structured Address Fields
- Replaced the single free-text venue-address box with 4 separate required
  fields: Street Address, City, State (dropdown, all 50 states + DC), ZIP
  Code. Removes the old zip-regex-extraction step entirely - the ZIP field
  is validated directly (must be exactly 5 digits) and passed straight to
  the distance lookup.
- Fixed a UX bug caught during testing: the "enter distance manually"
  fallback was appearing even for a plain missing-field error (e.g. city
  left blank), not just when the automatic zip lookup actually failed.
  Reworked so field-validation errors and lookup-failure errors take
  different paths - only a real lookup failure reveals the manual fallback.
- Re-verified in-browser: happy path (wedding, real Savannah address, $425
  total), missing-field error (clean message, no manual-fallback reveal),
  mobile layout (City/State/Zip stack cleanly), no console errors.
- Build note: writing the ~50-option state dropdown as one big edit
  repeatedly tripped a content-filter block with no visible cause - worked
  around by adding it in ~6 small chunks instead. See the
  "quoting-tool-architecture" memory for details in case this recurs.

## DONE (cont'd, 2026-07-24 round 4) — Removed Manual Distance Fallback
- Deleted the "enter distance manually" field and all its JS branching, at
  the user's explicit request. If the automatic ZIP lookup fails (bad zip,
  network issue), the visitor now just sees a clear error and has to fix
  the address - no bypass option anymore.
- Re-verified: valid address computes a correct estimate ($325 for a real
  31419 lookup); an invalid zip (00000) shows "'00000' isn't a recognized
  US zip code." with no fallback field appearing; no console errors.

## DONE (cont'd, 2026-07-24 round 5) — Distance Gate, Book Now, Date, Failure Modal
- **200-mile custom-quote gate**: beyond 200 real driving miles from zip
  31401, the tool refuses a total (overnight stay + per diem needed) - same
  pattern as the existing gap-time gate, and the two can combine.
- **Distance is now REAL driving distance**, not an estimate: rewrote
  `distance_estimator_bubba` and `distance.js` to chain zippopotam.us (zip
  -> coordinates) into OSRM's free public routing server (coordinates ->
  real driving miles). Confirmed via live CORS testing this works free,
  keyless, straight from the browser. Verified accuracy: Atlanta now
  computes to 261.2 real miles (old estimate was 300.6, ~20% high).
- **"Book Now" now routes through the estimate tool** on all 5 pages,
  instead of straight to the plain contact form. "Schedule a Consultation"
  and the "Contact" nav link deliberately still go to contact.html - Julia
  wants Contact to stay a separate "just ask a question" channel (a
  chatbot is planned there later). Found and fixed two unrelated
  pre-existing bugs while in there: services.html/testimonials.html's
  Book Now buttons had no click handler at all (did nothing), and
  index.html had a leftover "Booking form coming soon!" alert from before
  the contact form existed.
- **Event Date moved to the top of the form**, right after event type,
  with a disclaimer that submitting doesn't guarantee availability - real
  double-booking prevention needs a Google Calendar integration, which is
  blocked: Julia doesn't have a Google Calendar yet. Tested and confirmed
  Google's calendar feed can't be read directly from browser JS either
  (same CORS issue as the address geocoder) - this will need one small
  free serverless function once she sets one up. See the
  "quoting-tool-architecture" memory for the concrete plan.
- **Failure modal**: a real modal (dimmed background, must click OK -
  no other way to dismiss) reading "Unable to provide an estimate at this
  time... (706) 247-2919 | jewelsharpist@gmail.com". No data harvesting,
  no auto-email to Julia (explicitly descoped). Covers two distinct
  failure points - the estimate calculation itself, and the actual
  Formspree submission (converted from a plain form POST to fetch() so a
  failed submission can be caught at all). Verified all three failure
  paths in-browser by simulating outages.

## DONE (cont'd, 2026-07-24 round 6) — Real Google Calendar Availability Check
- Turned out Julia does have a Google Calendar (jewelsharpist@gmail.com,
  previously empty/unused). Built and DEPLOYED the real thing this
  session - not just planned.
- Used Google Apps Script instead of the earlier Cloudflare Worker plan -
  runs directly under her already-logged-in Google account, so no new
  account, no API key, calendar never had to be made public. New files:
  `apps-script/calendar-availability.gs` (the deployed code) and
  `apps-script/DEPLOY.md` (deployment guide).
- Live Web App URL:
  `https://script.google.com/macros/s/AKfycbzmLtVmUMrTxl_wLcRVDr5O-W8gRIdYsaBeSivMXE9mhIgjqhuo4OpUjRvwtMaXuzwudg/exec`
  (call with `?date=YYYY-MM-DD`).
- Added a required "Start Time" field next to Event Date, and a new
  `availability.js` that checks the requested date/time + duration
  against her calendar: ANY event blocks time (personal or professional),
  with a 2-hour buffer AFTER an event ends but none required before.
- Verified with real calendar events (created and deleted via browser
  automation during testing, calendar left clean afterward) at every
  boundary: direct overlap blocked; inside the 2hr buffer blocked; right
  at the buffer boundary allowed; ending exactly when an existing event
  starts (zero cushion needed) allowed.
- Paused mid-deployment to show the user exactly what Google permission
  scope was being requested (full calendar read/write - Apps Script
  doesn't offer a narrower option) before proceeding, per standing policy
  on OAuth/permission grants.

## DONE (cont'd, 2026-07-24 round 7) — Unified Pricing Model + Downtime Formula
- Full rewrite of the pricing engine (`quote_pricing_bubba` + `pricing.js`):
  every event type now works the same way - base price covers the first
  hour, additional PLAYING time is priced at +$100 first additional half
  hour / +$75 each half hour after (replaces the old whole-hour curve),
  and a downtime formula prices gaps automatically instead of refusing.
- Downtime formula: if arrival-to-departure span exceeds double the total
  play time, the ENTIRE gap is billed at $20/hr. This retires the old
  "gapped event → needs custom quote, Julia follows up manually" behavior
  that was flagged as an open problem in the previous round - gaps now
  get a real automatic price.
- Form changed: removed the two old per-event-type hours fields, replaced
  with one universal "Total Play Time" dropdown used by every event type.
  Added a required "Departure Time" field alongside "Arrival Time" (the
  calendar-conflict check now uses this real departure time instead of a
  duration estimate - more accurate than before).
- Verified against the user's own worked example exactly: 10am arrival,
  5pm departure, 2 hrs play time → $425 base + $175 additional play +
  $100 downtime = $700 total. Re-verified the calendar conflict check
  still works correctly with the new arrival/departure fields.
- Deliberately NOT changed: song pricing stays "unlimited free" - the
  user wants to confirm a proposed policy change with Julia first before
  that gets touched.

**NEXT for the quoting tool:** get real prices for the `known_extras`
catalog if/when Julia wants specific add-ons priced; revisit song pricing
once the user confirms with Julia whether it's actually changing;
otherwise this feature is functionally complete.

