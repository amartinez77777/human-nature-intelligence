# HNI STAGE 05 — RESEARCH & FEATURE AUDIT

## Source and baseline integrity

- Original prior-stage archive: `HNI_STAGE_04_SOURCE(1).zip`, SHA-256 `b7ed2ae6c597db6aed982b3b5b22a8ea74bcfbf8a68bbb563ef3fadbc7afa4f1`, one canonical `hni/` root, ZIP CRC passed.
- Attached PDF: `The Laws of Human Nature(8)(1).pdf`, SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e` (matches the original Stage 01–04 fingerprint), **690** physical pages. 2018 Viking / Penguin Random House; format-specific PDF ISBN remains unconfirmed.
- Baseline `npm run validate:data`: PASS (0 errors, 6 pending-research warnings). Baseline `npm run test:offline`: PASS (41/41).
- No prior law, claim, case, concept, source reference, edge or exercise was discarded. All 12 previously researched law objects and their earlier canonical records are preserved. The existing concept/case records receive only `levelsOfExplanation: []` as a schema v2 migration.

## Stage 05 editorial scope

| Law | Exact narrative title | PDF index inclusive | Headings checked | Substantively reviewed sections | Status |
|---|---|---|---|---|---|
| LAW-13 | Advance with a Sense of Purpose / The Law of Aimlessness | 391–428 | 3/3 | 1/3 | partially_reviewed |
| LAW-14 | Resist the Downward Pull of the Group / The Law of Conformity | 429–479 | 3/3 | 1/3 | partially_reviewed |
| LAW-15 | Make Them Want to Follow You / The Law of Fickleness | 480–517 | 3/3 | 1/3 | partially_reviewed |

The dossiers each include approximately 532, 527 and 559 words of original literary/critical editorial analysis, respectively, supplemented by mechanisms, distinctions, fictional contemporary illustrations, misconceptions, competing explanations, limitations, ethical issues, real PDF locators and explanation-bearing questions. The exact status remains partial: **9/9 section headings inspected; 3/9 section narratives given substantive review credit; 30 distinct page-level text checks**. These counts describe targeted reading, not complete word-level coverage.

Greene's principal cases are Martin Luther King Jr. (CASE CAS-0013), Gao Jianhua (CAS-0014) and Elizabeth I (CAS-0015). Each case's `documentedFacts` is empty because independent primary-history corroboration was not performed. Chronologies represent the book's narrative only. Group descriptions are not used as psychological diagnoses of individual participants.

## Integrated new data

- 9 concept records (CON-0037–0045); 3 historical cases (CAS-0013–0015); 6 Greene-attributed claims (CLM-0027–0032).
- 30 source references (REF-0073–0102), all checked against source `SRC-0001` with physical PDF zero-based locators and no guessed printed page numbering.
- 24 approved-relationship graph edges (EDG-0074–0097), including justified ties to Law 3, 6, 7, 8 and 11.
- 9 multiple-choice questions (EXR-0030–0038), each with answer rules and per-choice explanations.
- Combined: 18 laws, 45 concepts, 15 cases, 32 claims, 102 refs, 97 edges, 38 exercises, 0 independent research findings, 4 curated comparison pairs, **373** source-ledger links.

## Implemented UI

- Atlas: select/filter by individual, interpersonal, group and historical/institutional level; permits multiple memberships; unclassified earlier concepts remain visible using their own option.
- Case index: same level facet; case detail shows levels and related canonical concepts; concept detail now links directly to its canonical case records.
- Command Center: preserved earlier discoveries and added a Stage 05 source-grounded entry point, with coverage dynamically updated to Laws 1–15.
- Search: uses canonical concept/case level terms. No duplicate or parallel research dataset or runtime AI.
- Existing 4 curated comparisons, four-perspective source panels, source resolution and progress import confirmation remain intact.

## Correction and limitations

- The prior LAW-14 `The Reality Group` section in `research/CHAPTER_MAP.json` pointed at **zero-based 463**, a prior cross-reference. Its actual heading starts at **zero-based 472**, viewer page **473**; corrected in the chapter map and coverage matrix, with regression tests.
- The internal explanatory levels describe editorial analysis, not a validated scientific classification system. Individual and group explanations can operate together and are not mutually exclusive.
- No external history/experimental psychology findings were independently assessed in Stage 05. Stage 07 remains responsible for evidence appraisal; science status stays `not_assessed`.

## Source and testing integrity

- Data and research validation: PASS, 0 errors and 3 awaiting-review warnings; 373 ledger links, 49 cumulative heading anchors, 102 total refs.
- Offline Node test suite: PASS, 51/51. Static parsing: PASS as static inspection only, 40 TS/TSX files, 118 relative imports, 1 CSS stylesheet, 0 parser/missing-relative-import errors.
- Dependency-backed compilation, lint, Vitest, Vite production build, browser, Safari and Pages: NOT VERIFIED; detailed results in handoff. No genuine npm lockfile was created because registry access timed out.
