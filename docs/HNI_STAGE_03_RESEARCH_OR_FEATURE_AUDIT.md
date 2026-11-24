# HNI — STAGE 03 RESEARCH & FEATURE AUDIT

## Verified project/source continuity

The uploaded cumulative `HNI_STAGE_02_SOURCE(1).zip` was unzipped directly. It contained 87 members beneath exactly one `hni/` root; its README, handoff, `src/domain`, repository, 8 module routes, research manifest, coverage ledger, IDs and tests were inspected. The uploaded `The Laws of Human Nature(7).pdf` hashed to **e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e**, matching prior stages. Pages: 690; Viking/Penguin Random House, 2018; physical indexes are zero-based. Source format ISBN and printed page mapping remain unresolved.

Existing records LAW-01…LAW-04 and the original 12 CON, 4 CAS, 10 CLM, 22 REF, 21 EDG, 9 EXR, one SRC and one PATH retained their entire JSON object data unchanged. LAW-05–08, previously metadata-only, were enriched without changing their ID or narrative heading/subtitle. User-progress version and import/export paths unchanged.

## Four source-linked, critically qualified dossiers

| Law | PDF viewer pages (zero-based) | Historical example in Greene | Sections credited / headings checked | Editorial status |
|---|---|---|---|---|
| LAW-05 Covetousness | 149–168 (148–167) | Coco Chanel | 2/3 · 3/3 | Partially reviewed |
| LAW-06 Shortsightedness | 169–191 (168–190) | John Blunt / South Sea speculation | 2/3 · 3/3 | Partially reviewed |
| LAW-07 Defensiveness | 192–224 (191–223) | Lyndon B. Johnson, Tom Connally, Richard Russell | 1/3 · 3/3 | Partially reviewed |
| LAW-08 Self-sabotage | 225–255 (224–254) | Anton Chekhov | 1/3 · 3/3 | Partially reviewed |

`research/STAGE_03_READING_LOG.json` records direct extraction checks, section anchors, sampled pages and editorial qualifications. The author did **not** conduct an independent archival study of Chanel, Blunt, Johnson or Chekhov; their case records have `verificationStatus=secondary_source_account`, empty `documentedFacts`, and claims marked `evidenceStatus=not_assessed`. Fictional modern scenarios are labeled fictional. The work is original analytical paraphrase and does not embed the copyrighted book.

Each law dossier includes Greene's central position, historical case context, 500+ words of editorial critical analysis (approximately; separate from claims and concept records), several mechanisms, distinctions between observable action and inferred intent, patterns, misreadings, counter-interpretations, ethics, limits and at least 2 knowledge checks with choice-specific explanations. New edges include specific justified links to Laws 1–4 using only supported relationship types.

## Data changes

| Canonical entity | Prior Stage 02 | Cumulative Stage 03 | Added |
|---|---:|---:|---:|
| Laws | 18 | 18 | 4 dossiers (no new IDs) |
| Concepts | 12 | 24 | 12 |
| Historical cases | 4 | 8 | 4 |
| Attributed claims | 10 | 18 | 8 |
| Book sources | 1 | 1 | 0 |
| Source references | 22 | 46 | 24 |
| Independent science findings | 0 | 0 | 0 |
| Typed knowledge edges | 21 | 45 | 24 |
| Multiple-choice exercises | 9 | 17 | 8 |
| Learning paths | 1 | 1 | 0 |
| Versioned comparisons | 0 | 4 | 4 |

`COVERAGE_MATRIX.json`, `SOURCE_LEDGER.json`, `PDF_SOURCE_MANIFEST.json`, `STAGE_03_READING_LOG.json` updated. `CHAPTER_MAP.json` and `ID_ALIASES.json` unchanged. Source-ledger links now total **136**. Research validator checks **26** direct heading positions across Laws 1–8, 46 source locators and the Stage 03 chapter page bounds. Editor-reviewed sections across Laws 1–8: **13/26**. No laws promoted to `fully_reviewed`.

## App integration and remaining limitations

The existing Laws Library, Behavior Atlas, Historical Cases, Knowledge Network, Command Center, Evidence, Academy, Search, Settings and source detail routes remain. The homepage coverage reads the canonical matrix for Laws 1–8. Law detail pages show coverage, source references, explanations, exercises and related records. Search indexes the new mechanisms and differentiations but keeps short result descriptions. `/atlas/compare` adds a curated, source-grounded comparison route without making another module or user-data schema.

**Tests:** offline `validate:data` PASS, 0 errors and 10 awaiting-review warnings; `test:offline` PASS, 32/32. TSX/CSS parsers and imports PASS as static analysis only. No genuine npm lockfile. Typecheck, lint, Vitest, build, compiled browser and Safari tests remain blocked/not run. Details in `HNI_STAGE_03_HANDOFF.md`.

## Editorial debt

- Remaining substantive sections: Law 5 *The Supreme Desire*; Law 6 *The Farsighted Human*; Law 7 *Five Strategies for Becoming a Master Persuader*, *The Flexible Mind—Self-strategies*; Law 8 *The Constricted (Negative) Attitude*, *The Expansive (Positive) Attitude*. They have identifiable headings and sampled page references but are **not credited as fully reviewed**.
- Reconcile the rest of Laws 1–4 for eventual full review; preserve previous statuses.
- Independently check historical claims using primary scholarship; empirical findings and uncertainty assessment belong in Stage 07, not fabricated here.
- Resolve npm registry / lockfile, compiler, browser and mobile verification gates before deploying.
