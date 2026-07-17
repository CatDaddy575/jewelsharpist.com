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
- **CRITICAL: Fix Gmail OAuth token expiration issue**
  - Root cause: OAuth tokens expire after ~30 minutes with no refresh mechanism
  - EmailJS free tier doesn't support automatic token refresh
  - Proof of working system: 5:00 PM email delivery successful
  - Proof of failure: Subsequent form submissions fail 30+ mins later with 404 errors
  - Solution in progress: Switching to app-specific password instead of OAuth (Option 1)
  - See EMAILJS_FIX_PLAN.md for detailed investigation

## NEXT
- Once Option 1 (app password) is implemented and tested:
  - Verify auto-forwarding from jewelsharpist@gmail.com to mfollis82@gmail.com is working
  - Set up Google Analytics for traffic monitoring
  - Optional: Add automated response emails to form submitters
  - Optional: Add CAPTCHA or honeypot for spam prevention
  - Optional: Implement server-side rate limiting (if needed across browsers)

