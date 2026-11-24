# HNI STAGE 05 — FOUR LEVELS OF EXPLANATION AUDIT

## Contract and migration

`src/domain/schemas.ts` defines `ExplanationLevel` with exactly four values: `individual`, `interpersonal`, `group`, `historical_institutional`. `ConceptRecord` and `HistoricalCaseRecord` now have required `levelsOfExplanation: ExplanationLevel[]` fields. Arrays may contain several levels; an empty array means *unclassified*, not that the mechanism operates at no level.

The immutable dataset manifest migrated from schemaVersion **1 to 2**. All 36 pre-existing concepts and 12 cases acquired empty level arrays without modifying prior substantive fields; this prevents unsupported retrospective categorization. All 9 new concepts and 3 new cases have editor-reviewed level sets. The Node validator rejects missing, duplicate or unsupported levels. Zod validates the enum at runtime. **User progress schema stays v1**, storage key remains `hni.user-progress.v1`, and the concept comparison dataset stays v1.

## Why these four levels

| Level | Reading question | Example from Stage 05 | Critical caution |
|---|---|---|---|
| Individual | What might guide decisions and interpretations? | Deliberated purpose | Do not infer internal motivation from persistence alone |
| Interpersonal | What expectations or interpersonal exchanges matter? | Leadership ambivalence | Disagreement is not proof of a hidden personality defect |
| Group | What norms, incentives and group arrangements matter? | Normative group pressure | Aggregate behavior does not certify any individual's private belief |
| Historical/institutional | Which larger structures and historical constraints matter? | Political coercion in Gao Jianhua’s account | An authoritarian political setting differs from a voluntary team |

## Functional contract

Atlas `/atlas` and Historical Cases `/cases` offer accessible labeled selects at minimum 46px height with an All/Unclassified option. The filter is deterministic, uses only canonical records and supports multi-valued tags. Concept detail links to relevant cases, case detail links to concepts/laws/source references, and both retain the four-perspective research component. The mobile styles include wrapping and full-width selectors under 590px. Actual Safari/browser testing was not possible because the app has not been compiled with Vite dependencies.

## Tests

- Valid multi-level groups accepted and matched across several filters.
- Invalid, duplicate and missing facets rejected by independent offline validation.
- LAW-14 → CON-0040 → CAS-0014 → REF→SRC link chain checked.
- Prior 4 comparisons and import/export progress v1 were not migrated or overwritten.

## Research integrity

A *group explanation* does not disprove an individual account, and a *historical explanation* does not imply individual agency was absent. Levels are heuristic labels for comparing hypotheses; they are not independently established psychological variables, diagnoses, or competing percentage allocations of causation.
