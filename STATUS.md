# Jewels Harpist Website Redesign

## DONE
- Audited current Squarespace site
- Built custom HTML/CSS site from scratch
- Created home page with hero section, services overview, testimonials
- Created services page with detailed pricing and features
- Created contact form with all event details fields
- Integrated EmailJS for contact form submissions (replaces Formspree)
- Set up Gmail service to send inquiries to jewelsharpist@gmail.com
- Created email templates for contact submissions
- Implemented rate limiting: max 3 submissions per event type per day per email
- Added success message and submit button feedback (disabled after submission)

## NOW
- **INVESTIGATION COMPLETE: Awaiting decision on email solution**
  - Root cause confirmed: OAuth tokens expire with no refresh in EmailJS free tier
  - All solutions evaluated (see EMAILJS_FIX_PLAN.md and WORK_SUMMARY.md)
  - RECOMMENDATION: Switch to Formspree (no tokens, no auth, 100% reliable)
  - Alternative: Enable 2FA for app passwords (user action required)
  - Ready to implement chosen solution

## NEXT
- Once Option 1 (app password) is implemented and tested:
  - Verify auto-forwarding from jewelsharpist@gmail.com to mfollis82@gmail.com is working
  - Set up Google Analytics for traffic monitoring
  - Optional: Add automated response emails to form submitters
  - Optional: Add CAPTCHA or honeypot for spam prevention
  - Optional: Implement server-side rate limiting (if needed across browsers)

