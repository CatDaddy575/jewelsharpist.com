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
- **TESTING:** Contact form end-to-end verification in progress
  - EmailJS Gmail OAuth has been re-authorized with proper scopes
  - Service successfully shows: "Connected as jewelsharpist@gmail.com"
  - Test emails are being delivered to jewel sharpist@gmail.com inbox
  - Form submissions showing OK status in EmailJS Email History
  - Template (template_djludo6) confirmed working with "Contact Us" email type

## NEXT
- Verify auto-forwarding from jewelsharpist@gmail.com to mfollis82@gmail.com is working
- Set up Google Analytics for traffic monitoring
- Optional: Add automated response emails to form submitters
- Optional: Add CAPTCHA or honeypot for spam prevention
- Optional: Implement server-side rate limiting (if needed across browsers)

