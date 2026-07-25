# Deploying the calendar availability checker

This connects the estimate tool to Julia's real Google Calendar so it can
warn visitors when a date/time conflicts with something already booked.
No new accounts, no API keys - just Google's own free scripting tool
(Apps Script), running under whatever Google account is logged in.

## Steps (do this while logged into Julia's Gmail)

1. Go to **script.google.com**
2. Click **New project**
3. Delete whatever's in the code editor, and paste in the full contents
   of `calendar-availability.gs` (the file next to this one)
4. Click the project name at the top ("Untitled project") and rename it
   to something like "Jewels Harpist Availability Checker"
5. Click **Deploy** → **New deployment**
6. Click the gear icon next to "Select type" and choose **Web app**
7. Fill in:
   - Description: anything, e.g. "Calendar availability API"
   - Execute as: **Me** (this is what lets it read the calendar)
   - Who has access: **Anyone**
8. Click **Deploy**
9. It will ask you to **authorize access** - click through the Google
   prompts (choose the account, click "Advanced" → "Go to [project name]
   (unsafe)" if Google shows that warning - this is normal for a script
   you just wrote yourself, not a red flag)
10. You'll get a **Web app URL** that looks like
    `https://script.google.com/macros/s/AKfycb.../exec` - copy that whole
    URL and send it back here

## Quick test before sending it over

Paste the URL into a browser tab with `?date=` and a real date added to
the end, e.g.:

```
https://script.google.com/macros/s/AKfycb.../exec?date=2026-08-15
```

You should see something like:

```json
{"date":"2026-08-15","busy":[],"bufferHoursAfter":2}
```

If that date has something on the calendar, `busy` will list it with a
start/end time instead of being empty. Once you've confirmed that works
and sent me the URL, I'll wire it into the estimate tool and test it
end-to-end from the actual site.

## If you ever need to change the logic later

Edit the code at script.google.com (same project), then **Deploy** →
**Manage deployments** → pencil icon → **New version** → **Deploy**. The
URL stays the same, so nothing on the website needs to change.

---

# Deploying the estimate emailer

Second, separate Apps Script project (`send-estimate-email.gs`). This is
what actually emails a visitor their estimate - added 2026-07-26 when the
on-page total was removed so the pricing formula can't be read just by
opening the page repeatedly.

Same deployment steps as above (new project at script.google.com, paste
`send-estimate-email.gs`, **Deploy → New deployment → Web app**, Execute
as **Me**, Who has access **Anyone**), with one difference: this script
asks for a NEW permission the calendar checker didn't need - **send email
as you (Gmail)**. It only sends the one email it's told to send (the
visitor's own estimate) - it can't read your inbox or send anything else.

Currently deployed at:
`https://script.google.com/macros/s/AKfycbxVNEV5sCMatb9cWSjJxEcW10qJgj-GoSjRkktE4R0MGYFOzjT6ErKytzo-AmMmIICS/exec`

## Quick test before trusting it

This one only accepts POST (not a URL you can just paste into a browser
tab), since the visitor's email address shouldn't sit in a URL/log. Test
with a POST request, e.g. from a browser console:

```js
fetch("https://script.google.com/macros/s/.../exec", {
  method: "POST",
  body: JSON.stringify({ to: "jewelsharpist@gmail.com", subject: "Test", body: "Just a test." })
}).then(r => r.text()).then(console.log)
```

You should see `{"sent":true}` and a real email arrive.
