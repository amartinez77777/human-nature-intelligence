# HNI Stage 06 — exact handoff to Stage 07

**Authoritative cumulative source:** `HNI_STAGE_06_SOURCE.zip` (one `hni/` root). **Application version:** `0.6.0`. **Immutable educational dataset schema:** v2; **local user progress schema:** v1. **Status:** source/data and offline tests PASS, React dependency-backed production build BLOCKED/UNVERIFIED.

## Required next-stage inputs

Attach this complete cumulative Stage 06 ZIP, this Markdown file (or iPhone-readable TXT), and the same 690-page PDF of *The Laws of Human Nature* by Robert Greene. Never restart from Stages 01–05 or reconstruct source from messages. Actual PDF SHA-256: `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`. The PDF matches the prior manifest exactly. Viking / Penguin Random House, 2018 copyright; the attached PDF does not itself unequivocally identify the format-specific edition. `pdfPageIndex` is zero-based, viewer page = index + 1 for SRC-0001, printed-page mapping remains unverified.

**Exact previous source used:** uploaded `HNI_STAGE_05_SOURCE(1).zip`, SHA-256 `7dd51ae5ba11060a808320a59445cbd83239f7a44346df5e0db8cda53ff75b40`; extracted from its single canonical `hni/` tree. Embedded Stage 05 docs and separate `HNI_STAGE_05_HANDOFF(1).txt` were inspected. The Stage 05 project was preserved, not re-created.

## What was implemented in Stage 06

- Expanded `LAW-16` (*See the Hostility Behind the Friendly Façade* / *The Law of Aggression*), `LAW-17` (*Seize the Historical Moment* / *The Law of Generational Myopia*), and `LAW-18` (*Meditate on Our Common Mortality* / *The Law of Death Denial*) with 523, 561 and 557 words of original central narrative explanation respectively, plus structured mechanisms, distinctions, fictional applications, historical contexts, limitations, ethics and comprehension questions.
- Added 9 canonical concepts `CON-0046`–`CON-0054`, 3 book-attributed cases `CAS-0016`–`CAS-0018`, 6 Greene-attributed claims `CLM-0033`–`CLM-0038`, 30 directly checked PDF references `REF-0103`–`REF-0132`, 30 explained edges `EDG-0098`–`EDG-0127`, and 9 exercises `EXR-0039`–`EXR-0047`. No new research findings or outside source records were fabricated.
- Historical case files: Rockefeller/Maurice Clark; Louis XVI/Georges Danton; Flannery O’Connor. All have `secondary_source_account`, empty `documentedFacts` until independent verification, alternative historical contexts and explicit inference limitations.
- Verified 11 major section-heading starts and 30 actual PDF text page anchors for Laws 16–18 (`research/STAGE_06_READING_LOG.json`). **Corrected inherited index `Controlled Aggression` from 546 to 560 (viewer 561), and `Generational Patterns` from 590 to 595 (viewer 596).** Earlier values were mentions, not the section headings.
- Created a detailed canonical 18-law audit `research/STAGE_06_FULL_BOOK_AUDIT.json`, a 14-item claim-linked independent research queue `research/STAGE_07_EVIDENCE_BACKLOG.json`, and 4 read-only synthesis lanes in the existing Knowledge Network. Updated Command Center coverage to all 18 laws. No parallel app, no new backend or AI inference.

## Conservation and migrations

All existing Stage 05 IDs remain and prior records remain intact. No aliases added, no duplicate concept names, no deleted laws, no schema migration in this stage. `src/data/dataset-manifest.json` retains schema v2; previous level-of-explanation facets remain, and `hni.user-progress.v1` preserves import confirmation, transactional storage writes, corrupt backup handling and export/import. Multi-source REF→SRC routing, source-aware metadata and all 8 permanent modules retained. Existing four curated concept comparisons retained.

## Actual chapter coverage, not inflated

All 18 laws are **partially_reviewed**, none **fully_reviewed**. Across the cumulative 60 major sections, 23 are credited substantively reviewed, 37 remain not exhaustively reviewed. For Laws 16–18, 3 opening narratives receive substantive review credit, 8 additional major sections are verified and sampled (not exhaustively certified). All 60 heading locators are verified across earlier stages and this stage. Scientific evidence remains `not_assessed` for all newly added claims, 0 `RES` findings. No independent historical archives or peer-reviewed psychology studies were evaluated in Stage 06. This is substantial attributed ingestion, **not** complete 18-law research or scientific validation.

## Verification actually executed

| Gate | Status | Observed |
|---|---|---|
| Baseline `npm run validate:data` | PASS | 0 errors, 3 expected awaiting-review warnings |
| Baseline `npm run test:offline` | PASS | 51/51 |
| Same PDF SHA-256 / 690 pages | PASS | `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e` |
| Bounded `npm install --package-lock-only ...` | BLOCKED | Timed out after 15 seconds; npm registry unreachable; no lockfile generated |
| `npm ci --offline` | BLOCKED | EUSAGE: package-lock missing |
| `npm run typecheck` | BLOCKED | TS2688: `vite/client`, `vitest/globals` unavailable |
| `npm run lint` | BLOCKED | ESLint executable unavailable |
| `npm run test` | BLOCKED | Vitest executable unavailable |
| `npm run build` | BLOCKED | Research checks passed; Vite executable unavailable |
| Final `npm run validate:data` | PASS | 0 errors, 0 research warnings; 511 ledger links; 60 headings, 132 references |
| Final `npm run test:offline` | PASS | 62/62 Node tests |
| Static source parse, import-resolution and CSS parse | STATICALLY INSPECTED | 42 TS/TSX and TS files; 124 relative imports; 1 CSS; 0 syntax/import/CSS parse errors |
| Actual React browser, iPhone Safari, CI and GitHub Pages deploy | NOT RUN | No successfully installed dependencies / compiled Vite bundle |

`npm ci`/TypeScript/ESLint/Vitest/Vite/browser/Pages are not verified just because offline tests passed. The GitHub workflow still intentionally blocks without a genuine committed lockfile. Never manufacture one.

## Stage 07 must begin here

1. Restore `HNI_STAGE_06_SOURCE.zip` and read Stage 06 manifests, handoff, the canonical schemas v2, book map, coverage matrix, reference ledger, `STAGE_06_FULL_BOOK_AUDIT.json` and `STAGE_07_EVIDENCE_BACKLOG.json`.
2. Where Node >=22.16 and npm registry are available, perform a **real** `npm install` to generate and commit `package-lock.json`, `npm ci`, typecheck, lint, validate:data, test:offline, test and build. Repair actual code failures; report every gate separately. Do not retry endlessly in a blocked environment.
3. Begin independent **historical and scientific verification** for the 14 queued `EVQ-...` questions tied to actual `CLM`, `REF` and `LAW` IDs. Inspect exact sources before adding any `SRC`, `REF`, `RES` and evidence status changes. Separate author attribution, historical accuracy, operational scientific evidence and editorial coverage.
4. Preserve 18 law routes, old research, user data, four-level concept/case filters, four-perspective analysis, concept comparison and source-aware labels. Do not mark a chapter fully reviewed simply because it renders.
5. Ship a cumulative **`HNI_STAGE_07_SOURCE.zip`** with one `hni/` tree, a readable handoff and honest verification report; no nested old ZIPs, PDF or caches.

**Unresolved:** source-independent historical and scientific audit, 37 remaining sections for substantive review, printed-page mapping, npm lockfile and actual dependency-backed compilation, browser/iPhone Safari and production deployment.
