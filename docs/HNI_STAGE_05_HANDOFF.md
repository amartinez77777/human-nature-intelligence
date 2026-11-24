# HUMAN NATURE INTELLIGENCE — STAGE 05 HANDOFF TO STAGE 06

**Authoritative cumulative source:** `HNI_STAGE_05_SOURCE.zip` (one `hni/` folder, HNI v0.5.0). Do NOT continue from Stages 01–04. **Execution status:** offline research integrity tests PASS; reproducible dependency-backed React build BLOCKED/UNVERIFIED.

## Mandatory next conversation attachments

1. `HNI_STAGE_05_SOURCE.zip` — complete cumulative source (source of truth).
2. This `HNI_STAGE_05_HANDOFF.md` (or the plain TXT copy, readable on iPhone).
3. The exact same complete 690-page book PDF. SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e` (matches all previous stages). Copyright 2018, Viking / Penguin Random House; no format-specific PDF ISBN inferred.

## Stage 04 origin and unchanged foundation

Restored the actual uploaded `HNI_STAGE_04_SOURCE(1).zip` (CRC PASS; one `hni/` root). Baseline `validate:data` PASS with 0 errors and 6 warnings; `test:offline` PASS 41/41. Current version is 0.5.0 with 8 unchanged permanent modules, Vite base `/human-nature-intelligence/`, HashRouter, React/TypeScript strict, source-aware citations, multi-source REF→SRC lookup, four-perspective research UI, and four curated comparison records. The complete original Laws 1–12 and preexisting concepts/cases/claims/refs/edges/exercises survived unchanged apart from additive empty analysis-level arrays on earlier concepts and cases (documented schema migration).

**Preserve Stage 01B safety:** pre-import confirmation, data validation before import, storage-failure feedback, corrupt-data preservation, versioned export/import, `hni.user-progress.v1`. User progress and comparison schema remain v1. No backend, paid API, login or inference added.

## Stage 05 exact changes

- Laws 13–15 expanded from metadata-only into source-linked, critical dossiers, still `partially_reviewed`: LAW-13 *Advance with a Sense of Purpose* / *The Law of Aimlessness* (Martin Luther King Jr.); LAW-14 *Resist the Downward Pull of the Group* / *The Law of Conformity* (Gao Jianhua and Cultural Revolution); LAW-15 *Make Them Want to Follow You* / *The Law of Fickleness* (Elizabeth I). Each contains 500–560 words of new original analysis plus structured interpretations, counter-explanations, risks, ethics and questions.
- Added CON-0037–0045 (9 concepts); CAS-0013–0015 (3 book-attributed cases); CLM-0027–0032 (6 claims); REF-0073–0102 (30 source references); EDG-0074–0097 (24 edges); EXR-0030–0038 (9 questions). No independent sources/findings invented. Cumulative counts: 18 laws, 45 concepts, 15 cases, 32 claims, 102 references, 97 edges, 38 exercises, 0 research findings and 373 research-ledger links.
- 3 chapter opening narrative sections researched in detail; 9/9 major headings verified in the PDF; 30 page text anchors checked. The other 6 major sections received bounded passage checks only. 0 chapters are fully reviewed. No printed-page mapping or scientific corroboration is claimed.
- Fixed inherited `LAW-14` *The Reality Group* chapter-section heading location: **zero-based PDF index 472 / viewer page 473**. Prior index 463 was a cross-reference; corrected in `research/CHAPTER_MAP.json`, coverage matrix and tests, without modifying earlier `REF` IDs.
- Implemented canonical four-level explanation filtering across Atlas and Historical Cases. Levels: `individual`, `interpersonal`, `group`, `historical_institutional`. Multiple memberships allowed, no diagnostic meaning. Linked concept→case and case→concept in both detail views. Command Center now covers Laws 1–15.

## Schema migration details

Immutable educational dataset manifest `schemaVersion` advanced from **1 to 2**. `src/domain/schemas.ts` now requires `levelsOfExplanation` arrays in ConceptRecord and HistoricalCaseRecord. All preexisting concepts/cases receive `[]` (unclassified), **not guessed classifications**. Nine new concepts and 3 new cases have carefully assigned multi-level facets. `scripts/validate-data.mjs` and tests reject absent, duplicate or unknown level values. `research/STAGE_05_SCHEMA_MIGRATION.json` documents details and rollback caveat. `research/ID_ALIASES.json` did not change; no ID recycling or user-progress migration. Source categorization remains independent of level facet.

## Actual verification matrix

| Command/check | Result | Observed output or reason |
|---|---|---|
| Restore Stage 04 ZIP, verify fingerprint | PASS | One coherent project; PDF 690 pages, identical SHA-256 |
| Baseline `npm run validate:data` | PASS | 0 errors, 6 waiting-review warnings |
| Baseline `npm run test:offline` | PASS | 41/41 tests |
| Bounded `npm install --package-lock-only` | BLOCKED | 18s timeout, npm registry unavailable, no lockfile |
| `npm ci --offline` | BLOCKED | npm EUSAGE, package-lock missing |
| `npm run typecheck` | BLOCKED | TS2688: vite/client and vitest/globals missing |
| `npm run lint` | BLOCKED | eslint executable not found |
| `npm run validate:data` | PASS | 0 errors, 3 expected awaiting-review warnings; 373 ledger links, 49 heading locators, 102 refs |
| `npm run test:offline` | PASS | **51/51** Node tests |
| `npm run test` | BLOCKED | vitest executable not found |
| `npm run build` | BLOCKED | Data validation passed, vite executable not found |
| TypeScript/CSS parse, relative imports | STATICALLY INSPECTED | 40 TS/TSX files, 118 imports, 1 CSS, no parser/missing targets |
| Compiled React browser, iPhone Safari, Pages CI and deployment | NOT RUN | No successful Vite compiled bundle |

Static inspection and 51 offline tests do not substitute for a compiled React build. **No real `package-lock.json` exists.** Do not call this production-certified.

## Stage 06 exact first actions: Laws 16–18 + synthesis

1. Extract **only** `HNI_STAGE_05_SOURCE.zip`, read this handoff, the new schema v2 migration file, the Stage 05 reading log, the corrected chapter map, coverage matrix, source ledger and existing tests; preserve all 8 modules and earlier 15 law dossiers.
2. With Node >=22.16 and a working npm registry, run genuine `npm install` to generate a lockfile, then `npm ci`, `npm run typecheck`, `npm run lint`, `npm run validate:data`, `npm run test:offline`, `npm run test`, `npm run build`. Repair genuine build/type issues; if network unavailable, limit retries, keep accurate BLOCKED status and proceed with the book.
3. Inspect the SAME matching PDF for LAW-16 *See the Hostility Behind the Friendly Façade* / *Law of Aggression*, LAW-17 *Seize the Historical Moment* / *Law of Generational Myopia*, LAW-18 *Meditate on Our Common Mortality* / *Law of Death Denial*. Verify headings, PDF page indexes and sections; never assume printed-page mapping.
4. Research questions, not prefilled facts: for Law 16, differentiate aggression, defensiveness and contextual coercion; for Law 17, test how selection effects and institutional periods complicate sweeping generational stereotypes; for Law 18, investigate existential motivation and death-awareness concepts without implying one universal behavioral response.
5. Integrate real source-linked original analysis, canonical IDs and justified cross-law synthesis. Maintain research statuses honestly and preserve schema v2 explanations, import confirmation and multi-source resolution. Do not invent history, quotes, studies, diagnoses or claim empirical validation without independent reading.
6. Output **`HNI_STAGE_06_SOURCE.zip`** with a full cumulative `hni/` root, Stage 06 reports and iPhone-friendly handoff. Do not go back to Stage 01/01B/02/03/04 or nest their ZIP archives.

## Remaining work and risks

- Genuine lockfile and all dependency-backed compilation/build/browser/Pages gates.
- Source-proven independent historical facts and psychology evidence (Stage 07).
- Exhaustive review of remaining sections in Laws 1–15, including classic conformity experiments.
- Printed PDF page correspondence, mobile Safari functional testing, accessibility/browser interaction tests.
- Never treat group-level findings as evidence about every individual in a group.

**Final source-of-truth:** `HNI_STAGE_05_SOURCE.zip`. Stage 06 must modify that cumulative project, not reconstruct it.
