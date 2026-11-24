# HNI Stage 09A — verification and migration report

Implementation: source packaged, production build BLOCKED / UNVERIFIED. No browser or mobile Safari certification.

## Actual checks
| Command/check | Status | Outcome |
|---|---|---|
| Stage 08 archive integrity and matching handoff | PASS | One hni/ root; archive CRC and embedded handoff match |
| PDF fingerprint and page count | PASS | 690 physical pages; SHA-256 matches |
| Baseline npm run validate:data | PASS | 0 errors, 0 warnings; 522 ledger links, 143 refs |
| Baseline npm run test:offline | PASS | 83/83 |
| timeout 12 npm install --package-lock-only --ignore-scripts --fetch-retries=0 --fetch-timeout=6000 | BLOCKED | exit 124; timed out, no lockfile |
| npm ci --offline | BLOCKED | exit 1, EUSAGE requires lockfile |
| npm run typecheck | BLOCKED | exit 2, TS2688 vite/client and vitest/globals absent |
| npm run lint | BLOCKED | exit 127, eslint not found |
| npm run test | BLOCKED | exit 127, vitest not found |
| npm run build | BLOCKED | exit 127; all validators passed; vite not found |
| npm run validate:data | PASS | 0 errors/warnings; 522 ledger links; 60 heading locators; 143 refs; 4 comparisons; 6 scenarios, 42 steps |
| npm run test:offline | PASS | 103/103, including 20 new tests (19 executable logic/data and 1 static contract check) |
| Focused strict tsc on scenario-types.ts, scenario-validator.ts, scenario-engine.ts | PASS | exit 0, strict and noUnused checks; NOT whole-app compilation |
| Source TS/TSX syntax, relative imports, CSS parse | STATICALLY INSPECTED | 52 files, 174 relative import targets, 0 missing/parse errors; CSS parsed |
| Existing canonical research and Academy preservation | PASS | Every original src/data file, research file and Academy component byte-identical to Stage 08 |
| Browser, keyboard/touch rendering, 375/390/430px, Safari, Pages CI and deployment | NOT RUN | No compiled frontend, no actual browser verification |

Node v22.16.0, npm 10.9.2. No genuine package-lock.json, npm cache insufficient for installation. CI's lockfile gate is unchanged. No dependency versions altered.

## New tests and migration
- Data: unique scenario/step/choice IDs; valid references; feedback; graph reachability, acyclicity, all six phases required on each terminal path.
- Engine: initialization, evidence reveal, deterministic response, conditional reflection branch, multiple defensible choices, completion, replay, restart and invalid-state recovery.
- Actual storage core: v1 read-only migration preserving old fields; V2 write/reload; shared backup serialization/deserialization; malformed/future/retired sessions rejected; no write on cancellation; failed write keeps state; scenario-specific reset preserves other data. Earlier regression assertions expecting version 1 now check migration to 2; future-version fixture changed from 2 to 3. All 83 original tests remain, none deleted. Four new Vitest tests are written, not executed.
- Saved sessions store only scenarioId and stable step/choice pairs. Replay computes feedback, evidence, completion. No psychological scores, runtime AI or external inference. Unknown sessions cause a recoverable corrupt/invalid backup state, never silent deletion.
- UI source inspection: radio/fieldset labels, 44px control minimum, responsive grid, wrapping and reduced-motion CSS, feedback/step focus, explicit restart and import confirmation, source-aware references. Actual visual/keyboard/touch behavior is unverified; no screenshots or claims of Safari testing.

## Research
Six fictional instructional designs reuse established source and canonical IDs. Direct text inspection checked 19 distinct linked book PDF locators (plus index 48 for reaction delay); existing external findings were read from canonical Stage 07 data, not independently re-reviewed. No new independent research, no new SRC/REF/EDG/claim IDs, no coverage upgrades. No full chapter was newly exhaustively read. All 18 chapters remain partial, 23/60 substantive sections credited, 37 pending, 8 independent questions unassessed. The existing printed-page mapping remains unknown.

## Known limitations
- Main path has six phases, with a conditional seventh reflection step. Choices have individual feedback, but do not model real-world outcomes or predict people. Most later decisions rejoin the same instructional path; no simulation of causal probabilities.
- Saving is opt-in; only committed choice history persists. Unsaved selections and the feedback panel's transient position are not saved. On reload the next phase resumes and prior feedback is available in history. Unknown/retired histories block import rather than dropping data.
- All scenario records are fictional/provisional instructional content, not verified historical or scientific results. Academy enhancements belong to Stage 09B.
