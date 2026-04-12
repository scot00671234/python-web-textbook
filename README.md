# pylearn (site)

Static-first **Vite + React + TypeScript** app for **pylearn**. Run everything from this folder (repo root).

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

Production output is `dist/`. On a VPS, build with `npm run build`, then serve `dist/` with any static file server (for example nginx `root` pointing at `dist`, or `npx serve dist` for a quick test).

## Environment

Optional: set `VITE_SITE_URL` to your public `https://…` origin before `npm run build` so `robots.txt` and `sitemap.xml` in `dist/` get the correct absolute URLs.
