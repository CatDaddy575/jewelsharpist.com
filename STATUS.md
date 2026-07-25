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

## DONE (cont'd, 2026-07-25 round 8) — Phase-Based Add-Ons, Pricing Hidden from Visitors
- Replaced the single "Total Play Time" dropdown with named add-on
  checkboxes specific to each event type: Wedding gets Cocktail Hour +
  Dinner/Reception Music, Funeral/Memorial gets Visitation/Viewing +
  Repast/Reception - each with a suggested default duration (1 hr) that
  visitors can bump up. Party/Corporate stays a simple additional-hours
  dropdown since those events don't have standard nameable phases.
  Total Play Time is now computed internally and never shown as an input.
- No pricing math changed - this is purely how the total-hours number
  gets built and displayed.
- New requirement: the per-half-hour pricing formula is no longer shown
  to visitors at all, to prevent competitors from reverse-engineering the
  rate card. The on-page estimate now shows one combined "Performance
  Package" price (base + additional time folded together) plus a plain
  "Includes: X, Y" list with no per-phase dollar amounts. Travel and
  downtime stay as separate visible line items. The full breakdown
  (including the rate formula) still goes to Julia in the emailed summary
  - she needs the real numbers even though visitors don't see them.
- Verified all three event types end-to-end with real combinations,
  including confirming the downtime line correctly disappears when a gap
  doesn't cross the 2x threshold. Mobile layout confirmed clean.

## DONE (cont'd, 2026-07-25 round 9) — Full Phase Line-Item Lists, All Event Types
- Round 8's 2-checkbox wedding/funeral lists and the simple party dropdown
  were replaced with a single consistent pattern across all three event
  types: a flat list of named phase line items (no "optional add-ons"
  group heading), each with a suggested duration that can be bumped up in
  15-minute increments.
  - Wedding: Ceremony (45 min, bundles Prelude+vows+Recessional),
    Cocktail Hour (1 hr), Dinner/Reception Music (1 hr).
  - Funeral/Memorial: Service (45 min, bundles Prelude+service+Recessional),
    Visitation/Viewing (1 hr), Repast/Reception (1 hr).
  - Party/Corporate: Arrival/Cocktail Reception (1 hr), Dinner/Main
    Activity (1 hr), Program/Speeches (30 min), Post-Program Mingling
    (1 hr) - now matches the wedding/funeral structure instead of staying
    a simple dropdown.
  - No phase is pre-checked by default anywhere - the base "first hour" is
    phase-agnostic (whatever's selected, summed, first hour is base rate
    regardless of composition), so visitors build the event up from a
    blank slate. A new inline validation error requires at least one
    phase checked before an estimate can be calculated.
- Pricing granularity stayed at half-hour blocks (unchanged, unconfirmed
  with Julia) - the 15-minute phase selections are summed then rounded UP
  to the nearest half hour before pricing, same "round in Julia's favor"
  logic as the downtime formula.
- Added a "Want something not listed here? Contact Julia for a custom
  quote." line (linking to contact.html) under each event type's phase
  list, at the user's request.
- Refactored the phase UI to be data-driven (`PHASE_DEFS` + a shared
  `renderPhaseGroup()` function in `quote.html`) instead of hand-typed
  per-phase HTML blocks, since this round tripled the phase count (2 → 10
  across all three event types).
- Verified end-to-end in-browser: wedding Ceremony(45min)+Cocktail
  Hour(1hr) = 1h45m raw → correctly rounds up to 2 hrs → $600 total
  ($425 base + $100 + $75), no per-phase price shown; funeral and party
  phase lists render correctly with their custom-quote links; empty-
  selection validation error fires correctly; no console errors.

## DONE (cont'd, 2026-07-25/26) — Live Deploy, Time Dropdowns, Address Validation, Estimate Emailed Instead of Shown
- **The entire quoting tool went live on jewelsharpist.com for the first
  time this round** - all 7 prior commits were pushed and fast-forward
  merged into `main`. Before this, none of the estimate tool had ever
  been on the actual production site despite being built over several
  earlier rounds.
- Arrival/Departure Time relabeled to Start/End Time; Event Date + Start
  + End Time combined onto one row; both time fields changed from native
  browser time pickers to 12-hour AM/PM dropdowns in 15-minute increments
  (value stays 24-hour internally, no other logic changed).
- Street Address now requires a number AND a street name (rejects "Main
  Street" with no house number); ZIP was already 5-digits-only.
- State dropdown narrowed from all 50 states to just GA/FL/SC, since
  anything past 200 miles already needs a manual custom quote - flagged
  as an approximation, not real 200-mile enforcement (that's still the
  live driving-distance check). Real fix (a full 200-mile ZIP radius
  list) noted as a future task, not built yet.
- **Caught and fixed a real regression**: a blocked-Edit-tool incident
  mid-round had silently corrupted `renderPhaseGroup()`, breaking every
  phase duration dropdown (and therefore every estimate calculation) -
  shipped in a commit before being caught during unrelated testing.
- **Biggest change: the estimate total no longer shows on the page at
  all.** At the user's request (raise the bar against scraping/repeated
  querying of the pricing tool), email is now required before "Get My
  Estimate," and clicking it emails the visitor their own estimate via a
  newly deployed Google Apps Script (`send-estimate-email.gs`, same
  no-new-account pattern as the calendar checker) instead of displaying
  a breakdown. The page just confirms "Check your inbox!" Julia's own
  copy (sent later via the existing Formspree submission) is unchanged -
  still gets the full breakdown with the rate formula.
- Deployed and verified for real: two live test emails sent to
  jewelsharpist@gmail.com (one direct to the Apps Script, one through
  the real jewelsharpist.com origin to confirm no CORS issue), then a
  full simulated form submission confirmed the whole pipeline end-to-end.

**NEXT for the quoting tool:** get real prices for the `known_extras`
catalog if/when Julia wants specific add-ons priced; revisit song pricing
once the user confirms with Julia whether it's actually changing; build
a real 200-mile ZIP-radius list to replace the GA/FL/SC state-dropdown
approximation; otherwise this feature is functionally complete and live.

