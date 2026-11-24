# HUMAN NATURE INTELLIGENCE — STAGE 09A HANDOFF TO STAGE 09B

Authoritative cumulative source: HNI_STAGE_09A_SOURCE.zip. App v0.9.0-alpha.1. Canonical dataset schema v2; scenario envelope v1; local user progress v2. Offline verification PASS; production build BLOCKED / UNVERIFIED.

## Inputs and preservation
- Actual uploaded Stage 08 ZIP SHA-256 `c57c7edb0f19e279fa7413378fd8660b4c8ff99b37632c5c46859bcb551024aa`; CRC and matching embedded handoff verified. The 690-page PDF SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e` matches SRC-0001. Viking/Penguin Random House 2018; zero-based physical PDF indices, viewer page index+1, printed page mapping unresolved. PDF excluded.
- Every prior research dataset, research document and Academy component is byte-identical. Canonical counts remain 18 laws, 54 concepts, 18 cases, 38 claims, 12 sources, 143 refs, 6 findings, 127 EDG edges, 47 exercises, 4 comparisons, 1 learning path. Graph remains 146 nodes, 127 editorial edges + 189 derived catalog associations. Do not turn SIMs or catalog associations into research claims.
- 18 chapters partially reviewed, 23/60 substantive section credits, 37 pending; 8 evidence questions unassessed. No new independent scientific or historical verification.

## Implemented Simulation Lab
- Existing /lab becomes a six-case library; new /lab/:id route is stable and handles unknown IDs. SIM-0001 preserves The Unanswered Proposal; SIM-0002 The Unexpected Promotion; SIM-0003 The Charismatic Leader; SIM-0004 The Changing Group Opinion; SIM-0005 The Quiet Rivalry; SIM-0006 The High-Stakes Decision. Each has six required core phases plus a conditional reflection branch; 42 authored steps, 120 choice-specific explanations, 30 evidence items, 18 competing interpretations total. Fictional/provisional, no diagnosis or psychometric score.
- `src/data/scenarios.json` (schemaVersion 1) loaded via existing `src/services/repository.ts` (`scenarios`, `findScenario`). `src/domain/scenario-types.ts` defines Scenario, ScenarioStep, ScenarioChoice, ScenarioSession. `scenario-validator.ts` checks schema and references, duplicate IDs, feedback, reachability, cycles, all six ordered core phases. Zod wrapper `ScenarioDataset` in schemas.ts, integrated canonical validator and offline validate-scenarios.mjs.
- `src/services/scenario-engine.ts`: startScenario, replayScenario, submitChoice, resumeScenario. The stable step IDs are observation, interpretation, assessment, missing_information, revision, response and reflection. Evidence IDs e-1…e-5 and choice IDs such as observation-a are scoped per SIM; never rename or reuse. First unsupported observation choice routes to reflection; both reflection options rejoin interpretation. All response choices finish the case. Feedback labels well_supported, defensible, needs_review describe the reasoning only. `replayScenario` returns current step, cumulative evidence, feedback history, and completion boolean; invalid state throws; resumeScenario offers clean unsaved recovery.
- `SimulationLab.tsx` provides briefing, characters/objectives, evidence, interpretations, native choice radio controls, feedback, progress, history, restart confirmation, optional save, completion analysis, knowledge links via RecordLink and ReferencePanel. Source refs support teaching mechanism only. New restrained Command Center discovery entry. No changes to Academy questions/path completion semantics.
- Existing canonical refs reused (22 distinct references, 19 book locators directly text-inspected, 3 prior external refs); no new REF or source ID. Existing external findings retain abstract-access qualifications. References link to real SRC records; no PDF text is bundled.

## Progress migration — important
- The same storage key `hni.user-progress.v1` is retained deliberately. Payload version is now 2. Existing `bookmarks`, `recentlyViewed`, `completedExercises`, `learningProgress` fields are preserved. New `scenarioProgress: Record<string,ScenarioSession>` keyed by SIM ID; session stores `scenarioId` and `history: Array<{stepId,choiceId}>`. No score, active transient graph link or private narrative stored.
- `progress-validation.ts` accepts valid v1 and initializes empty scenarioProgress; validates v2 sessions via deterministic replay; rejects future versions and invalid/retired scenario IDs. `progress-storage.ts` read never writes or destroys unreadable data; save validates before write and returns false on failure. `persistence.ts` reexports storage and keeps Zod migration; `backup-serialization.ts` shares real transport with offline tests. `ProgressContext.saveScenario` merges one scenario into current state and commits only after storage succeeds. Save optional; unsaved interaction continues in memory with truthful status. `SourceAndSettings` explains replacement of simulation sessions and keeps explicit confirmation.
- Keep existing Stage 01B corrupt-storage, confirmed import, source-aware rendering and dynamic REF→SRC resolution. Stage 09B should extend progress with explicit versioning if needed; accept valid v1 AND v2 backups, preserve all scenario histories and migrate older fields. Unknown/invalid backups must not silently destroy originals. Never persist derived link: keys. Export contains personal state only, not research.

## Verification
See HNI_STAGE_09A_VERIFICATION_REPORT.md. Baseline 83/83; final 103/103 offline tests; data validation 0 errors/warnings. Focused scenario-core strict TypeScript command passed. Source syntax/import and CSS checks are static only. npm install lockfile attempt timed out (exit 124); npm ci --offline EUSAGE, full tsc TS2688 missing vite/client and vitest/globals, eslint/vitest/vite missing. No genuine lockfile; production build, all actual browser rendering, accessibility interaction, iPhone Safari, CI deployment not verified. Four Stage 09A Vitest tests written but not run.

## Stage 09B first actions
1. Attach HNI_STAGE_09A_SOURCE.zip, this handoff (MD or TXT), same complete PDF. Inspect actual source and preserve all 8 modules, 47 EXR records and PATH-0001, graph/search/compare, source links and simulation behavior.
2. In a network-enabled Node >=22.16 environment generate genuine lockfile via npm install, commit it, npm ci, typecheck, lint, validate:data, test:offline, test and build; do not bypass workflow. If still blocked, bounded attempt then continue with honest status. Stage 10 owns release certification.
3. Audit/improve 47 questions, add 3 coherent learning pathways and additional validated exercise types, advanced Academy UI, learning progress extension only with explicit migration, integration to /lab/:id with stable SIM links. Do not rewrite the simulation engine. Existing RecordLink/ReferencePanel, qualitative feedback conventions and shared storage transport can be reused.
4. Add tests for v1/v2 compatibility, old completed exercise IDs, new learning types, scenario history preservation, import cancel/write failures and all module regressions. Keep all book coverage/evidence limitations. Browser smoke test both modules and real iPhone widths when build available.
5. Deliver `HNI_STAGE_09_SOURCE.zip` (one hni/ root), handoff, verification reports and iPhone TXT. Stage 10 continues that exact cumulative source. Do not include PDF, node_modules, dist, .git, caches or nested ZIPs.

## Files changed before release documentation
- README.md
- docs/ARCHITECTURE.md
- docs/DATA_DICTIONARY.md
- docs/DEPLOYMENT.md
- package.json
- scripts/offline-tests.mjs
- scripts/stage09a-tests.mjs
- scripts/validate-scenarios.mjs
- src/app/ProgressContext.tsx
- src/app/router.tsx
- src/components/layout/Shell.tsx
- src/data/scenarios.json
- src/domain/scenario-types.ts
- src/domain/scenario-validator.ts
- src/domain/schemas.ts
- src/domain/validator.ts
- src/modules/command-center/CommandCenter.tsx
- src/modules/command-center/SourceAndSettings.tsx
- src/modules/simulation-lab/SimulationLab.tsx
- src/services/backup-serialization.ts
- src/services/import-export.ts
- src/services/persistence.ts
- src/services/progress-storage.ts
- src/services/progress-validation.ts
- src/services/repository.ts
- src/services/scenario-engine.ts
- src/styles/global.css
- src/tests/persistence.test.ts
- src/tests/stage09a-scenarios.test.ts
