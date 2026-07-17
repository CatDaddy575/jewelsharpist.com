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

### Option 1: App-Specific Password (RECOMMENDED - Most Stable)
**Status:** TODO
**Why:** 
- No token expiration
- Permanent credentials
- More reliable than OAuth
- Simple to implement

**Steps:**
1. Create app-specific password in Google Account
2. Store in .env file
3. Configure EmailJS with app password instead of OAuth
4. Remove OAuth connection from dashboard
5. Test form submissions

---

### Option 2: Server-Side Email Handler
**Status:** TODO
**Why:**
- More secure (no API keys exposed in frontend)
- Better control over email delivery
- More scalable

**Complexity:** Medium (requires backend)

---

### Option 3: OAuth Refresh Token Management
**Status:** REJECTED
**Why:**
- EmailJS Free tier doesn't support refresh tokens
- Would require paid tier or custom implementation
- Not cost-effective

---

## Implementation Order
1. Pursue Option 1 (App Password) - Quickest, most reliable
2. If that fails, explore Option 2 (Server-side)

## Timeline
- Option 1 implementation: ~30 minutes
- Testing: ~10 minutes
- Documentation: ~10 minutes

---

## Progress Log
- [START] Identified OAuth expiration as root cause
- [TODO] Implement app-specific password solution
- [TODO] Update EmailJS configuration
- [TODO] Test form submission
- [TODO] Commit changes
