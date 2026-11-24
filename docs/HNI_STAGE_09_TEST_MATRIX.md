# Stage 09B consolidated verification

Node v22.16.0. Real input ZIP CRC passes; separately uploaded handoff byte matches embedded report; 690-page book fingerprint matches. No package-lock.json in baseline or final. No dependency changes. Existing deployment quality gate retained.

| Command or check | Status | Actual result |
|---|---|---|
| Baseline npm run validate:data | PASS | 0 errors, 0 warnings; 522 ledger links, 143 refs, 6 scenarios |
| Baseline npm run test:offline | PASS | 103/103 |
| timeout 13 npm install --package-lock-only --ignore-scripts --fetch-retries=0 --fetch-timeout=6500 | BLOCKED | Exit 124; bounded timeout; no lockfile produced |
| npm ci --offline | BLOCKED | Exit 1 EUSAGE: requires existing package-lock or shrinkwrap |
| npm run typecheck | BLOCKED | Exit 2 TS2688 missing vite/client and vitest/globals |
| npm run lint | BLOCKED | Exit 127 eslint not found |
| npm run test | BLOCKED | Exit 127 vitest not found |
| npm run build | BLOCKED | Exit 127 vite not found; all data validation scripts executed successfully before Vite |
| Final npm run validate:data | PASS | 0 errors, 0 warnings; 522 ledger links, 60 headings, 143 refs, 4 comparisons, 6 simulations / 42 steps, 57 exercises / 3 paths / 18 lessons |
| Final npm run test:offline | PASS | 119/119; 103 inherited plus 16 new; historical count/schema assertions deliberately updated to 57 and dataset v3; original IDs separately verified |
| tsc --strict --noUnusedLocals --noUnusedParameters --target ES2022 --module ESNext --moduleResolution Bundler --allowImportingTsExtensions --noEmit src/services/exercise-engine.ts src/domain/academy-validator.ts | PASS | Exit 0; focused core only |
| TypeScript parser | STATICALLY INSPECTED | 55 TS/TSX files, no syntax parse diagnostics; not full type checking |
| Responsive source CSS | STATICALLY INSPECTED | Wrapping grids, 44px controls, 52px choices, reduced-motion rules and native form semantics; not rendered |
| Browser navigation, feedback, reload, import dialogs, 375/390/430px, Safari, actual GitHub Actions and deployment | NOT RUN | No compiled application available |

Stage 09B new tests cover all 57 answer keys and choice feedback; invalid selection and malformed keys; exact-set multi-answer assessment; classification; invalid lesson links; ordered resume; original 47 IDs; three paths; all six scenario links; v1/v2 preservation; backup round trips, rejected invalid IDs and versions; safe storage and cancellation; actual provider merge and path completion. One static route-contract check does not establish functional browser navigation. Existing scenario and graph suites remain intact. The entire React app remains unverified, not certified production source.
