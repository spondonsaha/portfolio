# Spondon Saha — Portfolio Website

A full-stack personal portfolio site with a React (Vite) frontend and a Node/Express backend API.
Design direction: an elegant dark one-pager in the style of minimal product-designer portfolios —
near-black background, an editorial serif/sans pairing (Fraunces + Inter), a hero photo with a
handwritten annotation, case-study-style cards, and pull-quote-style award callouts.

```
spondon-portfolio/
├── client/     React + Vite frontend
└── server/     Express backend API
```

## What's included

- **Frontend (`client/`)**: React (Vite) app with client-side routing (Home + a dedicated Projects
  page), a light/dark theme toggle (persisted in the browser), and content fetched from the
  backend API — including a working contact form.
- **Backend (`server/`)**: Express API serving your profile data as JSON (bio, skills,
  certifications, experience, awards, projects) and a `/api/contact` endpoint that validates and
  stores messages sent through the form (with basic rate limiting and spam honeypot protection).

## 1. Run the backend

```bash
cd server
npm install
npm start          # or: npm run dev  (auto-restarts on file changes)
```

The API runs on **http://localhost:4000**. Key endpoints:

| Method | Endpoint              | Description                                  |
|--------|------------------------|-----------------------------------------------|
| GET    | `/api/health`           | Health check                                  |
| GET    | `/api/profile`          | Full profile (bio, skills, contact, etc.)     |
| GET    | `/api/certifications`   | Certifications list                           |
| GET    | `/api/experience`       | Work / findings list                          |
| GET    | `/api/awards`           | Awards & recognitions list                    |
| POST   | `/api/contact`          | Submit the contact form (`name`, `email`, `message`) |
| GET    | `/api/messages`         | View submitted messages (requires `X-Admin-Token` header matching `ADMIN_TOKEN` env var) |
| GET    | `/api/projects`         | Full projects list                            |
| GET    | `/api/projects/:slug`   | A single project by slug                      |

All profile content lives in `server/data/profile.json` — edit that file to update anything on
the site (bio text, skills, certifications, experience entries, awards, contact links). No code
changes needed.

Submitted contact messages are appended to `server/data/messages.json` (auto-created, gitignored).

## 2. Run the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api/*` requests to the backend on
port 4000, so make sure the backend is running too.

If the backend is offline, the site still renders using a local fallback copy of your profile
data (`client/src/data/fallbackProfile.js`) — but the contact form won't be able to send messages.

## 3. Add your images and resume

The following files are referenced but not included (add your own):

- `client/public/me.jpeg` — your headshot, shown in the About section
- `client/public/resume-spondon.pdf` — your resume, linked from the "Download resume" button
- `client/public/certs/*.png` / `.jpeg` — certification badge images
- `client/public/awards/*.jpg` / `.jpeg` — award images (referenced in data, not currently rendered — add an `<img>` in `Awards.jsx` if you want them shown)
- `client/public/projects/*.png` — project cover images shown on the Projects page (the three
  disclosure write-ups currently reuse your existing `/proof/*.png` images — swap in real project
  covers whenever you have them)

If an image is missing, the site degrades gracefully (photo shows a placeholder, cert badges just
hide the broken image icon) rather than breaking.

## 4. Deploy on Vercel

The whole project runs as a **single Vercel project** (frontend + API on the same domain, so the
client's relative `/api/*` calls work with no CORS setup). The repo root contains:

- `vercel.json` — builds the client (`client/dist`) and routes `/api/*` to a serverless Express
  function (`api/index.js`).
- `api/index.js` — Vercel serverless entry that wraps the Express app in `server/app.js`.
- `package.json` — npm workspaces (`client` + `server`) so one `npm install` gets everything.

To deploy:

1. Push this repo to GitHub and import it as a **new** Vercel project (project root = repo root,
   **not** the `client/` folder). Or run `vercel --prod` from the repo root.
2. Set these env vars in Vercel (Project → Settings → Environment Variables):
   - `RESEND_API_KEY` — your Resend API key (resend.com/api-keys). Without this, contact
     messages fall back to local file storage (fine for development, lost on Vercel).
   - `RESEND_TO` — the inbox that contact-form messages get emailed to.
   - `RESEND_FROM` — a verified sender, e.g. `onboarding@resend.dev` or `you@yourdomain.com`.
   - `ADMIN_TOKEN` — optional; protects the `/api/messages` endpoint.
3. Deploy. Contact messages are emailed to you via Resend (free tier is enough) instead of being
   written to a file, since Vercel's serverless filesystem is read-only.

Client-side routing is handled in `vercel.json` — unknown routes rewrite to `/index.html`, so a
direct visit to `/projects` works.

## 5. Light / dark mode

A toggle in the navbar (sun/moon icon) switches themes and remembers the choice in the browser.
Color values for each theme are CSS variables at the top of `client/src/index.css` — light-mode
overrides live under the `:root[data-theme="light"]` block.

## 6. Environment variables

- `PORT` — backend port (default `4000`)
- `RESEND_API_KEY` — Resend API key. When set, contact messages are emailed instead of stored in
  a file (required on Vercel).
- `RESEND_TO` — email address that receives contact form messages.
- `RESEND_FROM` — verified sender address (defaults to `onboarding@resend.dev` if unset).
- `ADMIN_TOKEN` — set this to protect the `/api/messages` endpoint, e.g.:
  ```bash
  ADMIN_TOKEN=some-long-random-string npm start
  ```
  Then view messages with:
  ```bash
  curl -H "X-Admin-Token: some-long-random-string" http://localhost:4000/api/messages
  ```

## Customizing the design

- Colors, fonts, and spacing are defined as CSS variables at the top of `client/src/index.css`.
- Section content/order is composed in `client/src/App.jsx`.
- The handwritten annotation next to the hero photo is in `client/src/components/Hero.jsx` —
  edit the `<span>` text or swap the accent font (`--font-hand`, currently "Caveat") to restyle it.
- Scroll-reveal fade-ins are handled by the `useReveal` hook in `client/src/hooks/useReveal.js`,
  applied to each section.
- Project entries live in the `projects` array in `server/data/profile.json` — add, edit, or
  remove entries there and they'll show up on both the homepage teaser and the `/projects` page
  automatically. Each project supports a `tags` array (used for the filter buttons on the
  Projects page) and a `links` array (external write-ups, GitHub repos, etc).
