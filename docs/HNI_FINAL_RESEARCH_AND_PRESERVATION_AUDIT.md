# Stage 10 research and feature preservation audit

## Source identity and scope

Original supplied Stage 09 ZIP SHA-256: `0f86c7dd6375c82b1420d27403eaede8849180c53a0b13cce81d9bb2bf599559`; CRC passed, one hni root, 184 files. External handoff exactly matches embedded `docs/HNI_STAGE_09_HANDOFF.md`.

The actual supplied PDF `The Laws of Human Nature(8)(8).pdf`, 690 pages, SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e` matches SRC-0001 and original dataset manifest. Copyright page identifies Viking/Penguin Random House, 2018; format-specific ISBNs are listed but not assigned to this digital rendition. Zero-based physical indices; viewer page index +1; printed mapping unresolved. The original PDF is excluded.

Stage 10 checked the text layer for every narrative title and law subtitle at the exact mapped chapter opening; all 18 matched. All 60 tracked section titles were found in text on their mapped anchor pages; this is a literal text-anchor check, not proof that every page or section was read. All 132 references to SRC-0001 have physical page indices within their recorded chapter boundaries. The 11 external reference records retain their previous access qualifications. Opening argument spot checks across all 18 laws show no consequential mismatch requiring an ID/claim rewrite at that level. In particular, Laws 3, 9, 11, 12 and 17 retain explicit nonverbal-cue, hidden-motive, grandiosity, gender-theory and cohort-generalization caveats. This does not certify all historical details or scientific statements. No new external findings or substantive section credits were claimed. See `research/STAGE_10_PDF_STRUCTURE_AUDIT.json` for per-law and section evidence.

## Before and after

| Asset | Before | After |
|---|---:|---:|
| Laws | 18 | 18 |
| Concepts | 54 | 54 |
| Cases | 18 | 18 |
| Claims | 38 | 38 |
| Sources | 12 | 12 |
| References | 143 | 143 |
| Findings | 6 | 6 |
| Canonical editorial EDG relationships | 127 | 127 |
| Derived discovery associations | 189 | 189 |
| Indexed relationships | 316 | 316 |
| Graph nodes | 146 | 146 |
| Curated comparisons | 4 | 4 |
| Simulations | 6 | 6 |
| Simulation steps / choices / evidence | 42 / 120 / 30 | 42 / 120 / 30 |
| Exercises | 57 | 57 |
| Learning paths / lessons | 3 / 18 | 3 / 18 |
| Substantive sections credited | 23 | 23 |
| Offline tests passed | 119 | 128 |

`research/STAGE_10_PRESERVATION_INVENTORY.json` contains complete before-and-after canonical IDs, routes, all scenario step/choice IDs, lesson IDs, hashes of original data/research files and schema/field inventory. All original `src/data/` and `research/` files are byte-identical; no records deleted, merged, reseeded or changed. All original app route patterns preserved. Stage 10 adds only audit metadata in research. Derived associations remain navigation relationships, not independently sourced claims.

## Eight permanent modules

| Module | Preservation and Stage 10 work |
|---|---|
| Command Center | Discovery, featured law/case, research coverage, synthesis, simulation and Academy entries retained. Expandable coverage and visible bookmark shelf added; removed stale development-stage labels, not content. |
| 18 Laws Library | All 18 partial dossiers, connected concepts/cases/claims, critical questions, citations and adjacent law links preserved. Shared reading and mobile typography refined. |
| Human Behavior Atlas | 54 concept records, four curated comparisons, level filters and generic comparison preserved. Academy return context corrected using real path/lesson membership. |
| Historical Cases | 18 case records, attributed interpretation, alternatives, limits, provenance and levels preserved. |
| Knowledge Network | Graph core, 18-node bounded diagram, typed directional relationships, filters, accessible list, source references and derived catalog associations unchanged. |
| Behavioral Simulation Lab | Six investigations and deterministic replay engine unchanged; all stable choices and optional saved sessions retained. |
| Science, Evidence & Criticism | Six independent research summaries with access limitations, claim filters, methodology and findings routes retained. |
| Intelligence Academy | All 57 EXR, 3 PATH and 18 LES IDs, answer keys, three exercise types, historical/evidence modes, review, simulation links and saved attempts retained. Return-link context improved. |

All module statements describe preserved source implementation and passing relevant offline tests, not a certified browser mount. Real browser interactions remain unexecuted.

## Remaining editorial queue

All 18 chapters remain `partially_reviewed`; 23/60 substantive section credits, 37 remaining. Eight evidence questions unassessed in `research/STAGE_07_EVIDENCE_BACKLOG.json`. Keep the existing exact section lists and uncertainty notes in COVERAGE_MATRIX.json; no hidden upgrade. Six research findings remain scoped, some abstract-level access only; do not treat them as universal confirmation of Greene. Earlier independently corroborated historical details remain separate from attributed psychological interpretation. Current educational activities are editorial teaching judgments, not diagnostic or psychometric instruments. No new quotations, historical dialogue, empirical results or source IDs added. Maintain immutable research and separate provenance, evidence, editorial status in future revisions.

## Technical limits

The source/record inventory is complete, but the application has not compiled here. No dependency-backed or browser evidence permits asserting that all modules mount. The release candidate preserves all research and has a real CI recovery path. See the final QA matrix and publishing guide.
