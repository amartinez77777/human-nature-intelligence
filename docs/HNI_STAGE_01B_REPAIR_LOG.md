# HNI Stage 01B | Repair Log and Defect Register

**Method:** audited and edited the real `HNI_STAGE_01_SOURCE.zip` application in place. No replacement app, new research study, deleted module, or dataset reset.

| Priority | Baseline problem / risk | Affected files | Implemented correction | Verification / remaining limitation |
|---|---|---|---|---|
| P0 | No dependency lockfile; npm not installed reproducibly | `package.json`, `README.md`, `docs/DEPLOYMENT.md`, `.github/workflows/deploy.yml` | Added Node engine requirement and documented genuine lockfile generation; CI fails fast without committed lockfile; disabled temporary bootstrap; npm ci required | **BLOCKED**: npm DNS EAI_AGAIN, offline cache ENOTCACHED; no lockfile fabricated |
| P0 | Workflow attempted npm cache setup before late lockfile bootstrap | `.github/workflows/deploy.yml` | Changed to verify first, require committed lock, then setup-node cache + npm ci; CI checks on PR/push, deploy only verified main | YAML **PASS**; GitHub execution **NOT RUN** |
| P1 | Import replaced existing bookmarks immediately after parsing | `src/modules/command-center/SourceAndSettings.tsx`, `src/app/ProgressContext.tsx`, `src/services/progress-validation.ts` | Stage validated import in local state; accessible native modal with explicit Cancel/Confirm; replacement persists before visible update | Guard tests **PASS**; browser dialog **NOT RUN** |
| P1 | Failed local storage write could imply data was saved | `src/app/ProgressContext.tsx`, `src/modules/intelligence-academy/IntelligenceAcademy.tsx`, `src/components/layout/Shell.tsx` | Progress updates become storage-first; context exposes warnings; Academy's saved claim requires persisted completed ID | Transaction tests **PASS**; UI runtime **NOT RUN** |
| P1 | Corrupt saved progress could be silently overwritten by initial effect | `src/services/persistence.ts`, `src/app/ProgressContext.tsx` | Removed automatic mount-time save; preserve original corrupt entry, block incidental writes, allow recovery only after confirmed valid backup | Source inspected; no browser storage fixture executed |
| P1 | Missing/invalid fields and duplicates in imported progress | `src/services/progress-validation.ts`, `src/services/backup-envelope.ts`, `src/services/import-export.ts` | Strict version-1 structural gate, safe ID patterns, deduplication, length limits, rejects empty/malformed/non-HNI payload | Node offline tests **PASS** |
| P1 | Knowledge Network hardcoded `SRC-0001` for every locator | `src/modules/knowledge-network/KnowledgeNetwork.tsx`, `src/services/source-resolution.ts` | Resolve edge→reference→actual source; correct `/sources/:id`; null handling; two-source regression fixtures | Offline source tests **PASS** |
| P1 | Shared source cards claimed every source was an inspected PDF | `src/components/shared/UI.tsx`, `src/modules/command-center/SourceAndSettings.tsx`, `src/services/source-labels.ts` | Per-source provenance/type, optional page conventions, accurate bibliography, related research records and source navigations | Static inspection + source label test **PASS**; browser **NOT RUN** |
| P1 | All source locators implicitly bounded by the book's 690 pages | `src/domain/validator.ts`, `scripts/validate-data.mjs` | Scope 690-page bound to `SRC-0001`; support alternate sources with chapter/section or printed-page locators | Future-source fixture **PASS** |
| P1 | Unvalidated URL schemes could enter source URL metadata | `src/domain/schemas.ts`, `scripts/validate-data.mjs` | Accept HTTP(S) only for verified source links | Negative fixture **PASS** |
| P1 | Future evidence and cases were represented as always unverified/unassessed | `src/modules/science-evidence/ScienceEvidence.tsx`, `src/modules/historical-cases/HistoricalCases.tsx` | Render record-specific evidence and provenance statuses, dynamically list findings, avoid universal primary-book wording | Static inspection only |
| P2 | Law previous/next links depended on array positions | `src/modules/laws-library/LawsLibrary.tsx` | Navigate by canonical chapter-derived `LAW-XX` identifiers | Static inspection only |
| P2 | Network fallback entity query was ignored | `src/modules/knowledge-network/KnowledgeNetwork.tsx`, `src/components/shared/UI.tsx` | Filter when linked to an `entity` query; source reference links go through actual source ID | Static inspection only |
| P2 | Import confirmation and source metadata lacked mobile-specific layouts | `src/styles/global.css` | Responsive native dialog, accessible minimum action size, source metadata reflow at small widths | CSS parse **PASS**; visual inspection **NOT RUN** |
| P2 | Existing offline tests did not exercise source selection or import replacement | `scripts/offline-tests.mjs`, `src/tests/repair-regressions.test.ts`, `package.json` | Preserved 8 Node baseline tests, added 11 regression tests + Vitest coverage for import, transaction, source selection, bad locators | Node **19/19 PASS**; Vitest **BLOCKED** |
| P2 | Documentation implied CI might bootstrap a lockfile | `README.md`, `docs/ARCHITECTURE.md`, `docs/DATA_DICTIONARY.md`, `docs/DEPLOYMENT.md` | Updated wording and validation/migration contracts to actual repaired state | Documentation inspected |

## Deliberately not changed

- No `src/data/*.json` or `research/*.json` changed.
- No edits to the chapter map, edition, scientific evidence claims or research status.
- No new historical assertions, psychological analyses, quotations, or research references.
- No additional module, backend, paid API, account system, or deep chapter ingestion.
- No generated fake lockfile, browser screenshot, production `dist`, or GitHub deployment.

## Stage 02 gate

Repair source is cumulative, but **dependency-backed readiness is not established**. Before substantial ingestion, finish npm install and verify typecheck, lint, all tests and build on a registry-connected environment, then run a browser smoke suite. Retain and carry forward these source repairs.
