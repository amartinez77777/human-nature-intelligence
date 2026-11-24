# Human Nature Intelligence · v1.0.0-rc1

**Release candidate — source implementation, not production-certified.** HNI is a research-first, local-first educational encyclopedia of Robert Greene’s 18 laws. It retains the eight modules, all canonical research, six branching fictional simulations, 57 exercises, three learning paths and 18 lessons. No backend, mandatory account, paid API, analytics or runtime AI.

## Start here

Read `docs/HNI_START_HERE_DEPLOYMENT_GUIDE.txt`. This archive has no genuine npm lockfile because registry DNS returned EAI_AGAIN. Node 22.16.0 is specified in `.nvmrc`. The dependency-free validation and 128 offline tests passed; full typecheck, lint, Vitest, production compilation and browser testing remain blocked. Do not upload raw React files to Netlify Drop.

In a network-enabled environment, put the contents of `hni/` at your GitHub repository root, including `.github/`. Run workflow **1 - Generate genuine npm lockfile**, download and commit the generated lockfile. Run **2 - Verify and build both hosting packages**. If it passes, download either compiled artifact. To publish through GitHub Pages, choose GitHub Actions as the Pages source and run **3 - Verify and publish GitHub Pages** on `main`. These workflows have not been executed in this environment.

Local alternative:

```sh
npm install --no-audit --no-fund
npm ci --no-audit --no-fund
npm run verify
npm run build:github
npm run build:netlify
npx playwright install chromium
npm run test:browser
```

`npm run build` defaults to GitHub Pages, `/human-nature-intelligence/`, output `dist/github`. `HNI_GITHUB_BASE=/renamed-repo/` overrides the default. Netlify uses `/` and `dist/netlify`. HashRouter allows static-host deep links. `npm run preview` and `npm run preview:netlify` use the matching mode. GitHub workflows infer the repository name for a project site. No service worker is installed.

## Research and data

Dataset v3, scenario envelope v1, user progress v2 (same key `hni.user-progress.v1`); valid v1/v2 backups supported. Import requires explicit confirmation and successful storage write. An unreadable original can be downloaded as raw text; that is not a validated backup. Keep regular JSON exports: storage is origin-specific, not shared across GitHub Pages, Netlify, devices or browsers. Do not downgrade without a backup.

All 18 chapters remain partially reviewed: 23/60 substantive sections credited, 37 pending, eight independent evidence questions unassessed. Six scoped research findings retain their access limitations. Stage 10 structurally checked all 18 headings/subtitles and 60 section headings against the matching 690-page PDF; 132 book references fall within their recorded chapters. These checks do not constitute a full chapter or scientific review. PDF physical index is zero-based; printed page mapping is unresolved. The copyrighted PDF is not distributed.

## Navigation and maintenance

- Command Center `/`; laws `/laws`; Atlas `/atlas`; cases `/cases`; Knowledge Network `/network`; Simulation Lab `/lab`; evidence `/evidence`; Academy `/academy`.
- `/search`, `/compare`, `/atlas/compare`, `/sources`, `/settings`; all are hash routes.
- `src/data/`, `src/domain/`, `src/services/` and `research/` remain canonical. All original IDs and Stage 09 research datasets are unchanged. Preserve the separate provenance/evidence/editorial status and use append-only stable IDs. No new research assertions were added in Stage 10.
- Historical stage reports and detailed contracts remain in `docs/` and `research/`. For current verification use `docs/HNI_FINAL_QA_TEST_MATRIX.md`; for preservation use `docs/HNI_FINAL_RESEARCH_AND_PRESERVATION_AUDIT.md`.
- Production gates remain mandatory. Repair any CI compilation, lint, runtime or layout failures before promotion to v1.0.0; never weaken checks just to pass.
