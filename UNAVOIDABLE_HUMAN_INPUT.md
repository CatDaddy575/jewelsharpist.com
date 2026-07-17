# Unavoidable Human Input Scenarios

This document catalogs situations where human intervention is technically unavoidable, even with full authorization and access. These are constraints to design AI agents around, not to keep trying to bypass.

---

## 1. OAuth/SSO Authorization Flows

**Why unavoidable:** Security design. OAuth flows intentionally require the user to approve permissions at the authorization server (Google, GitHub, etc.). The authorization server explicitly checks that a human is present and consents.

**Current issue:** EmailJS Gmail re-authorization requires clicking "Connect Account" → Google OAuth popup → user approval → token storage.

**What we tried:**
- Browser automation clicks on UI button ✗
- JavaScript .click() dispatch ✗
- DOM event dispatch (MouseEvent, PointerEvent) ✗
- Direct API endpoint discovery ✗

**Why it failed:** The button's click handler opens a popup window via `window.open()` or similar, which:
- Requires user gesture in modern browsers
- Cannot be triggered by synthetic events
- Is explicitly blocked by browser security models

**Agent design solution:**
- Detect OAuth requirements upfront (check for login/auth patterns)
- Ask user: "This requires you to approve permissions at [Service]. I can guide you through it, or I can handle [alternative approach]"
- Offer alternative: "Would you prefer I use [Formspree/SendGrid/etc] instead if already available?"

---

## 2. CAPTCHA and Bot Detection

**Why unavoidable:** Designed to prove humanity. CAPTCHAs cannot be solved by automation (solving them IS the attack).

**What gets blocked:**
- Google reCAPTCHA (all versions)
- hCaptcha
- AWS WAF challenges
- Cloudflare challenge pages
- Image/puzzle verification

**Why it failed:** No amount of JavaScript or browser automation can solve a puzzle designed to filter out bots.

**Agent design solution:**
- Detect CAPTCHA presence early
- Stop immediately and ask user to solve it
- Provide screenshot + instructions
- Resume after user confirms

---

## 3. Multi-Factor Authentication (MFA)

**Why unavoidable:** Ownership verification. MFA requires possession of a second device (phone, authenticator app, hardware key).

**What gets blocked:**
- SMS codes
- TOTP apps (Google Authenticator, Authy)
- Hardware keys (YubiKey)
- Email verification links (requires user to check their inbox)
- Security questions (only user knows answers)

**Why it failed:** Agent cannot receive SMS, cannot access user's phone/authenticator, cannot know security question answers.

**Agent design solution:**
- Detect MFA prompts
- Ask user to provide the code/confirmation
- Accept it and continue
- Cache session tokens if possible to avoid repeated MFA

---

## 4. Email Verification Requiring User Action

**Why unavoidable:** Proves email ownership. Service sends email, user must click link in email.

**What gets blocked:**
- "Click here to verify" email links
- Email-based password resets
- Double-opt-in flows
- Confirmation codes sent to email

**Why it failed:** Agent cannot access user's email inbox (different service, different credentials). Even with Gmail access, many services prevent this.

**Agent design solution:**
- Detect email verification requirement
- Tell user exactly what to check: "An email from [Service] was sent to [Email]. Open it and click [Verification Link]"
- Wait for user to confirm completion
- For password resets: suggest using "Forgot Password" flow manually if needed

---

## 5. Financial Transactions & Payment Authorization

**Why unavoidable:** Legal requirement + fraud prevention. Payments must be explicitly approved by account holder.

**What gets blocked:**
- Purchases (even with saved payment method)
- Subscription initiations
- Wire transfers
- Refund requests
- Billing changes

**Why it failed:** Intentional security feature. Credit card processors and payment gateways require explicit user consent, often with additional verification.

**Agent design solution:**
- For automation that needs payments: collect user approval in advance ("Do you authorize this charge?")
- For unexpected payment flows: stop and ask
- For subscription renewals: warn in advance, don't auto-authorize

---

## 6. Legal/Compliance Checkboxes

**Why unavoidable:** Contracts and liability. "I agree to Terms of Service" checkboxes must be explicitly clicked by the user who is subject to those terms.

**What gets blocked:**
- Terms of Service acceptance
- Privacy Policy acknowledgment
- Consent to data processing (GDPR, CCPA)
- Arbitration/dispute clauses
- Risk acknowledgments

**Why it failed:** Clicking these on behalf of the user is legally problematic and ethically wrong.

**Agent design solution:**
- Identify ToS/legal checkboxes
- Show user the text of what they're accepting
- Ask for explicit approval: "Do you accept [Terms]?"
- Only proceed after user says yes

---

## 7. Account Recovery & Identity Verification

**Why unavoidable:** Proves the person owns the account. Account recovery is specifically designed to block non-owners.

**What gets blocked:**
- Password resets (requires old password or email verification)
- Account unlock (requires identity proof)
- Recovery codes (only user has them)
- "Change linked email" flows (requires verification of old email)
- Account deletion confirmation (safety measure)

**Why it failed:** By definition, these flows are meant to prevent automated access to locked accounts.

**Agent design solution:**
- For account lockout: ask user to recover manually, offer step-by-step guidance
- For legitimate access issues: gather what verification the service requires, ask user to provide it

---

## 8. Interactive Consent Dialogs (Browser-Level)

**Why unavoidable:** Browser security model. User gesture required for certain sensitive operations.

**What gets blocked:**
- Cookie/tracking consent banners (require click)
- Camera/microphone permission prompts
- Clipboard access prompts
- Geolocation permission requests
- Push notification permission
- Payment Request API (requires user gesture)
- OAuth popup windows

**Why it failed:** Browsers explicitly prevent synthetic events from triggering security-sensitive actions.

**Agent design solution:**
- Detect and screenshot these dialogs
- Tell user exactly which button to click and why
- Provide keyboard shortcut if available ("Press Enter to accept")
- Resume after user confirms

---

## 9. Rate Limiting & Temporary Blocks

**Why unavoidable:** Service policy. After N failures or requests, the service intentionally blocks the account for a cooldown period.

**What gets blocked:**
- Login attempts (too many failures = temporary lock)
- API rate limits (429 Too Many Requests, wait required)
- DDoS protection triggers (must wait or solve challenge)
- Repeated automation detection (IP/account flagged)

**Why it failed:** The block IS working as designed. No bypass exists without waiting or manual verification.

**Agent design solution:**
- Detect 429/throttle responses
- Calculate backoff time, inform user
- Offer: "This will be available again in X minutes. Should I wait or should we try a different approach?"
- Never retry immediately (wastes time, triggers harder blocks)

---

## 10. Service-Specific Abuse Prevention

**Why unavoidable:** Per-service security. Some services intentionally require proof of human operation.

**Examples:**
- **Gmail**: Browser-only login in certain countries/conditions (requires human interaction)
- **CloudFlare**: Challenge pages for unrecognized IPs
- **LinkedIn**: Unusual activity verification (image text challenge or phone verification)
- **GitHub**: Suspicious login verification (email confirmation required)
- **Amazon AWS**: MFA for sensitive operations

**Why it failed:** The services are explicitly designed to detect and block automated access to these operations.

**Agent design solution:**
- Maintain a list of services with known human-verification requirements
- For those services, get pre-approval: "This service requires human verification. I can guide you through it step-by-step."
- Offer: "I can use API access instead if available" or "Should I proceed with manual guidance?"

---

## 11. Passwordless/Biometric Authentication

**Why unavoidable:** Device-bound. Requires presence of the user's device or biometric capability.

**What gets blocked:**
- Passkey/WebAuthn authentication (requires user's device)
- Face ID / Touch ID (requires user's device)
- Security key (hardware device required)

**Why it failed:** Cannot simulate a device the user owns.

**Agent design solution:**
- Detect passkey/biometric requirements
- Ask user to authenticate on their device
- Provide clear instructions: "Open [Service] on your phone and approve the login"
- Wait for completion signal from user

---

## 12. Forms Requiring User Judgment

**Why unavoidable:** Business logic. Some forms require user decision-making that cannot be automated.

**What gets blocked:**
- "Select your reason for contacting us" (agent doesn't know user's reason)
- "What is your project budget?" (only user knows)
- "Choose from these service tiers" (user preference, not technical decision)
- "Describe your issue in detail" (user must provide context)

**Why it failed:** The form is asking for information only the user has.

**Agent design solution:**
- Detect form fields that ask for user preference/context
- Ask user directly: "The service is asking: [Question]. What should I enter?"
- Accept user's response and fill the form
- Only automate fields that have clear, deterministic answers

---

## 13. Real-Time Challenges (Proof of Work, Puzzle Solving)

**Why unavoidable:** Computational puzzle designed to verify humanity. Solving the puzzle IS the verification.

**What gets blocked:**
- Cloudflare Proof of Work challenges
- Rate-limit puzzle challenges
- AWS Waf puzzles

**Why it failed:** Puzzles designed to be computationally expensive, often with time limits. Automation defeats the purpose.

**Agent design solution:**
- Detect puzzle challenges
- Screenshot and ask user to solve
- Provide manual instructions: "Solve the puzzle on the screen and press Submit"
- Resume after user completes

---

## Agent Design Principles

When building an agent to handle these scenarios:

### 1. **Early Detection**
- Scan the page BEFORE attempting actions
- Identify: auth requirements, verification needed, ToS to accept, MFA possible
- Report upfront: "This task requires: [X], [Y], [Z]. Can you provide these?"

### 2. **Graceful Degradation**
- Try automated path first
- On first sign of human requirement, STOP and ask
- Don't waste 10 attempts then ask; ask on attempt 1

### 3. **Clear User Instructions**
- Tell user EXACTLY what to do
- Provide screenshots
- Give keyboard shortcuts if available
- Explain WHY (so user understands it's not a failure)

### 4. **Pre-Authorization**
- When possible, get approval upfront
- "This service requires MFA. I can guide you step-by-step. Is that OK?" (before starting)
- Don't discover this halfway through

### 5. **Alternative Paths**
- "Service X requires OAuth re-auth (30 sec manual step). OR I can use Service Y which has API access. Which do you prefer?"
- Give user choice early, not after failed attempts

### 6. **Session Reuse**
- Cache sessions, tokens, cookies when possible
- Avoid repeated MFA/auth for the same session
- Document session lifetime expectations

### 7. **Maintain a Service Registry**
Keep a database of known services and their auth requirements:
- Gmail: OAuth required (popup/human approval), MFA common
- GitHub: OAuth available, MFA common
- EmailJS: OAuth required for service re-auth, API access available for most other tasks
- Formspree: No API in free tier, form-based only
- SendGrid: API key + SMTP, no OAuth for basic use

---

## Example: Future Handling of the EmailJS Scenario

**What we encountered:** EmailJS Gmail service requires OAuth re-authentication. Button click won't respond to automation.

**What an ideal agent would do:**

1. **Upfront detection** (before trying anything):
   ```
   User: "Re-authenticate the Gmail service in EmailJS"
   
   Agent: "That requires clicking 'Connect Account' → approving Gmail OAuth → 
   accepting permissions. This needs human interaction.
   
   Option A: I can guide you step-by-step (2-3 minutes)
   Option B: I can investigate if EmailJS has a REST API for this (1-2 minutes)
   Option C: I can temporarily switch to a different email provider
   
   Which do you prefer?"
   ```

2. **If user chooses Option A:** Provide guided screenshots + exact instructions

3. **If user chooses Option B:** Research EmailJS docs + contact support

4. **If user chooses Option C:** Migrate to alternative (handled without user interaction)

---

## Current Known Blockers

| Service | Operation | Blocker Type | Status |
|---------|-----------|--------------|--------|
| EmailJS | Gmail re-auth | OAuth popup + human approval | UNAVOIDABLE |
| Google | Gmail login (some regions) | Browser-only + human verification | UNAVOIDABLE |
| GitHub | SSH key setup | Device verification required | UNAVOIDABLE |
| Any service | MFA completion | Hardware device required | UNAVOIDABLE |
| Any service | CAPTCHA | Human-only puzzle | UNAVOIDABLE |
| Any service | Account recovery | Identity verification required | UNAVOIDABLE |

---

## Rules for the Agent

1. **Detect unavoidable scenarios early, before wasting time**
2. **Never retry an unavoidable scenario more than once**
3. **Always offer alternatives or guidance, never dead-end**
4. **When in doubt about a scenario, ASK the user rather than assuming it's solvable**
5. **Maintain context: "Last time we hit this, the solution was..."**
6. **Document new unavoidable scenarios as they're encountered**

