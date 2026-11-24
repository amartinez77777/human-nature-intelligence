# HNI Stage 04 — exact handoff to Stage 05

**Current cumulative source:** `HNI_STAGE_04_SOURCE.zip` · complete `hni/` root, one project only.  **Version:** `0.4.0`.  **Result:** source-grounded research and offline tests passed; dependency-backed React production build **BLOCKED / UNVERIFIED**.

## Mandatory next-stage inputs

Attach `HNI_STAGE_04_SOURCE.zip`, this `HNI_STAGE_04_HANDOFF.md` (or its downloadable TXT copy), and the same complete 690-page Robert Greene PDF. **Do not restart from Stages 01–03.** Matching source fingerprint SHA-256: `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`. The PDF is Viking / Penguin Random House, copyright 2018; the copyright page lists hardcover, ebook, international ISBNs but the uploaded PDF does not unambiguously establish a format-specific ISBN. Printed-page mapping is unverified; every `pdfPageIndex` is zero-based and viewer page = index + 1 for SRC-0001.

## Exact preflight and preserved contracts

The uploaded `HNI_STAGE_03_SOURCE(1).zip` was extracted and CRC tested (101 members, single `hni/` root). Its Stage 03 handoff, package manifest, schemas, validators, canonical repository, coverage, source ledger, GitHub workflow, tests, router and progress-import services were inspected before changes. All eight module routes remain present, as does `/atlas/compare` (four existing pairs). The Stage 01B optional progress storage (`hni.user-progress.v1`), import confirmation, transactional write, corrupt-data safeguards and REF→SRC multi-source resolution were not altered.

The **first eight LawRecord objects and every preexisting canonical data record are unchanged** when compared structurally with Stage 03's source ZIP. Stable LAW-01–LAW-18 preserved; newly assigned IDs append to existing series without recycling. Canonical dataset schema is still v1; personal-progress schema is still v1; comparison dataset is still v1. **No schema migration and no user-data migration.** `research/ID_ALIASES.json` unchanged.

## Stage 04 research integrated

- LAW-09 — *Confront Your Dark Side* / *The Law of Repression*: Richard Nixon, Jungian Shadow interpretation, distinction between self-concept and actual behavior. New `CAS-0009`, CON-0025–0027, CLM-0019–0020.
- LAW-10 — *Beware the Fragile Ego* / *The Law of Envy*: Mary Shelley and Jane Williams in Greene's account, envy vs jealousy/admirative comparison/legitimate resentment. New `CAS-0010`, CON-0028–0030, CLM-0021–0022.
- LAW-11 — *Know Your Limits* / *The Law of Grandiosity*: Michael Eisner, confidence vs overconfidence, self-attribution and accountable ambition. New `CAS-0011`, CON-0031–0033, CLM-0023–0024.
- LAW-12 — *Reconnect to the Masculine or Feminine Within You* / *The Law of Gender Rigidity*: Caterina Sforza; Greene/Jung gender terminology is critically contextualized rather than presented as innate universal facts. New `CAS-0012`, CON-0034–0036, CLM-0025–0026.

All four new laws remain `partially_reviewed`. Stage 04 verified **14/14 section heading locations** and inspected **26 individual PDF page text locations** as logged in `research/STAGE_04_READING_LOG.json`. Only **4/14 opening historical/narrative sections** are credited as substantively reviewed; the remaining 10 major sections were spot-checked, **not exhaustively read**. This is honest section accounting, not a percent of all chapter words. Laws 1–8 remain `partially_reviewed`, Laws 13–18 `awaiting_review`; 0 chapters marked fully reviewed.

**Material metadata correction:** `LAW-11` *Practical Grandiosity* heading begins at **viewer page 348 / zero-based index 347**, not the inherited erroneous index 336, which is a cross-reference. Corrected in `research/CHAPTER_MAP.json` and `research/COVERAGE_MATRIX.json`, with a regression test. No printed page numbers were added.

**Added** 12 concepts, 4 Greene-attributed historical cases, 8 author claims, 26 directly located book references, 28 typed research edges, 12 answer-explained multiple choice questions. Cumulative counts: 18 laws, 36 concepts, 12 cases, 26 claims, 1 source, 72 references, 0 independently evaluated findings, 73 graph edges, 29 exercises, 1 learning path, 4 concept comparisons, 238 source-ledger links. All 4 cases have `verificationStatus=secondary_source_account`, `documentedFacts=[]`, competing explanations and limitations. All 8 new author claims have `evidenceStatus=not_assessed`. The Stage 07 scientific evidence review **has not** been performed. No fabricated sources, DOI, historical motive certifications, diagnoses or quotations.

## UI and data integration

New reusable four-perspective component `src/components/shared/ResearchPerspectives.tsx` is present on Law detail, Concept detail and Historical Case detail: **(1) Greene's attributed claim, (2) competing explanations, (3) genuinely linked independently assessed evidence or 'Not independently assessed', (4) limits of inference**. It consumes canonical claims, concepts, cases and findings, and links to `/evidence/:id`. Non-breaking responsive 2-column desktop / 1-column mobile CSS added. Read-only `src/services/perspective-model.ts` provides deterministic evidence-link resolution and explicit missing-claim handling. `src/services/coverage.ts` and Command Center now display Laws 1–12 coverage. No runtime AI or server dependency.

## Tests actually run

| Check | Status | Observed result |
|---|---|---|
| Baseline `npm run validate:data` | **PASS** | 0 errors, 10 expected awaiting-review warnings before Stage 04 integration |
| Baseline `npm run test:offline` | **PASS** | 32/32 tests |
| PDF SHA-256 and 690-page count | **PASS** | e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e |
| Bounded `npm install --package-lock-only` | **BLOCKED** | 18-second timeout; npm registry was unreachable, no real lockfile created |
| `npm ci --offline` | **BLOCKED** | EUSAGE: no package-lock.json |
| `npm run typecheck` | **BLOCKED** | TS2688: cannot locate vite/client and vitest/globals types |
| `npm run lint` | **BLOCKED** | eslint binary not installed |
| `npm run test` | **BLOCKED** | vitest binary not installed |
| `npm run build` | **BLOCKED** | research/data validation passed; vite binary not installed |
| Final `npm run validate:data` | **PASS** | 0 errors; 6 expected awaiting-review warnings; 238 ledger links, 40 headings, 72 references; 4 comparisons |
| Final `npm run test:offline` | **PASS** | 41/41 Node tests |
| Global TypeScript parse + relative imports + PostCSS parse | **STATICALLY INSPECTED** | 41 TS/TSX, 114 relative imports, 362 CSS top-level rules; 0 parse or missing-import errors |
| Compiled browser / mobile width tests / iPhone Safari | **NOT RUN** | No compiled Vite build |
| GitHub Actions / GitHub Pages deployment | **NOT RUN** | No lockfile or published deployment |

**Important:** The source is **not** production-build verified. No genuine `package-lock.json` was generated; it must not be synthesized. Test:offline does not replace Vitest, TS type checking, or a browser test. `npm ci` and GitHub Pages CI remain blocked until a real npm registry environment produces and commits the lockfile.

## Next Stage 05 — Laws 13–15

1. Restore this exact Stage 04 ZIP and read this handoff, the corrected PDF chapter map, research reading logs and all canonical schemas; verify full source integrity and 8 modules.
2. In Node >=22.16 with reachable npm registry, `npm install` to create a genuine lockfile, then `npm ci`, `npm run typecheck`, `npm run lint`, `npm run validate:data`, `npm run test:offline`, `npm run test`, and `npm run build`, fixing real compiler issues. One bounded diagnostic attempt only if offline; never claim unavailable checks passed.
3. Deep-read the **actual same PDF** for Laws **13 (Aimlessness), 14 (Conformity), 15 (Fickleness)**, including chapter boundaries, all major sections, historical narrative, interpretation, and fair alternatives. Preserve narrative title separate from law subtitle.
4. Append sourced concepts, claims, cases, exercises and justified edges; respect `CON/CAS/CLM/REF/EDG/EXR` appended sequences. Keep 01–12 source records, edited comparisons, user data safety and the new multi-perspective view. Continue to distinguish historical fact from Greene's interpretation and scientific research.
5. Resolve technical blockers as feasible, test links, and ship one cumulative `HNI_STAGE_05_SOURCE.zip` plus its own handoff and audits. Do not nest this ZIP or include copyrighted PDF.

**Outstanding:** printed-page mapping, independent historical checks, empirical evidence synthesis (Stage 07), exhaustive reading of Laws 1–12, reproducible npm install / Vite build, real desktop and iPhone Safari testing, actual GitHub Pages deployment.
