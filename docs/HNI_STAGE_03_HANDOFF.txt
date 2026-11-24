# HUMAN NATURE INTELLIGENCE — STAGE 03 HANDOFF TO STAGE 04

**Current cumulative source:** `HNI_STAGE_03_SOURCE.zip` (only valid source of truth for Stage 04)  
**Previous cumulative source:** `HNI_STAGE_02_SOURCE(1).zip` (the actual upload, checked: 87 members, ZIP CRC PASS)  
**Version:** HNI `0.3.0`; immutable research dataset schema `1`; new separately versioned concept comparison dataset `1`; personal progress schema `1`.  
**Build truth:** Research/data and offline checks PASS. **npm dependencies, TypeScript typecheck, lint, Vitest, Vite production build, browser, iPhone Safari and deployment remain UNVERIFIED/BLOCKED.**

## 1. Mandatory input for Stage 04

Attach all three:
1. **`HNI_STAGE_03_SOURCE.zip`**, NOT the Stage 02 or Stage 01B ZIP.
2. **`HNI_STAGE_03_HANDOFF.md`** (or enclosed `.txt` copy).
3. The SAME complete readable PDF of Robert Greene's *The Laws of Human Nature*, whose SHA-256 **`e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`** matched this stage's upload exactly. 690 physical pages; Viking / Penguin Random House, copyright 2018. The PDF's precise edition-format ISBN remains unspecified; printed-page correspondence unverified.

## 2. Actual implementation changes

Preserved the cumulative React 18, strict TypeScript, Vite, HashRouter, Zod, Vitest architecture and all **8 permanent module routes**. Expanded existing canonical JSON and source-aware UI rather than rebuilding anything.

**Added researched LAW-05–LAW-08 (all `partially_reviewed`):**
- LAW-05 *Become an Elusive Object of Desire* / *The Law of Covetousness*; Greene's Coco Chanel narrative; desire, need, scarcity and symbolic valuation.
- LAW-06 *Elevate Your Perspective* / *The Law of Shortsightedness*; John Blunt and South Sea speculation; decision horizon, recent-event salience, scenario planning.
- LAW-07 *Soften People’s Resistance by Confirming Their Self-opinion* / *The Law of Defensiveness*; Lyndon B. Johnson and senior senators; identity threat, voluntary persuasion vs coercion.
- LAW-08 *Change Your Circumstances by Changing Your Attitude* / *The Law of Self-sabotage*; Anton Chekhov; expectation feedback, interpretive orientation and structural constraints.

Each dossier contains a ~500–600-word original critical interpretation (separate from the central argument), mechanisms, distinctions, observed vs inferred behavior, alternative accounts, ethical caution, explicit limitations, source locators and 2 explanation-bearing multiple-choice questions. Four cases are **secondary book-sourced accounts**, not independently verified biographical/historical findings. No source quotation was invented, no external paper invented and no book chapters reproduced.

**Versioned curated comparison UI:** `/atlas/compare` (linked from `/atlas` and the Command Center). The 4 curated pairs in `src/data/concept-comparisons.json` (`schemaVersion:1`) are CMP-0001 desire/need, CMP-0002 persuasion/coercion, CMP-0003 immediate rewards/decision horizon, CMP-0004 interpretive attitude/external circumstance. The component links to real concept, law, source-reference and source pages; invalid endpoints produce an honest empty state. Both Zod and an independent validator guard the records. The new read-only comparison dataset does **not** modify local user progress schema or import/export behavior.

**Cumulative canonical counts:** 18 laws; 24 concepts; 8 historical cases; 18 Greene-attributed claims; 1 source; 46 references; 0 independently vetted research findings; 45 typed graph edges; 17 explanatory exercises; 1 learning path; 4 versioned comparisons. LAW-01–04 and all Stage 02 prior concept/case/claim/reference/edge/exercise records were **byte-equivalent as parsed JSON objects**. Only LAW-05–08 (formerly metadata-only) were modified in the old records.

## 3. PDF structure and honest coverage

- LAW-05: PDF viewer pages **149–168** (zero-based 148–167); 3/3 major headings checked, 2/3 sections credited for substantive research review.
- LAW-06: pages **169–191** (indices 168–190); 3/3 checked, 2/3 credited.
- LAW-07: pages **192–224** (indices 191–223); 3/3 checked, 1/3 credited.
- LAW-08: pages **225–255** (indices 224–254); 3/3 checked, 1/3 credited.
- Across Laws 5–8: **12/12 major section headings anchored, 6/12 sections credited**; this is section-accounting, not a claim that 50% of all PDF words were exhaustively examined.
- Across Laws 1–8: 26/26 major headings checked; 13/26 sections credited; 0 chapters certified `fully_reviewed`. Laws 9–18 remain `awaiting_review`.
- `research/STAGE_03_READING_LOG.json` contains precise page checks and review qualifications; `COVERAGE_MATRIX.json`, `SOURCE_LEDGER.json` (now 136 entries), and `PDF_SOURCE_MANIFEST.json` updated. `CHAPTER_MAP.json` unchanged. No printed-page numbers guessed.

## 4. Canonical IDs, schemas, protected features

Stable LAW-01…LAW-18 and existing CON/CAS/CLM/SRC/REF/RES/EDG/EXR/PATH identifiers preserved. New IDs append from CON-0013, CAS-0005, CLM-0011, REF-0023, EDG-0022 and EXR-0010; CMP-0001–0004 are a new versioned collection. `research/ID_ALIASES.json` remains schema v1 with no aliases/migrations. Relationship enums remain unchanged and valid; new edges use only approved types. Source routes resolve reference→source through the original services, never a hardcoded SRC.

Do not replace Stage 01B's verified source-aware metadata, user progress import confirmation, storage-failure semantics, corrupt-data preservation, one-way versioned JSON backup, local-first storage or HashRouter. No user-progress migration performed; personal schema version remains 1 and browser key `hni.user-progress.v1`. Zero new scientific findings were introduced because empirical validation is reserved for Stage 07.

## 5. Exact checks actually run

| Check | Status | Actual result |
|---|---|---|
| ZIP restore, 87 baseline members, CRC | PASS | One `hni/` root; no archive errors |
| PDF SHA-256 and page count | PASS | Matches the Stage 01B/02 fingerprint exactly; 690 pages |
| `npm run validate:data` | PASS | 0 errors, 10 research-pending warnings, 136 consistent ledger links, 26 verified heading locators, 4 valid comparisons |
| `npm run test:offline` | PASS | **32/32** Node offline tests, including comparison-invalid fixtures and import/source regressions |
| TypeScript syntax + relative imports | STATICALLY INSPECTED | 39 TS/TSX files, 0 parser errors; 107 relative imports resolved |
| CSS static parse | STATICALLY INSPECTED | 343 stylesheet rules, 0 top-level parser errors |
| `npm install --package-lock-only` | BLOCKED | One bounded 27 s attempt timed out, no lockfile created |
| `npm ci --offline` | BLOCKED | EUSAGE: missing real package-lock.json |
| `npm run typecheck` | BLOCKED | TS2688: missing vite/client and vitest/globals types |
| `npm run lint` | BLOCKED | ESLint binary absent |
| `npm run test` | BLOCKED | Vitest binary absent |
| `npm run build` | BLOCKED | Data validation passed; Vite executable absent |
| Compiled browser, real iPhone Safari, Pages CI, deployment | NOT RUN | Build/runtime prerequisites absent |

Static parsing **does not prove type safety or application runtime correctness**. `hni/package-lock.json` is absent. The existing GitHub Actions workflow intentionally fails without a real committed lockfile. Do not falsely call this release production verified.

## 6. Stage 04 first actions: Laws 9–12

1. Extract **only** `HNI_STAGE_03_SOURCE.zip` with exactly one `hni/` root; read this handoff, all canonical schemas, comparison contracts, source manifest, chapter map, research coverage, and current tests.
2. Using Node >=22.16.0 and working npm registry, run **genuine** `npm install` to generate package-lock.json, commit it, then `npm ci`, typecheck, lint, `validate:data`, `test:offline`, Vitest and build. Fix actual errors. If offline, one bounded attempt, then proceed with research and label build blocked.
3. Verify the matching PDF fingerprint again. Deep-read **LAW-09 Repression, LAW-10 Envy, LAW-11 Grandiosity, LAW-12 Gender Rigidity** from real pages and preserve narrative chapter titles vs law subtitles.
4. Extend existing laws, concepts, cases, claims, references, knowledge edges and exercises. Preserve IDs and previous eight dossiers; cite real chapter/section zero-based PDF locators and avoid invented empirical validation. Treat historically contingent/gendered claims critically.
5. Keep `/atlas/compare` consuming the same canonical concepts. Add a pair only with substantive editorial justification and versioned comparison dataset validation; do not invent free-form generated pair summaries.
6. Preserve prior fixes, validate all routes/source links, tests, provenance, and user-data import safety. Package **`HNI_STAGE_04_SOURCE.zip`**, Stage 04 reports, the current handoff and TXT copy; never nest earlier releases or the copyrighted PDF.

**Release conclusion:** Stage 03 educational integration and offline checks PASSED; full application build and live navigation remain BLOCKED/UNVERIFIED. This ZIP is the authoritative cumulative source for the next stage, not a deployed application.
