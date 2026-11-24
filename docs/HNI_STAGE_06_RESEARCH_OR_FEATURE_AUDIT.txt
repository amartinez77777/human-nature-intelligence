# HNI Stage 06 — research and feature audit

## Source and baseline

Source of truth: user-uploaded `HNI_STAGE_05_SOURCE(1).zip` (SHA-256 `7dd51ae5ba11060a808320a59445cbd83239f7a44346df5e0db8cda53ff75b40`); its project was extracted and inspected. Matching primary PDF: SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`, 690 physical pages, Viking / Penguin Random House copyright 2018. Book quotes were not embedded. The page convention is physical zero-based; printed pagination is unknown.

## New chapter dossiers and attribution

| Law | Narrative chapter title | Law subtitle | Opening historical account in Greene | Editorial word count | Status |
|---|---|---|---|---:|---|
| LAW-16 | See the Hostility Behind the Friendly Façade | The Law of Aggression | John D. Rockefeller and Maurice B. Clark | 523 | Partially reviewed |
| LAW-17 | Seize the Historical Moment | The Law of Generational Myopia | Georges Danton and Louis XVI | 561 | Partially reviewed |
| LAW-18 | Meditate on Our Common Mortality | The Law of Death Denial | Flannery O’Connor | 557 | Partially reviewed |

Each dossier contains Greene attribution, mechanisms, behavioral observables versus inferred motives, distinctions, a clearly fictional illustration, alternative explanations, ethical limits, source references and three explained test questions. Rockefeller’s tactics are not a universal aggression test; generational assertions are not individual stereotypes; mortality reflection is not a medical or psychological treatment.

## Canonical research expansion

| Entity | Before | After | Added identifiers |
|---|---:|---:|---|
| Laws | 18 | 18 | Expanded LAW-16–18 |
| Concepts | 45 | 54 | CON-0046–0054 |
| Historical cases | 15 | 18 | CAS-0016–0018 |
| Greene-attributed claims | 32 | 38 | CLM-0033–0038 |
| Sources | 1 | 1 | No invented independent references |
| Source references | 102 | 132 | REF-0103–0132 |
| Research findings | 0 | 0 | No scientific validation falsely claimed |
| Typed relationships | 97 | 127 | EDG-0098–0127 |
| Exercises | 38 | 47 | EXR-0039–0047 |
| Ledger links | 373 | 511 | 138 new traceable links |

## Research pipeline

The 11 main headings of Laws 16–18 were found on the actual PDF pages, and 30 page anchors were checked for available text. `Controlled Aggression` starts at physical index **560** (viewer 561), not the inherited index 546; `Generational Patterns` starts at index **595** (viewer 596), not the inherited 590. Both corrections are in the chapter map, coverage and regression tests. Each newly attributed claim links to `SRC-0001` via actual `REF` IDs; the book attribution is directly inspected, but its historical narrative and psychological truth are not independently certified.

## Synthesis, ontology and UI

- Four curated thematic lanes in the existing Knowledge Network use the canonical law records and existing typed relationships; all 18 laws appear in those lanes exactly once.
- Existing law→concept→case→source and evidence/uncertainty paths remain intact. No advanced graph renderer was introduced (Stage 08).
- Newly classified concepts and cases use the existing four-level explanation taxonomy; prior legacy records remain unchanged. No schema migration and no new aliases.
- Audited 54 canonical concept names; zero exact normalized-name duplicates. Similar but distinguishable concepts were deliberately *not* merged.
- All 18 law routes exist, with critical content and honest partial coverage. The Command Center uses the canonical 18-law coverage matrix and real bookmarks.

## Intellectual and ethical review

For LAW-16, aggression, intimidation and ethical assertiveness are differentiated. For LAW-17, age, period and cohort effects are separated and institutional alternatives are provided. For LAW-18, grief, anxiety, cultural variation and medical/support boundaries are included. New historical files explicitly classify `secondary_source_account` with no claimed independently documented facts. New claims have `evidenceStatus=not_assessed` and zero findings.

## Coverage and limits

All 18 chapters remain **partially reviewed**, none fully reviewed. Cumulative major sections: 23/60 credited substantively reviewed, 37/60 remain. Stage 06 has 3 opening sections substantively reviewed, 8 additional sections spot-checked. The Stage 07 backlog includes 14 exact claim-linked investigations. This source research is useful but intentionally not a fabricated exhaustive historical/scientific account.

## Reproducibility

`npm run validate:data` PASS, `npm run test:offline` 62/62 PASS. Static TypeScript/CSS parse PASS at syntax/import level. npm registry/lockfile/typecheck/lint/Vitest/Vite/browser/Pages are BLOCKED or NOT RUN; do not treat them as certified.
