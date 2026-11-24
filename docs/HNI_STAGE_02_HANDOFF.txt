# HUMAN NATURE INTELLIGENCE — STAGE 02 HANDOFF TO STAGE 03

**Stage 02 cumulative source:** `HNI_STAGE_02_SOURCE.zip`  
**Source package used:** `HNI_STAGE_01B_REPAIRED_UNVERIFIED_SOURCE(1).zip` (`hni/` folder, 75 original files)  
**Current app version:** `0.2.0`  
**Dataset schema:** 1  
**User progress schema:** 1, key `hni.user-progress.v1`  
**Build status:** **Cumulative research integrated; npm/production build BLOCKED and UNVERIFIED**.

## 1. Start from these exact files

In the next implementation conversation attach:

1. `HNI_STAGE_02_SOURCE.zip` — **the one current source of truth; NOT Stage 01 or 01B**.
2. `HNI_STAGE_02_HANDOFF.md` — this handoff (also inside ZIP at `hni/docs/`).
3. The complete readable PDF of Robert Greene's *The Laws of Human Nature* matching SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`.

All deliverables are downloadable on iPhone. The app ZIP has a single `hni/` root; individual Markdown reports and plain TXT copies are included under `hni/docs/`.

## 2. What was preserved

- Actual React 18 + TypeScript strict + Vite + HashRouter app, all eight permanent modules, search, detail routes, Atlas, case archive, Knowledge Network, simulated learning, Evidence, Academy, source registry and GitHub Pages project base `/human-nature-intelligence/`.
- Every original canonical entity ID and source record, original Pericles case, baseline references, original claims, all relationships and `PATH-0001`.
- Stage 01B pre-import confirmation, versioned progress validation, transactional browser storage, corruption preservation, safe source-specific labels, actual `REF` → `SRC` resolution, and source-aware URL/locator handling.
- No personal progress schema changes. No data migration and no ID aliases were needed. `research/ID_ALIASES.json` is preserved.

## 3. Verified PDF and research scope

- Same 690-page PDF, same source fingerprint as Stage 01B. Publisher line: Viking / Penguin Random House, copyright 2018. PDF-format-specific ISBN is not independently identified; printed page numbering remains unverified.
- LAW-01 (Irrationality) and LAW-02 (Narcissism) extended from existing partial dossiers; LAW-03 (Role-playing) and LAW-04 (Compulsive Behavior) now have source-linked explanatory dossiers. All **four remain `partially_reviewed`**, not fully certified.
- 14 of 14 major section headings spot-checked across Laws 1–4; 7 of 14 sections counted substantively reviewed, with remaining detailed review honestly tracked. The corrected Law 4 *Toxic Types* heading starts on viewer page **138**, zero-based index **137**.
- Source-oriented expansion: **18 laws, 12 concepts, 4 historical cases, 10 claims, 1 source, 22 source references, 0 independent scientific findings, 21 graph edges, 9 multiple-choice questions, 1 learning path**.
- `CAS-0002` Shackleton, `CAS-0003` Milton Erickson, `CAS-0004` Howard Hughes are explicitly Greene's secondary-source historical accounts. `documentedFacts` remains empty until independent verification. No medical or personality diagnosis from fictional or historical behavioral clues.
- Original explanations are editorial syntheses from inspected chapters. Inferences, fictional scenarios, source attribution and empirical truth are differentiated. No extensive book text is copied into the app.

## 4. Files added and changed

**Canonical data:** updated `src/data/laws.json`, `concepts.json`, `historical-cases.json`, `claims.json`, `source-references.json`, `knowledge-edges.json`, `exercises.json`, `learning-paths.json`. `sources.json` and `research-findings.json` are unchanged.

**Research:** updated `research/COVERAGE_MATRIX.json`, `SOURCE_LEDGER.json`, `PDF_SOURCE_MANIFEST.json`; added `research/STAGE_02_READING_LOG.json` documenting 42 PDF page checks. `CHAPTER_MAP.json` and `ID_ALIASES.json` preserved without new ID allocation policy.

**UI:** updated `src/modules/laws-library/LawsLibrary.tsx`, `src/modules/command-center/CommandCenter.tsx`, `src/styles/global.css`; added `src/services/coverage.ts`. Existing eight module routes remain unchanged.

**Validation:** updated `scripts/offline-tests.mjs` with count-independent baseline tests, noncolliding multi-source fixture, and 5 new integration tests; added `scripts/validate-research.mjs`; updated `package.json` version and `validate:data` command.

**Documentation:** README, research audit, chapter coverage, build status, Stage 02 handoff and manifest. `docs/STAGE_HANDOFF.md` now points to Stage 03.

## 5. Exact verification record

**PASS:** `npm run validate:data` produced **0 errors, 14 awaiting-review warnings**, and research validation passed all 56 ledger links.  
**PASS:** `npm run test:offline` produced **24/24 passing tests**.  
**STATICALLY INSPECTED:** global TypeScript parser processed 37 source files with 0 parse errors; 98 relative imports had no missing target files; CSS parser found 0 syntax errors.  
**BLOCKED:** one bounded npm lockfile attempt timed out; no real lockfile; `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test` (Vitest), and `npm run build` cannot complete without npm dependencies. Their attempted command failures are recorded precisely in `HNI_STAGE_02_BUILD_STATUS.md`.  
**NOT RUN:** compiled browser smoke tests, real 375/390/430px browser checks, iPhone Safari tests, GitHub Actions execution, and deployment.

**Do not label this release build verified.** A run of `npm run validate:data` or a TS syntax parser does not establish successful compilation. The unchanged Pages workflow intentionally fails until a genuine committed `package-lock.json` exists.

## 6. Stage 03 first engineering actions

1. Extract the **actual** Stage 02 ZIP with exactly one `hni/` root, read this handoff, canonical schemas, source map, tests and all eight routes. Do not rebuild or discard features.
2. In a network-enabled Node >=22.16.0 environment, run genuine `npm install`; commit `package-lock.json`, run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run validate:data`, `npm run test:offline`, `npm run test`, `npm run build`, and fix actual discovered issues.
3. Preserve `LAW-01` through `LAW-18`, all `CON/CAS/CLM/SRC/REF/EDG/EXR/PATH` IDs, Stage 01B protections and user progress compatibility.
4. Inspect the exact same book PDF and research Laws **5–8**. Treat each chapter heading and law subtitle as separate fields. Record real page/section locators, only label content reviewed when actually read, and distinguish Greene's views from scientific and historical verification.
5. Extend the canonical JSON and existing UI/repository; add exercises and graph edges with valid supported relationship enums. Avoid recreating or duplicating any records already present.
6. Validate reference chains, user-state safety, module navigation, and all available tests. Retain outstanding issues instead of silently declaring success.
7. Produce one **complete cumulative** `HNI_STAGE_03_SOURCE.zip` containing one `hni/` source root, updated handoff and research reports, without previous release ZIPs or copyrighted PDF.

## 7. Editorial debt remaining

- Complete exhaustive chapter reading/reconciliation for Laws 1–4 before upgrading `partially_reviewed` to `fully_reviewed`.
- Independent historical sourcing for Pericles, Shackleton, Erickson and Hughes; scientific evaluation deliberately belongs to Stage 07.
- Existing 14 future law records (Laws 5–18) remain awaiting substantive research.
- Dependency lockfile, full compile, runtime, browser and GitHub Pages verification remain P0 release gates.

**This artifact is the source of truth for Stage 03; do not restart at the earlier ZIP.**
