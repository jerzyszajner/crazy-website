# APZ — Archive of Coincidental Convergences

Sandbox for experimenting with **autonomous, end-to-end website building** (AI-assisted design, structure, and implementation). The repository folder is `crazy-website`; the npm package name is `apz-archive`.

## What it is

A small **vanilla JavaScript** single-page app: hash-based routing, a thin global state layer, and a fictional “archive” experience backed by static content and simple i18n (English, Polish, Norwegian Bokmål). No UI framework.

Accessibility is intentionally lightweight but real: skip link, `prefers-reduced-motion`, a list mode for keyboard and screen-reader-friendly navigation, arrow keys and Enter on the connection map (canvas), an `aria-live` region for node announcements, `aria-pressed` on the view-mode toggle, and focus moved to the detail title on open with restore on close.

## Stack

- [Vite](https://vitejs.dev/) 6
- [Tailwind CSS](https://tailwindcss.com/) 4 (`@tailwindcss/vite`)
- [ESLint](https://eslint.org/) 9

## Prerequisites

- **Node.js 20+** (or current LTS)

## Commands

```bash
npm install
npm run dev      # local development
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

Fictional institution and content; not production software.
