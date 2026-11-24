# HNI · Stage 01 Handoff

**Version:** 0.1.0  
**Prepared:** 2026-11-23  
**Next stage:** Stage 02 must continue **this cumulative `hni/` source tree**. Never recreate or reseed stable IDs.

## Summary

Stage 01 research pipeline and a complete React/TypeScript application **source implementation** have been created, covering all 8 permanent modules. The PDF chapter structure has been verified, the initial linked records were written using actual passages, and independent data-integrity checks ran. **Release acceptance remains PARTIAL**, because the environment cannot access npm registry packages, so dependency installation, TypeScript checking with project types, linting, Vitest, browser rendering, and production build were **not verified**.

## Primary source

- Author and title: Robert Greene, *The Laws of Human Nature*.
- Imprint and year: Viking/Penguin Random House, 2018 copyright.
- SHA-256: `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`.
- Physical pages: 690. File bytes: 2986842.
- Copyright page ISBNs: hardcover `9780525428145`; ebook `9780698184541`; international `9780525561804`.
- **Actual PDF printing format: unresolved.** This file appears PDFium-generated and does not identify one unique ISBN. No printed-page mapping verified.
- Chapter openings indexed: **18/18**. Subsection heading matches: **60/60**. This is a structural index, not comprehensive research coverage.

## Source code architecture

- Vite + React 18, strict TypeScript, React Router `HashRouter`, Zod runtime schemas, Vitest tests, modern CSS, static JSON datasets, localStorage state.
- Eight module routes:
  1. `/` Intelligence Command Center.
  2. `/laws` and `/laws/:id` The 18 Laws Library.
  3. `/atlas` and `/atlas/:id` Human Behavior Atlas.
  4. `/cases` and `/cases/:id` Historical Cases.
  5. `/network` Typed Network (navigable edge list; **graph visualization deferred to Stage 08**).
  6. `/lab` Behavioral Simulation (one functioning fictional reasoning scenario; **advanced simulations deferred to Stage 09**).
  7. `/evidence` and `/evidence/:id` Science, Evidence & Criticism (attribution-led dossiers; **independent literature review deferred to Stage 07**).
  8. `/academy` Intelligence Academy (one working source-linked question; **advanced academy deferred to Stage 09**).
- Additional routes: `/sources`, `/sources/:id`, `/search`, `/settings`.
- Shared data repository, canonical search index, typed knowledge edges, source panes, bookmarking, recently viewed, versioned JSON import/export.
- GitHub Pages workflow and project-site base `/human-nature-intelligence/` included; workflow has **not** been triggered, and site has **not** been deployed.

## Canonical records created

| Entity | Records | Treatment |
|---|---:|---|
| Laws | 18 | LAW-01 and LAW-02 partly reviewed; other 16 metadata-only |
| Concepts | 3 | CON-0001 through CON-0003 |
| Historical cases | 1 | CAS-0001; Greene account only; no independent historical verification |
| Claims | 2 | CLM-0001 and CLM-0002, author attribution verified, science not assessed |
| Sources | 1 | SRC-0001, PDF directly inspected |
| Source references | 6 | REF-0001 through REF-0006, zero-based PDF index |
| Research findings | 0 | No external studies claimed |
| Knowledge edges | 4 | EDG-0001 through EDG-0004 |
| Exercises | 1 | EXR-0001 |
| Learning paths | 1 | PATH-0001 |

Source/provenance status, scientific evidence status, and editorial coverage status are three **independent fields**. Do not use confidence as a single conflated score.

## Test execution (actual, not inferred)

| Check | Result | Notes |
|---|---|---|
| PDF open, text extraction, SHA-256 | PASS | Opened actual 690-page uploaded PDF via PyMuPDF |
| Chapter and section structural matching | PASS | 18 chapter openings; 60 subsection body matches |
| `npm run validate:data` | **PASS** | Node built-in integrity checker: 0 errors, 16 intentional awaiting-research warnings |
| `npm run test:offline` | **PASS** | 8/8 built-in Node tests using corrupted fixture checks |
| TypeScript source syntax parse | **PASS** | TypeScript AST parsing: 0 parse diagnostics (not type checking) |
| CSS syntax parser | **PASS** | 0 parser errors |
| `npm install` / `npm ci` | **BLOCKED** | npm registry DNS unreachable and no package-lock could be generated |
| `npm run typecheck` | **BLOCKED** | `vite/client` and `vitest/globals` type definitions absent |
| `npm run lint` | **BLOCKED** | ESLint executable not installed |
| `npm run test` (Vitest) | **BLOCKED** | Vitest executable not installed |
| `npm run build` | **BLOCKED** | Data check passes; Vite executable absent |
| Browser / real iPhone Safari | **NOT RUN** | No compiled frontend; no claims about visual runtime |

### Release blocker: package lockfile

**IMPORTANT:** No verified `package-lock.json` is present. `npm ci` cannot succeed yet. A valid lockfile cannot be invented or generated offline without dependency metadata. To finish release verification on a machine with npm registry access:

```bash
cd hni
npm install
npm ci
npm run typecheck
npm run lint
npm run validate:data
npm run test
npm run build
npm run preview
```

Commit the generated lockfile, correct any actual toolchain errors, test routes on desktop and iPhone, and only then consider build/runtime/deployment accepted. This is a genuine acceptance gap, not a cosmetic warning.

## Known limitations

- Full React app behavior (including localStorage persistence and import/export) is implemented in code but **not runtime-verified**.
- TypeScript and runtime schema code are present and syntax-parsed but await an actual dependency-backed compilation.
- Historical facts are not independently authenticated; empirical findings remain intentionally empty.
- Stage 01 is an encyclopedia foundation, not 18 deep book dossiers.
- No physical page-to-printed page mapping. No real Safari or responsive browser screenshots were produced.
- The PDF source is intentionally excluded from the ZIP for copyright and size reasons.

## Stage 02 continuation directives

1. Start by opening the exact `HNI_STAGE_01_SOURCE.zip` and this handoff. Do not make a new project.
2. Resolve npm network installation, generate a real lockfile, run typecheck/lint/Vitest/build, correct any errors, perform browser smoke tests across 8 routes.
3. Preserve every stable ID, data shape, progress format, and source reference locator. Add explicit migrations for any schema evolution.
4. Extend chapter work **from the actual PDF**, especially detailed LAW-01 records, without falsely upgrading `partially_reviewed` to `fully_reviewed` until all major sections are read and checked.
5. Update source ledger, chapter coverage matrix, cross-links, and negative fixtures. Keep historical or scientific interpretations distinguished from verified evidence.
6. Continue the same premium mobile-first app; do not discard existing modules or redesign it as a productivity journal.
7. Produce a complete **cumulative** ZIP with one `hni/` root, actual test result logs, and a new handoff. Do not nest Stage 01 ZIPs.
