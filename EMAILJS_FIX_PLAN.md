# EmailJS Authentication Fix Plan

## Problem Identified
- OAuth tokens expire after a period of time
- No automatic refresh mechanism
- Form submissions fail with "Account not found" 404 errors
- Manual re-authorization required repeatedly
- **Not production-ready** in current state

## Evidence
- 5:00 PM email delivery: SUCCESS (OAuth was fresh)
- Subsequent submissions: FAILED (OAuth token expired)
- Pattern: Works immediately after OAuth reauth, fails after ~30 mins

## Solutions to Explore

### Option 1: App-Specific Password (App Passwords)
**Status:** BLOCKED ❌
**Reason:** Requires 2-Step Verification to be enabled on Google Account
**Why it won't work:**
- Account doesn't have 2FA enabled
- App passwords are not available without 2FA
- Would require user to enable 2FA first
- Still just a temporary workaround

---

### Option 2: Switch to Formspree (RECOMMENDED ✅)
**Status:** READY TO IMPLEMENT
**Why:**
- No authentication tokens needed
- No API keys in frontend code
- Formspree handles all email delivery
- Completely stable, no expiration issues
- Free tier available
- Simple form endpoint submission
- Email forwarding built-in

**Steps:**
1. Update contact.html to submit to Formspree endpoint instead of EmailJS
2. Remove EmailJS library and initialization
3. Add success message handling
4. Test form submissions
5. Verify emails arrive at configured Formspree email

---

### Option 3: Server-Side Email Handler
**Status:** COMPLEX ⚠️
**Why:**
- Requires Node.js backend setup
- More infrastructure overhead
- Overkill for simple contact form

**Complexity:** High (requires backend deployment)

---

### Option 4: Fix OAuth by Enabling 2FA + App Passwords
**Status:** USER-DEPENDENT
**Why:**
- Requires user action on Google Account
- Still not as reliable as Formspree
- Extra security burden on user

**Complexity:** Medium (user action required)

---

## Recommended Path Forward
**Switch to Formspree** - It's the simplest, most reliable solution
- Zero configuration hassles
- No token management
- No authentication needed
- Perfect for static site contact forms

## Timeline
- Option 1 implementation: ~30 minutes
- Testing: ~10 minutes
- Documentation: ~10 minutes

---

## Progress Log
- [DONE] Identified OAuth expiration as root cause
- [DONE] Investigated app-specific password approach
- [BLOCKED] App passwords require 2FA (not enabled on account)
- [DONE] Evaluated all solutions
- [READY] Recommended Formspree as best alternative

## Investigation Results
- Accessed Google Account security settings
- Confirmed 2-Step Verification is OFF
- App passwords not available without 2FA
- Formspree is the simplest, most reliable solution

## Current System Status
✅ **Working:** EmailJS successfully delivered at least one form email (5:00 PM)
❌ **Failing:** OAuth tokens expire after ~30 minutes with no refresh
⚠️ **Risk:** Current production setup is not reliable

## Recommendation When User Returns
Switch to **Formspree** instead of EmailJS:
- No authentication/token management needed
- Rock-solid reliability
- Free tier available
- Perfect fit for static site
- Takes ~15 minutes to implement
