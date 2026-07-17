# Jewels Harpist Website — Project Reference

## QUICK FACTS
- **Site:** jewelsharpist.com
- **Hosting:** GitHub Pages (FREE)
- **Domain:** GoDaddy (registered and pointing to GitHub)
- **Repository:** https://github.com/CatDaddy575/jewelsharpist.com
- **Branch:** main (GitHub Pages serves from main, NOT master)
- **Deployment:** Auto-deploys on push to main (~30-60 seconds)
- **Deploy Method:** No FTP/SFTP needed — just `git commit` + `git push`

---

## DEPLOYMENT WORKFLOW
1. Edit files locally at `D:\Claude\jw-marketing\website\`
2. Run `git commit -m "message"` 
3. Run `git push` (pushes to origin/main)
4. Wait 30-60 seconds for GitHub Pages to rebuild
5. Changes live at jewelsharpist.com

### CRITICAL: Main vs Master Branch
- Local default branch was `master` 
- **GitHub Pages is configured to serve from `main`**
- Always push to `main`, not `master`
- If changes don't appear: check which branch they're on

---

## CURRENT IMPLEMENTATION

### Contact Form Features
- **EmailJS Integration** (automatic email delivery)
  - Service ID: `service_eq6hqtn`
  - Template ID: `template_djludo6`
  - Public Key (init): `bN-_qy9sX1mVCvdqz`
  - Sends inquiries to: `jewelsharpist@gmail.com`
  
- **Rate Limiting** (localStorage-based, client-side)
  - Max 3 submissions per event type per email per day
  - Resets daily based on localStorage timestamp
  - Prevents form spam from same email/event combo
  
- **Form Feedback**
  - Success message appears after submission
  - Submit button disabled + text changes to "Inquiry Submitted"
  - Button re-enables after 5 seconds
  - Form auto-clears on success

### Pages Built
- `index.html` — Home page with hero, services, testimonials
- `contact.html` — Contact form with client-side rate limiting
- `services.html` — Services/pricing page
- `testimonials.html` — Client testimonials
- `robots.txt` — Search engine crawling rules
- `sitemap.xml` — Site structure for SEO

---

## CREDENTIALS & KEYS (IN VAULT)

**DO NOT put these in code. Always read from vault or .env**

- **GitHub Personal Access Token:** stored in `C:\Users\info\passwords\`
- **EmailJS Public Key:** `bN-_qy9sX1mVCvdqz` (PUBLIC, safe in HTML)
- **EmailJS Service/Template IDs:** PUBLIC, safe in HTML
- **GoDaddy Account:** credentials in `C:\Users\info\passwords\`
- **GoDaddy API Token:** in `C:\Users\info\passwords\`

---

## TROUBLESHOOTING

### Changes pushed but not appearing on live site
**FIRST CHECK:**
1. Did you push to `main` branch? → `git branch` should show `main` or `* main`
2. Did GitHub Pages finish building? → Check repo > Settings > Pages > Build status
3. Is it just cached? → GitHub CDN cache takes 5-15 minutes sometimes
4. Check raw file: `https://raw.githubusercontent.com/CatDaddy575/jewelsharpist.com/main/contact.html` should show new code

**IF NOT THERE:**
- Is the file in the GitHub repo? → Check via GitHub web UI
- Did git push succeed? → `git log --oneline -3` should show your commit
- Run `git push -f origin main` if needed (force update)

### EmailJS not sending emails
**CHECK:**
1. Email credentials correct in GitHub Actions or code? (Should be in HTML as public key only)
2. Gmail account has 2FA enabled? → Requires app password, not regular password
3. EmailJS service running? → Check emailjs.com dashboard
4. Rate limit triggered? → Check browser localStorage

### Form validation not working
- Check browser console for JavaScript errors
- Verify all form field IDs match: name, email, phone, eventType, eventDate, message
- Check that success message element has correct ID: `successMessage`

---

## FUTURE QUESTIONS TO ANTICIPATE

### Analytics & Monitoring
- *Q: How many inquiries are we getting?*
  - A: Check Gmail inbox, or add Google Analytics to site
  - Implement: Google Analytics 4 tracking code in `<head>`

### Email Automation
- *Q: Can we send auto-reply to people who submit?*
  - A: Yes, add EmailJS template for auto-reply OR use Gmail rules
  - Implement: Create second EmailJS template for customer confirmation

### Form Improvements
- *Q: How do we filter spam submissions?*
  - A: Current rate limiting is per-email. Could add:
    - Honeypot field (hidden, bots fill it)
    - CAPTCHA (reCAPTCHA v3)
    - Server-side validation via serverless function

### SEO & Discovery
- *Q: How do we know if people are finding us?*
  - A: Need Google Analytics + Search Console setup
  - Implement: Add GA4 tracking code, submit sitemap to Google

### Styling & Design
- *Q: Can we change colors/fonts?*
  - A: CSS variables at top of each HTML file: `--primary`, `--accent`, `--accent-light`
  - All colors defined in `:root` section, easy to swap

### Mobile & Responsive
- *Q: Does it look good on mobile?*
  - A: Has media queries for tablets/mobile, but test on actual devices
  - Common issues: hero text size, form width, image sizes

### Hosting Costs
- *Q: Will GitHub Pages go paid?*
  - A: GitHub Pages is free for public repos, no risk of cost increase
  - Domain renewal: GoDaddy (~$10/year)

---

## ARCHITECTURE NOTES

### Why GitHub Pages + GoDaddy?
- GitHub Pages: FREE static hosting, auto-deploys from git
- GoDaddy: Domain management, DNS points to GitHub's servers
- No backend server needed (contact form sends via EmailJS, not our server)

### Client-Side vs Server-Side
- Contact form is **100% client-side** — no server backend
- EmailJS handles email delivery (their service, not ours)
- Rate limiting is localStorage (per browser, not global)
  - *Future consideration:* If rate limiting needs to be global (across browsers/devices), would need backend database

### Why EmailJS?
- No backend server needed
- Free tier sufficient for small volume
- Integrates directly from HTML/JS
- Alternative: serverless functions (AWS Lambda, Vercel, etc.)

---

## FILES & LOCATIONS

```
D:\Claude\jw-marketing\website\
├── index.html                 # Home page
├── contact.html               # Contact form + EmailJS
├── services.html              # Services listing
├── testimonials.html          # Testimonials
├── robots.txt                 # Search bot rules
├── sitemap.xml                # Site structure for SEO
├── .git/                       # Git repo (tracks changes)
├── .gitignore                  # Files git ignores (.env, passwords, etc.)
├── STATUS.md                   # Project status (DONE/NOW/NEXT)
├── PROJECT_REFERENCE.md        # THIS FILE
├── content/
│   └── photos/                # Images used on site
├── Pictures/                   # Uncompressed source images
└── .claude/
    └── launch.json            # Dev server config (Python HTTP server)
```

---

## GITHUB SETUP

**Repository Owner:** CatDaddy575
**Repository Name:** jewelsharpist.com
**GitHub Pages Setting:** Serves from `main` branch, root folder `/`

To add the repo to a new local setup:
```bash
git clone https://github.com/CatDaddy575/jewelsharpist.com.git
cd jewelsharpist.com
```

---

## COMMON COMMANDS

```bash
# See status
git status

# See recent commits
git log --oneline -5

# Add and commit changes
git add -A
git commit -m "message"

# Push to GitHub
git push

# Check which branch you're on
git branch

# Switch to main branch
git checkout main
```

---

## IMPORTANT REMINDERS

1. **Always push to `main` branch**, not `master`
2. **EmailJS keys are PUBLIC** — safe in HTML, don't worry about that
3. **GitHub Pages auto-deploys** — no manual upload needed
4. **Rate limiting is per-browser** — refreshing browser resets count
5. **DNS changes can take hours** — if domain stops working, wait 24 hours
6. **Check this file before asking the user** — update it when you learn new things

---

## LAST UPDATED
2026-07-17 — EmailJS integration complete, rate limiting working, GitHub Pages deployment confirmed
