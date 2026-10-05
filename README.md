# AURELUX — Full-Stack E‑Commerce Demo

[![Deploy to GitHub Pages](https://github.com/udara-ukv/AURELUX/actions/workflows/pages.yml/badge.svg)](https://github.com/udara-ukv/AURELUX/actions)

A modern, fully-functional e-commerce frontend built with vanilla HTML/CSS/JS, Firebase Auth/Firestore, and automated deployment. Built to showcase Full-stack and DevOps internship skills.

**Live Demo:** https://udara-ukv.github.io/AURELUX/  
**GitHub Repo:** https://github.com/udara-ukv/AURELUX

## Highlights

**Full-Stack:**
- Responsive, PWA-enabled frontend (HTML5, CSS3, Vanilla JS)
- Firebase integration: Auth (email + OAuth-ready), Firestore (users, orders, contacts, newsletter)
- Email automation: Welcome, contact form, order status emails via EmailJS
- User orders history page with Firestore-backed persistence
- Admin dashboard with order management and status updates
- Client-side error logging to Firestore

**DevOps:**
- GitHub Actions CI/CD: HTML validation, E2E smoke tests, Lighthouse audits
- PWA with service worker for offline availability
- Automated deployment to GitHub Pages
- Sentry integration for production error tracking (optional)
- Strict test gates (CI fails if tests fail)
- Performance monitoring and artifact storage

## Key Features

### 🛍️ Core E-Commerce
- Product catalog with filtering and search
- Shopping cart with promo codes
- Secure checkout with order persistence
- Product detail pages with reviews

### 👤 Authentication & User Management
- Email/password registration and login
- Persistent user sessions (Firebase Auth + localStorage)
- Personal order history visible to users
- Admin dashboard for operations

### 💳 Free Payment Sandbox
- Stripe test checkout using card `4242 4242 4242 4242` with any future expiry and any 3-digit CVC
- PayPal Sandbox checkout using a developer sandbox client ID
- Orders are still saved to Firestore so the full demo flow works end-to-end without real charges

### 📧 Email Automation
- Welcome email on registration
- Contact form submissions saved + emailed
- Order confirmations and status updates
- Powered by EmailJS (free tier, no backend required)

### 📱 PWA & Offline
- Service worker caches critical assets
- Offline fallback for static pages
- Manifest.json for install prompts
- Available on: Web, iOS (Add to Home Screen), Android

### 🔧 Admin Features
- View recent orders and customers
- Update order status (pending → processing → shipped → completed)
- Customer status change triggers email notification
- Export order data to CSV
- Page visibility toggle (hide/show pages to users)
- EmailJS template configuration UI

### 🚀 DevOps & Monitoring
- GitHub Actions runs linting, E2E tests, Lighthouse audits on every push
- Playwright smoke tests validate critical flows
- Lighthouse HTML reports stored as CI artifacts
- Client errors captured to Firestore for debugging
- Sentry SDK ready for production error tracking

## Quick Start

### 1. Local Development
```bash
# Clone and navigate
git clone https://github.com/udara-ukv/AURELUX.git
cd AURELUX

# Serve locally
python3 -m http.server 3000
# or
npx http-server -p 3000

# Open http://localhost:3000
```

### 2. Run Tests Locally
```bash
npm ci
npx playwright install --with-deps
npm run test:e2e
```

### 3. Live Demo
Visit: https://udara-ukv.github.io/AURELUX/

Test account:
- Email: `admin@aurelux.com`
- Password: `admin123` (admin dashboard only; create new user account to shop)

Payment demo options:
- Stripe test card: `4242 4242 4242 4242`
- PayPal Sandbox: paste your sandbox client ID in the cart and load the sandbox buttons

Note: these are free test modes only. No real payment is processed.

## Project Structure

```
my-webapp/
├── index.html, products.html, cart.html, orders.html, admin.html
├── script.js, orders.js, admin.js, admin-settings.js, cart.js
├── style.css (2600+ lines, responsive)
├── manifest.json, service-worker.js (PWA)
├── firebase-config.js, firebase-init.js (Firebase setup)
├── client-logger.js (error tracking)
├── sentry-init.js (optional monitoring)
├── .github/workflows/pages.yml (CI/CD)
├── tests/e2e.spec.js (Playwright)
└── README.md, package.json
```

## CV-Ready Bullets

**Full-Stack Internship:**
- Built a responsive e-commerce frontend (HTML/CSS/Vanilla JS) with PWA enhancements (service worker caching, manifest, offline support)
- Integrated Firebase Auth (email + OAuth) and Firestore for user management, order persistence, and real-time data sync
- Implemented transactional email automation (welcome, contact, order status) using EmailJS OAuth integration
- Designed admin dashboard with order management: admins can update statuses and trigger customer notifications
- Added free payment sandbox options (Stripe test card + PayPal Sandbox) to demonstrate checkout without live charges
- Deployed to GitHub Pages with automatic CI/CD pipeline; site serves 100% static assets (no server required)

**DevOps Internship:**
- Set up GitHub Actions CI pipeline: runs HTML validation, Playwright E2E smoke tests (blocking on failure), and Lighthouse performance audits
- Configured automated deployment to GitHub Pages; artifacts (Lighthouse reports) stored for review
- Implemented service worker + manifest for PWA offline capability; improved Lighthouse scores
- Added client-side error capture to Firestore; Sentry SDK ready for production monitoring
- Maintained code quality gates: E2E tests must pass before deployment; Lighthouse performance tracked across releases

**Combined Full-Stack + DevOps:**
- End-to-end e-commerce demo: user registration → checkout → order history → admin updates → email notification
- Production-ready DevOps practices: automated tests, performance monitoring, error tracking, staged deployments
- Zero-downtime updates via GitHub Pages CI/CD; all static assets, PWA-cached for speed

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Firebase (Auth, Firestore) |
| Email | EmailJS (free OAuth) |
| Testing | Playwright (E2E) |
| CI/CD | GitHub Actions |
| Monitoring | Sentry (optional), Client-side Firestore logs |
| Hosting | GitHub Pages (static) |
| PWA | Service Worker, Manifest.json |

## Setup & Configuration

### Firebase
1. Create a Firebase project (free tier)
2. Get your config from Firebase Console → Project Settings
3. Add config to `firebase-config.js`:
   ```javascript
   window.firebaseConfig = { apiKey: "...", projectId: "...", ... }
   ```
4. Enable Auth (Email/Password) and Firestore collections: `users`, `orders`, `contacts`, `newsletter`

### EmailJS (Email Automation)
1. Sign up at https://www.emailjs.com (free)
2. Connect your Gmail account or another email provider (OAuth required)
3. Create email templates (id: `template_2go1h35` for welcome, etc.)
4. Get your Service ID and Public Key
5. Update in `admin.html` email settings or `script.js` constants

### GitHub Pages
1. Push code to main branch
2. Settings → Pages → Deploy from `main` branch
3. Workflow auto-deploys after CI passes
4. Live at: `https://YOUR_USERNAME.github.io/AURELUX/`

### Sentry (Optional Error Tracking)
1. Sign up at https://sentry.io (free tier available)
2. Create a JavaScript project, get DSN
3. Replace `YOUR_SENTRY_DSN` in `sentry-init.js`
4. All client errors now tracked in Sentry dashboard

## CI/CD Pipeline

Every push to `main`:
1. **HTML Validation** — htmlhint checks for syntax
2. **E2E Tests** — Playwright smoke tests (fails if tests fail)
3. **Lighthouse Audit** — Performance & best practices score
4. **Deploy** — Auto-deploy to GitHub Pages if tests pass
5. **Artifacts** — Lighthouse report stored for review

View CI runs: https://github.com/udara-ukv/AURELUX/actions

## Admin Dashboard

**Access:** https://udara-ukv.github.io/AURELUX/admin.html
- Email: `admin@aurelux.com`
- Password: `admin123`

**Features:**
- Real-time stats: revenue, orders, customers, subscribers
- Recent orders table with status dropdown (update status → email sent to customer)
- Customer list with join dates
- Product performance stats
- Page visibility controls (hide pages from users)
- EmailJS template configuration and test sender
- Export orders to CSV

## Known Limitations & Production Notes

- Admin credentials hardcoded (use Firebase custom claims in production)
- EmailJS public key visible in frontend (acceptable for free tier; use backend proxy in production)
- No payment processing (use Stripe/PayPal for real transactions)
- Firestore security rules should be tightened for production
- Lighthouse audits run without login; some pages may be restricted

## Interview Talking Points

1. **Why Firebase?** "Rapid prototyping without a backend. Auth and Firestore handle users, orders, and persistence. Tradeoff: less control than a custom server."
2. **PWA Strategy:** "Service worker caches the app shell; users can browse offline. Manifest enables native app install on Android/iOS."
3. **CI/CD:** "Playwright smoke tests catch regressions early. Lighthouse tracks performance over time. GitHub Actions is free and integrates with Pages."
4. **Email Automation:** "EmailJS sends transactional emails without a backend. When admin updates order status, event triggers email to customer—no polling needed."
5. **Error Handling:** "Client errors logged to Firestore for debugging. Sentry SDK ready to replace when scaling."

## Future Enhancements

- Real payment gateway (Stripe test mode)
- Backend API (Node.js + Express)
- Database query optimization and caching
- Advanced monitoring (Datadog, New Relic)
- Load testing (k6, JMeter)
- Security headers and CSP
- Multi-language support (i18n)

## Links for CV / Portfolio

- **Live Demo:** https://udara-ukv.github.io/AURELUX/
- **GitHub Repo:** https://github.com/udara-ukv/AURELUX
- **Admin Dashboard:** https://udara-ukv.github.io/AURELUX/admin.html
- **CI/CD Workflow:** https://github.com/udara-ukv/AURELUX/actions
- **Lighthouse Reports:** Available in GitHub Actions artifacts

---

**Created:** June 2026 | **Status:** Full-featured demo | **License:** MIT

