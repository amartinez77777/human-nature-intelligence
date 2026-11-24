# HNI Data Dictionary · Canonical v2 / Local progress v2

## Entity IDs

| Collection | Prefix | Rule |
|---|---|---|
| Laws | `LAW-01`..`LAW-18` | Fixed to original numbered chapters |
| Concepts | `CON-0001` | Increasing append-only |
| Cases | `CAS-0001` | Increasing append-only |
| Claims | `CLM-0001` | Increasing append-only |
| Sources | `SRC-0001` | Increasing append-only |
| References | `REF-0001` | Increasing append-only |
| Research findings | `RES-0001` | Increasing append-only |
| Typed graph edges | `EDG-0001` | Increasing append-only |
| Exercises | `EXR-0001` | Increasing append-only |
| Learning paths | `PATH-0001` | Increasing append-only |

Identifiers MUST NOT be generated from array indices or reused after deletion. Add aliases in `research/ID_ALIASES.json` only if a historical ID must redirect; preserve both old and new identity references during migration. Avoid cross-book collisions in a possible future multi-book deployment by scoping the dataset manifest rather than changing existing HNI identifiers.

## Classifications (independent)

1. **Source provenance** `directly_inspected`, `independently_verified`, `secondary_source_account`, `editorial_synthesis`, `unverified`.
2. **Scientific evidence** `supported`, `mixed`, `limited`, `contested`, `not_assessed`.
3. **Editorial coverage** `fully_reviewed`, `partially_reviewed`, `provisional`, `awaiting_review`, `blocked`.

Verifying that Greene wrote a claim is **not** evidence that the claim is scientifically correct. A historical case described in Greene is not independently verified unless separate research documents it.

## Null and unknown handling

- `centralArgument: null`: cannot responsibly summarize an unreviewed law.
- Empty arrays: no verified entries yet, not proof of absence.
- `printedPage: null`: no verified page-number mapping.
- `pdfPageIndex`: zero-based physical page index, strictly less than 690 **only** for `SRC-0001` (the indexed PDF). New sources must carry their own verified locator conventions; web articles may use an identified chapter/section when no PDF/printed page exists. One-based PDF viewer page = index + 1 for PDF sources.
- `sourceId`: stable reference to the source registry; one source can have many locators.
- The canonical research dataset manifest has `schemaVersion: 2`. User progress independently uses `schemaVersion: 2` (migrates valid v1); the comparison dataset remains version 1.

## Link integrity

All `...Ids` fields are foreign keys; graph endpoints combine `EntityType` and ID and must resolve to a known typed collection. In exercises every correct answer must be a choice, each choice has an explanation, and duplicate choice identifiers are invalid. Warnings mark incompleteness; errors mark inconsistent or invalid data.

## Stage 1B storage contract

`schemaVersion:1` user data contains bookmarks, recentlyViewed, completedExercises, and learningProgress. Nonconforming, missing or unknown-version payloads are rejected; duplicate IDs are normalized. Export/import envelopes cannot mutate bundled research. A transaction is accepted only after explicit confirmation and a successful browser storage write. Corrupted prior storage data is not auto-overwritten.

## Stage 03 additive comparisons (schemaVersion 1)

`src/data/concept-comparisons.json` is a versioned collection of curated educational comparisons with immutable `CMP-0001` onward IDs. Fields: `title`, `leftConceptId`, `rightConceptId`, `contrast`, `leftLens`, `rightLens`, `illustration`, `ethics`, `relatedLawIds`, `sourceReferenceIds` and `editorialStatus`. Runtime Zod `ConceptComparisonDataset` enforces shape; the dependency-independent validator enforces canonical endpoints. No user state or existing entity IDs are migrated.


## Stage 05 canonical education dataset v2

`src/data/dataset-manifest.json` now requires `schemaVersion: 2`. `ConceptRecord` and `HistoricalCaseRecord` each require `levelsOfExplanation: ExplanationLevel[]`. The supported values are `individual`, `interpersonal`, `group`, `historical_institutional`; empty array `[]` means not editor-reviewed for the new classification. Multiple values may coexist. The Zod schema is in `src/domain/schemas.ts` and independent structural validation is in `scripts/validate-data.mjs`. The Level UI helpers in `src/services/explanation-levels.ts` are deterministic and consume canonical records, not duplicate local data.

All earlier concept and historical case substantive fields were preserved and acquired `levelsOfExplanation: []`, with migration details in `research/STAGE_05_SCHEMA_MIGRATION.json`. No old records were retrospectively categorized without research. **Progress schema is separate** and unchanged at version 1 under browser key `hni.user-progress.v1`. Curated concept comparison dataset remains version 1. Law records, source records, claim scientific status, and source-reference contracts remain unchanged.


## Stage 06: complete 18-law canonical archive (no schema migration)

All 18 laws have partially reviewed, source-attributed dossiers. Current counts are 54 concepts, 18 book-attributed historical cases, 38 claims, 132 PDF references, 127 typed edges, 47 multiple-choice exercises and 0 independent research findings. No duplicate normalized concept names or IDs were identified; do not merge semantically distinct constructs solely on string similarity. The chapter map and coverage matrix correct `Controlled Aggression` (physical index 560) and `Generational Patterns` (physical index 595). Three opening narrative sections received substantive Stage 06 review credit; the other eight new headings were verified and sampled, not exhaustively reviewed. See `research/STAGE_06_FULL_BOOK_AUDIT.json` and `research/STAGE_07_EVIDENCE_BACKLOG.json`.

## Stage 09A educational scenario envelope v1 and user progress v2

`scenarios.json` holds `SIM-0001`–`SIM-0006`. Stable step, evidence and choice IDs are scoped to a scenario; choice IDs are unique within each scenario. `ScenarioSession` contains `scenarioId` and `history: {stepId, choiceId}[]`; completion, evidence and feedback derive from replay. Store sessions in `scenarioProgress: Record<string, ScenarioSession>` keyed by SIM ID; no transient graph keys. Valid v1 progress migrates to v2 with an empty scenarioProgress map; all previous fields retain their meaning. Unknown or invalid v2 sessions invalidate the backup rather than silently deleting data. Restore only after explicit confirmation and successful storage write. A source reference supports an educational mechanism, not a fictional event. No SIM is added as a research graph node or claim.

## Stage 09B extensions
Dataset schema v3: ExerciseRecord supports multiple_choice, evidence_classification and multiple_interpretations; evaluationRules.correctChoiceIds remains canonical. Optional revision, relatedCaseIds and relatedResearchFindingIds added. LearningPathRecord may contain ordered lessons identified by LES-####, containing title, objective, introduction, illustration, lawIds, conceptIds, caseIds, findingIds, exerciseIds, scenarioIds, sourceReferenceIds. Optional user progress v2 academyAttempts keyed by EXR ID with exerciseId, revision and choiceIds. See migration report.
