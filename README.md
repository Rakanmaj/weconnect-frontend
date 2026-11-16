# WeConnect frontend

React 19, JavaScript/JSX, HTML, CSS, Vite, React Router and Tailwind CSS v4.
The existing interface, assets, routes, prototype data and user journeys are preserved.

Backend repository: https://github.com/Rakanmaj/weconnect-backend

## Install and run

Use Node.js 20.19+ or 22.12+ (Node.js 24 is supported).

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Run the backend separately on http://localhost:4000.
Vite proxies same-origin /api requests to the backend. The proxy defaults to port
4000 and can read API_PORT from ../backend/.env when the two folders are siblings.
For the original combined setup, clone the repositories into folders named
frontend and backend inside the same parent directory.

```bash
git clone https://github.com/Rakanmaj/weconnect-frontend.git frontend
git clone https://github.com/Rakanmaj/weconnect-backend.git backend
```

## Commands

- npm run dev: frontend development server on port 3000.
- npm run build: production build in dist/.
- npm run preview: static build preview on port 3000; this has no development API proxy.
- npm run lint: JavaScript/JSX checks.

For a combined local production preview, build this frontend then run npm start
in the sibling backend folder; Express serves frontend/dist and /api together.
An independently hosted static deployment needs a reverse proxy for /api to the
backend, preserving the existing cookie-based same-origin authentication flow.

## Structure

- src/pages/: public, developer, company and administrator screens.
- src/components/: shared UI, portal layouts and form controls.
- src/lib/: API/auth helpers and remaining prototype domain data.
- public/: original logos, animation, fonts and static assets.
- vite.config.js: source alias and development API proxy.
- eslint.config.js and package-lock.json: standalone lint/install support.

## Current implementation

Authentication, profiles/onboarding, private uploads, initial verification, staff
roles, recovery, timed assessments, skills/challenges and internal projects use
the Express/PostgreSQL backend. Company staff sign in with owner-provisioned
credentials. Exam scoring is automatic; suspected cheating requires administrator
review. If automatic grading is unavailable, saved answers are preserved and the
interface supports retrying the submission or loading the saved attempt again.
Adaptive assessment follow-ups remain unfinished. Company project persistence is
included in the backend integration; other later screens may still use prototype
behavior. There is no payment gateway.

## Entry routes

- /login: developer/company sign-in.
- /register: developer/company registration.
- /developer/dashboard and /company/dashboard: authenticated portals.
- /admin/login: administrator sign-in.

Private configuration, dependencies and build outputs are excluded from Git.
This repository contains source and assets, not the live database or accounts.
