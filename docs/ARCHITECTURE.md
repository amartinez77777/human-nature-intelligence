# Architecture contract | HNI 1.0.0-rc1 / Stage 10 (historical Stage 01B contracts retained)

## Structure

- `src/app`: HashRouter, progress context, route registry.
- `src/components`: shared visual primitives, local navigation, consistent source-reference panels.
- `src/modules`: eight named module families. Secondary source and settings pages live under command-center while distinct functional routes preserve the eight-module architecture.
- `src/domain`: ID and schema definitions, independent status taxonomies, relationship types, and pure dataset validator.
- `src/services`: canonical JSON repository, crosslinks, search, local persistence and progress backup.
- `src/data`: static curated entries. `research/`: inspection and coverage ledger. `scripts/`: validator CLI.
- `src/tests`: deterministic test fixtures for invalid references, locators, statuses, exercise answers, duplicates, and personal-data compatibility.

## Data flow

Bundled JSON → Zod runtime parse → immutable repository exports → module views. The pure `validateDataset` routine performs additional foreign-key and cross-record checks. Search and network edges derive from the same repository; no duplicated module datasets.

Local progress: `hni.user-progress.v1` → dependency-free structural guard + Zod migration/validation → React context → browser `localStorage`. An unreadable stored value is preserved without automatic initial writes. Ordinary changes write to storage before updating visible state; a confirmed import must save successfully before replacement. User progress is version 2; valid v1 data migrates in memory and the existing storage key is retained. Export wraps validated progress in `{ format: 'hni-progress', exportedAt, progress }`; import accepts this envelope only.

## Preservation and migration

Canonical stable IDs are permanent. New objects receive monotonically allocated identifiers (see `DATA_DICTIONARY.md`); never rename or reassign IDs. An old ID can become an alias but cannot be reassigned. Track aliases and explicit record migrations in `research/ID_ALIASES.json`. When data schemas change, bump `src/data/dataset-manifest.json.schemaVersion`, write a source-data migration, update validators and tests. When user progress schema changes, add an explicit migration for older versions **before** changing the parser to accept a new version. Unknown future versions must be rejected, not silently reset.

## Privacy / hosting

No backend. No third-party analytics. No external resources required to serve the built frontend. No complete copyrighted book text is bundled. Pages deployment uses `dist/github` with a configurable project-site base; Netlify uses `dist/netlify` and root base `/`.

## Security and quality

Runtime Zod checks guard bundled research; import validates a small versioned JSON shape. LocalStorage errors are surfaced as a warning. Data is educational; there is no diagnosis tool or personality scoring. Exercise feedback warns about uncertain attributions. Stage 01B expanded dependency-free tests to 19 passing cases. Full typechecking, lint, Vitest, Vite build, real browser and Safari testing are blocked/not run; see Stage 01B handoff and verification report.

## Stage 1B reference and import contracts

- `src/services/source-resolution.ts` maps `REF` → its actual `SRC` → `/sources/SRC-XXXX`. A missing source is an error state, never silently replaced by the Greene PDF. The network and shared source links use this resolver.
- `src/services/source-labels.ts` maps record-specific source type and provenance. Unknown academic peer-review status is never inferred from `journal_article`; book format is never assumed from metadata.
- Citation validation enforces the 690-page bound only for `SRC-0001`; future records without PDF pagination may cite an identified chapter/section or a verified printed locator.
- `src/services/progress-validation.ts` strictly validates personal IDs and learning-progress shape, deduplicates user lists, and tests transactional replacement. `SourceAndSettings` collects affirmative user confirmation before invoking the persistence transaction.
- No dataset schemas, source identifiers, 18 law records or Stage 01 research statuses were migrated or replaced in this repair.

## Stage 02 additive integration (v0.2.0)

The same `src/services/repository.ts` remains the only canonical JSON repository. Four research dossiers were added by extending existing `LawRecord` fields without changing the schema (version 1). Additional concepts/cases/claims/exercises/edges and `REF` records are appended to the same data arrays. `src/services/coverage.ts` reads the existing single `research/COVERAGE_MATRIX.json`, not a parallel dataset. The Command Center displays the coverage counts; Laws Library renders long-form paragraphs, source-linked cases and question previews. Book source resolution, source-aware labels, import confirmation, storage safety, user-progress schema v1 and HashRouter all remain unchanged. New offline tests cover valid links and the protected data contracts. See `HNI_STAGE_02_HANDOFF.md` and `HNI_STAGE_02_BUILD_STATUS.md` for unverified dependency gates.

## Stage 03 additive feature

Concept comparisons are curated, versioned static research data read by `src/services/repository.ts` and rendered within the existing Behavior Atlas at `#/atlas/compare`. They do not create a ninth permanent module or separate user-data store. Schema version 1 and local progress version 1 remain unchanged.


## Stage 05: four-level explanation navigation

The canonical schema now supports a flexible explanation-level facet on concepts and historical cases (individual, interpersonal, group, historical/institutional). A record may have several. React Atlas and Historical Cases index filters use `src/services/explanation-levels.ts`; case and concept detail views cross-link through the canonical repository. This facet is editorial metadata, not an additional evidence category and not a user-scoring mechanism. The canonical dataset schema version is 2, while local progress remains v1. To resume from this stage, inspect `research/STAGE_05_SCHEMA_MIGRATION.json`, Stage 05 source log and `docs/HNI_STAGE_05_HANDOFF.md`.


## Stage 06 cumulative source and synthesis

All 18 law entities now carry source-linked partial research, using the exact existing data and `src/services/repository.ts`. `src/services/coverage.ts` derives 18-law coverage; the Command Center renders each partial status. The current Knowledge Network includes four small canonical-law thematic reading lanes, with attributed edges and provenance visible; this is **not** the Stage 08 graph engine. Newly added objects and all previous IDs use immutable append-only sequences; no alias or schema/user-data migration was necessary. The full coverage audit and evidence backlog are research artifacts under `research/`, not user-state collections. Source-based claims, scientific assessment and editorial status remain independent. The Vite npm lockfile and compiled browser execution are still blocked by missing npm registry access, despite 62 passing offline tests.

## Stage 07 verification model

Eleven external `SRC` records and `REF` locators are strictly separate from book `SRC-0001`. Scientific research findings remain canonical `RES` records linked to existing `CLM` records with individual evidence-status values; historical case corroborations are enumerated facts with external bibliographic references, **not** complete independent verification of a case. The UI reads `src/services/repository.ts`; no parallel evidence store, no change in the immutable dataset schema v2 or local user-state schema v1. New `/evidence/methodology` and `/evidence/findings/:id` routes expose the audit transparently. A valid external `REF` uses null book-PDF page fields; the research validator permits these while enforcing the book's PDF page mapping for `SRC-0001`. Offline tests passed 70/70 but compilation still needs a genuine npm lockfile.

## Stage 08 canonical discovery layer

`discovery-adapter.ts` projects the parsed canonical repository into a typed in-memory index. `graph-core.ts` implements adjacency, bounded traversal, filtering, radial layout, lexical ranking, excerpts and shared-ID comparison. `discovery-index.ts` constructs the index once; `search.ts` exposes it. Derived associations use deterministic `link:` keys, not permanent EDG IDs; no new research dataset or schema migration. The SVG and native-button list share a filtered neighborhood; full-corpus list is an explicit mode. URL parameters store focus, mode, depth, filters, selection and camera controls without altering local user progress. The source registry resolves citations by their real reference source IDs. The comparison explorer reads existing fields and the four curated comparisons, with explicit empty states. Browser execution remains unverified.

## Stage 09A simulation contract

The repository loads `src/data/scenarios.json` (independent scenario envelope v1); canonical research remains v2. `src/domain/scenario-types.ts`, `scenario-validator.ts` and the Zod `ScenarioDataset` wrapper enforce schema; repository validation resolves all canonical links. `scenario-engine.ts` replays stable step/choice history, derives available evidence and qualitative feedback and rejects impossible transitions. All six phases are mandatory on every path; an extra reflection branch follows a premature first inference. `src/services/progress-storage.ts` shares the strict dependency-free normalizer with import/export; read never overwrites, successful writes precede React state replacement. Scenario progress is optional, keyed by SIM ID; completion is derived, not stored as a score. `#/lab/:id` is additive, with existing Academy untouched. Stage 09B should reuse source-aware `RecordLink`/`ReferencePanel`, not duplicate the engine or research.

## Stage 09B
Canonical dataset v3 expands exercise type and nested lesson schemas. Repository uses academy-validator.ts and exercise-engine.ts; no duplicate knowledge database. Optional latest attempts are merged via academy-progress.ts into user progress v2. See Stage 09 handoff and migration report.

## Stage 10 release candidate

No schema or canonical data changes. Source-level refinements: mobile drawer accessibility, reading typography, collapsible coverage, bookmark shelf, raw local-storage recovery, import selection race guard, and canonical Academy comparison return context. Build target and artifact checks live in `scripts/build-target.mjs` and `verify-build.mjs`; `browser-smoke.mjs` requires compiled assets and Playwright Chromium. See final QA and release reports for verified and blocked work.
