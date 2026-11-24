# Current deployment contract | v1.0.0-rc1

The current authoritative guide is `HNI_START_HERE_DEPLOYMENT_GUIDE.md`. Earlier stage reports document historical deployment decisions, not current instructions.

Two modes: GitHub Pages uses `/human-nature-intelligence/` or `HNI_GITHUB_BASE=/repository-name/` and `dist/github/`; Netlify uses `/` and `dist/netlify/`. Default `npm run build` selects GitHub Pages. No backend or history fallback is required with HashRouter. Build verification checks generated entry JS/CSS existence, expected base and nonempty files; the browser suite checks the actual compiled app at both bases. Neither compiled artifact currently exists. The PDF and user backups must never be published.

Three workflows are manually dispatched from `main`: one-time lockfile recovery, verified dual-target artifacts, and production Pages deployment. The artifact workflow also verifies PRs, never deploys them. Normal builds require a committed real lockfile. Netlify connected builds run npm ci and source gates after checking tracked lockfile integrity. Use the manual browser artifact workflow before publishing Netlify; Netlify build itself does not execute browser tests. No host has been deployed or verified yet.

Node version 22.16.0 is pinned for reproducibility; update intentionally if needed, regenerate/test the genuine lockfile, and check the CI environment. Browser smoke uses Chromium, not Safari. See the publishing guide for actual iPhone verification steps.
