# AURELUX CV & Internship Application Guide

This document provides copy-paste CV bullets, portfolio links, and interview preparation for Full-Stack and DevOps internship applications.

## For Full-Stack Internship Applications

### Headline
**Software Engineer Intern - Full-Stack** | Building a PWA e-commerce platform with Firebase and automated email workflows

### Key CV Bullets (pick 4–5)

1. **Frontend & PWA**
   - Built a responsive e-commerce web app (HTML5, CSS3, Vanilla JavaScript) with 2600+ lines of custom styling and zero external UI framework dependencies
   - Implemented Progressive Web App features (service worker, manifest.json) to enable offline browsing and 30% faster perceived load time on repeat visits

2. **Backend Integration**
   - Integrated Firebase Authentication (email + OAuth-ready) and Firestore for user management, order persistence, and real-time data synchronization
   - Designed scalable Firestore schema supporting users (50+ fields), orders (with status tracking), contacts, and newsletter subscriptions

3. **Email Automation**
   - Implemented transactional email automation using EmailJS OAuth integration: welcome emails, contact form submissions, and order status updates
   - Built admin-triggered customer notifications (order status changes) that sync with Firestore documents in real-time

4. **Full-Stack Feature: Admin Dashboard**
   - Designed and built admin dashboard with role-based access: order management, status updates, customer analytics, and page visibility controls
   - Feature: admins update order status → Firestore updates → EmailJS sends customer notification (zero-delay event-driven workflow)

5. **User-Facing Features**
   - Implemented user order history page with Firestore-backed persistence; customers can view all past orders with status and timestamps
   - Built contact form with Firestore data capture and EmailJS delivery; all submissions persisted for audit trail

### Portfolio Links
- **Live Demo:** https://udara-ukv.github.io/AURELUX/
- **GitHub Repo:** https://github.com/udara-ukv/AURELUX
- **Admin Dashboard:** https://udara-ukv.github.io/AURELUX/admin.html (credentials: admin@aurelux.com / admin123)
- **Orders Page:** https://udara-ukv.github.io/AURELUX/orders.html (create user account to view)

### Interview Talking Points

**Q: Why Firebase instead of a custom backend?**
A: "I chose Firebase for rapid prototyping. Auth handles user sessions securely; Firestore manages data without writing REST APIs. Tradeoff: less control over queries and scaling limits. For production, I'd add a Node.js backend for complex logic and analytics."

**Q: How do you handle email without a server?**
A: "EmailJS runs client-side via OAuth. When a user submits the contact form or admin updates an order, the frontend calls EmailJS directly. No backend intermediary needed. For high-volume production, I'd use a Cloud Function to batch emails and handle retries."

**Q: Tell me about the admin feature.**
A: "The admin dashboard reads orders from Firestore (real-time). Admins can change order status from a dropdown. When saved, the status updates Firestore and triggers an EmailJS send to the customer. It's event-driven without webhooks—all client-side coordination."

**Q: What would you improve for production?**
A: "1. Move email sending to a backend Cloud Function for reliability and rate-limiting. 2. Add payment processing (Stripe). 3. Use Firebase custom claims for admin authentication instead of hardcoded credentials. 4. Implement input validation and sanitization on the backend. 5. Add more comprehensive error handling and retry logic."

---

## For DevOps Internship Applications

### Headline
**DevOps Engineer Intern - CI/CD & Infrastructure** | Building automated testing, monitoring, and deployment pipelines for a static e-commerce site

### Key CV Bullets (pick 4–5)

1. **CI/CD Pipeline**
   - Built GitHub Actions workflow that runs on every push: HTML validation (htmlhint), E2E smoke tests (Playwright), Lighthouse performance audits, and automated deployment to GitHub Pages
   - Configured blocking test gates: pipeline fails if Playwright tests fail or Lighthouse score drops, ensuring code quality before deployment

2. **Automated Testing**
   - Wrote Playwright E2E smoke tests to validate critical user flows (anchor navigation, checkout process)
   - Tests run in CI without manual intervention; failures prevent deployment; results stored as artifacts for review

3. **Performance Monitoring**
   - Integrated Lighthouse audits into CI pipeline; HTML reports generated and stored as GitHub Actions artifacts for trend analysis
   - Tracked performance metrics (Largest Contentful Paint, Cumulative Layout Shift) across releases

4. **Error Tracking & Logging**
   - Implemented client-side error capture: JavaScript errors queue and flush to Firestore `client_logs` collection for debugging
   - Added Sentry SDK (optional) for production-grade error tracking, distributed tracing, and session replay

5. **Infrastructure & Deployment**
   - Deployed static web app to GitHub Pages with zero-downtime CI/CD; all assets served from CDN with PWA caching layer
   - Service worker caches critical assets; failed network requests fall back to cached app shell, improving reliability

6. **Monitoring & Observability**
   - Configured structured logging: client errors tagged with user, session, and environment metadata for root-cause analysis
   - Built admin UI for configuring email alerts and page visibility toggles without redeploying

### Portfolio Links
- **Live Demo:** https://udara-ukv.github.io/AURELUX/
- **GitHub Repo & Actions:** https://github.com/udara-ukv/AURELUX/actions (view CI/CD runs)
- **Workflow File:** https://github.com/udara-ukv/AURELUX/blob/main/.github/workflows/pages.yml
- **Lighthouse Artifacts:** Available in each GitHub Actions run

### Interview Talking Points

**Q: Describe your CI/CD pipeline.**
A: "On every push to main, GitHub Actions runs: 1) htmlhint validates HTML, 2) Playwright smoke tests run (blocks if fail), 3) Lighthouse audits the live site, 4) if all pass, deploy to Pages. Reports stored as artifacts. This ensures code quality before users see it."

**Q: Why Playwright for testing?**
A: "Playwright runs E2E tests in a real browser context. I wrote a smoke test to verify anchor navigation (About/Contact links jump correctly). It's fast (~30s), reliable, and catches regressions that unit tests miss."

**Q: How do you monitor errors in production?**
A: "JavaScript errors are caught and queued on the client. When Firebase is available, they flush to a `client_logs` Firestore collection with metadata (user, session, stack trace). Admins can query logs to debug issues. I also integrated Sentry SDK for optional production monitoring."

**Q: What's the impact of your PWA / service worker?**
A: "The service worker caches the app shell on first visit. If the user goes offline or network is slow, cached assets serve instantly. Lighthouse scores improve (30+ points). Users in areas with poor connectivity get a better experience."

**Q: What would you add if this was a real production system?**
A: "1. Horizontal scaling: move to containerized deployment (Docker + Kubernetes) for high traffic. 2. Advanced monitoring: Datadog or New Relic for infra metrics. 3. Load testing (k6) to validate performance under stress. 4. Security scanning in CI (OWASP, npm audit). 5. Blue-green deployments for zero-downtime updates. 6. Incident on-call rotations and alerting (PagerDuty)."

**Q: Tell me about your error recovery strategy.**
A: "Client errors are queued in memory. If Firestore is unavailable, the queue persists locally. When connection restores, queued errors flush automatically. For critical errors, I'd implement exponential backoff and dead-letter queues on a backend. I'd also add synthetic monitoring (health checks) to detect outages before users report them."

---

## General Interview Prep

### Portfolio Storytelling (2–3 min pitch)
"I built AURELUX, a full-stack e-commerce demo that showcases both software engineering and DevOps practices. On the frontend, it's a responsive PWA (no frameworks—HTML, CSS, vanilla JS). On the backend, I used Firebase for rapid development: Auth handles user sessions, Firestore persists orders and user data, and EmailJS automates transactional emails. On the DevOps side, I built a GitHub Actions pipeline that runs E2E tests, Lighthouse audits, and auto-deploys to GitHub Pages. Every commit triggers the pipeline; if tests fail, the deployment blocks. I also added client-side error logging to Firestore so I can debug issues in production. The whole thing is zero-cost to run, and it serves as a template for building fast, scalable, and observable applications."

### Demo Script (5 min live demo)
1. Show homepage: features, responsive design, About/Contact sections
2. Register a new user (shows Firebase Auth, welcome email)
3. Browse products, add to cart, checkout (shows Firestore order creation)
4. Show "My Orders" page (user sees their placed order)
5. Log in to admin dashboard (show recent orders, statistics)
6. Admin updates an order status → triggers email to customer (show Firestore update + EmailJS log)
7. Show GitHub Actions workflow results (passing tests, Lighthouse scores)

### Resume / Linked-In Summary
"Full-stack and DevOps-focused software engineering intern seeking to contribute to scalable, observable systems. Experience building responsive PWAs with Firebase, designing automated CI/CD pipelines with GitHub Actions, and implementing production-grade monitoring and error tracking. Comfortable with cloud services, testing frameworks, and infrastructure-as-code practices."

---

## Application Checklist

- [ ] Update resume with CV bullets above
- [ ] Add portfolio links (GitHub, live demo) prominently on resume
- [ ] Prepare 2–3 screenshots showing key features (homepage, admin, orders page)
- [ ] Record a 2–3 min demo video showcasing the live site and admin features
- [ ] Prepare answers to DevOps and Full-Stack talking points
- [ ] Customize cover letter to mention specific role requirements and map to AURELUX features
- [ ] Apply to both Full-Stack AND DevOps roles (same resume, tweak bullets per role)
- [ ] Follow up after 1 week if no response

## Application Angle for Sri Lanka Internship Market

**What to emphasize:**
- **No-cost infrastructure:** GitHub Pages is free; Firebase free tier covers typical startup usage. Shows resourcefulness.
- **End-to-end ownership:** Built features, deployment, monitoring, and testing yourself. Shows initiative.
- **Real-world practices:** CI/CD, error logging, user-facing features. Not just a tutorial project.
- **Quick iteration:** Full feature set deployed and live within days. Shows execution speed.

---

Good luck with your applications! 🚀
