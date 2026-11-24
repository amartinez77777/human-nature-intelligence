# HUMAN NATURE INTELLIGENCE — STAGE 07 HANDOFF TO STAGE 08

**Authoritative cumulative source:** `HNI_STAGE_07_SOURCE.zip` (one `hni/` root), application **v0.7.0**. **Immutable dataset schema remains v2; user-progress schema remains v1**. Research integrity is verified offline; npm-backed production compilation remains **BLOCKED**.

## Mandatory next-stage attachments

1. `HNI_STAGE_07_SOURCE.zip`, not any earlier stage.
2. This Stage 07 handoff in Markdown or iPhone-readable TXT.
3. Same complete 690-page *The Laws of Human Nature* PDF; SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`.

## Source continuity

Stage 06 source was extracted from actual uploaded `HNI_STAGE_06_SOURCE(1).zip`, SHA-256 `af2e200aaff494bc579d6704ffe54bde0f71fbeab3735ec769aafdebc12ec43a`. Exact original `hni/` code and immutable educational research were retained. PDF title/author verified; 2018 Viking imprint. The PDF does not establish a single format-specific ISBN. `SRC-0001` book locators remain **zero-based**; viewer page=index+1, printed page not mapped. External source locators have **null PDF page indexes**, not guessed book pages.

## Implemented in Stage 07

- Added 11 external source records `SRC-0002`–`SRC-0012`, 11 external references `REF-0133`–`REF-0143` and 6 research findings `RES-0001`–`RES-0006`. Source records link directly to institutional or journal/publisher URLs and distinguish accessible abstracts from complete-text assessments.
- Six specifically scoped evidence assessments: `CLM-0006` nonverbal deception cues (limited), `CLM-0007` situation-dependent behavioral patterns (mixed), `CLM-0016` autonomy/reactance (limited), `CLM-0025` gender roles/psychological similarity (mixed), `CLM-0036` cohort/age/period confounding (limited), and `CLM-0038` mortality awareness (limited). None assert that all of Greene's prescriptions have been experimentally proved.
- Historical review of `CAS-0001` (Pericles), `CAS-0013` (Martin Luther King Jr.), `CAS-0015` (Elizabeth I), `CAS-0016` (Rockefeller and Clark), `CAS-0018` (Flannery O'Connor). Added only specific corroborated chronology. Their overall verificationStatus remains `secondary_source_account`, because Greene's private-motive interpretations were not independently established.
- Expanded Science, Evidence & Criticism with claim search and filters by law, evidence status and source category; claim detail with methods, limitations, distinct reference lists; independent `RES` finding detail route and a methodology page. Historical case detail now distinguishes independent chronology and book reference panels.
- Integrated 11 external references into SOURCE_LEDGER (total 522). Updated machine-readable 14-question Stage 07 backlog to distinguish 6 partially investigated claims from 8 still unassessed. Repaired ledger validator to allow null external PDF viewer-page locators, preserving the SRC-0001-specific 690-page bound.
- Added regression tests covering source-resolution, six claim-linked findings, five historical cases, backlog, no automatic evidence upgrade, source-aware UI and preservation of user progress.

## Verification matrix

| Gate | Status | Actual observation |
|---|---|---|
| Stage 06 ZIP baseline restore | PASS | Source extracted from exact uploaded archive, single hni/ root |
| Matching PDF SHA-256 | PASS | e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e; 690 pages |
| Baseline npm run validate:data | PASS | 0 errors, 0 warnings |
| Baseline npm run test:offline | PASS | 62/62 tests |
| npm install --package-lock-only | BLOCKED | One 14-second bounded registry attempt timed out; no lockfile created |
| npm ci | BLOCKED | No genuine package-lock.json, registry inaccessible |
| Final npm run validate:data | PASS | 0 dataset errors; 522 ledger links; 143 references; 60 verified section headings |
| Final npm run test:offline | PASS | 70/70 Node tests |
| npm run typecheck | BLOCKED | TS2688; missing vite/client and vitest/globals |
| npm run lint | BLOCKED | eslint: not found |
| npm run test | BLOCKED | vitest: not found |
| npm run build | BLOCKED | vite: not found after successful data checks |
| Actual browser / mobile Safari | NOT RUN | No built React bundle or Safari environment |
| GitHub Pages deployment | NOT RUN | Not requested and no verified install/build |


**Crucial:** Source/data validation and 70 offline tests do **not** prove the React app compiles or runs in Safari. No genuine `package-lock.json` was created; do not invent one.

## Research caveats

- DePaulo deception-cue meta-analysis: abstract inspected; individual gesture reading cannot reliably establish private intent. Separate claims about visible emotion and deliberate lies.
- Mischel/Shoda/Mendoza-Denton: APS abstract inspected; context-dependent `if…then…` patterns qualify unchanging-character accounts.
- Rains reactance and Pyszczynski/Solomon/Greenberg mortality review: publisher records/abstracts accessible, full-text methodology not checked. Their findings remain `limited` in this dataset.
- Hyde gender synthesis: institutional scholarly summary inspected; do not infer universal sex/gender psychological traits or clinical diagnoses.
- National Academies generation-review chapter substantially accessible; age/period/cohort identification complicates cohort stereotypes.
- Historical sources corroborate enumerated facts only. For example Stanford's Montgomery account also credits earlier Women’s Political Council organizing; Rockefeller Archive Center corroborates the partnership but not hidden hostility. Never represent these as proven private motives.

## Protected contracts

- 8 permanent modules, all 18 law IDs, canonical IDs and research records preserved; no aliases added or IDs recycled.
- `src/domain/schemas.ts` unchanged: dataset schema v2, explanation levels and provenance/evidence/coverage independent; user progress `hni.user-progress.v1` unchanged.
- Affirmative confirmation before user-data import; transactional storage, corrupt-state protection, export/import, multi-source `REF → SRC` lookup, source-aware labels, comparison UI, explanation-level filters, research-perspectives and other existing routes preserved.
- All 18 chapters still `partially_reviewed`; 23/60 main subsections substantively reviewed; no new printed-page mapping.

## Stage 08 exact starting point

1. Extract the **actual Stage 07 ZIP** and inspect this handoff and all 8 modules; never restart from Stage 06 or earlier.
2. On Node >=22.16 with npm access, generate a genuine `package-lock.json` using npm install, then run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run validate:data`, `npm run test:offline`, `npm run test`, `npm run build`. Fix real compiler errors without weakening schemas.
3. Build **functional interactive knowledge network and educational discovery**, using the existing 127 canonical edges and new claim/finding/source entities, preserving real provenance. Stage 08 owns advanced graph visualization, not fabricated graph density. Include focus/keyboard navigation and mobile behavior.
4. Reassess the 6 evidence summaries with full papers/replication reviews if available, and complete 8 remaining backlog items as resources permit. Do not inflate scientific certainty or history statuses.
5. Keep all canonical IDs, references, source-aware display, user-progress protection, 8 modules and versioned data schema. Add migrations only when justified and tested.
6. Ship full **`HNI_STAGE_08_SOURCE.zip`**, handoff and verification results. Include an iPhone-readable TXT version of handoff.

**Do not silently claim that all 14 Stage 07 backlog questions were independently resolved.**
