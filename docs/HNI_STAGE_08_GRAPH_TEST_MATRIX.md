# HNI Stage 08 — Graph test matrix

Actual runtime tests used Node 22.16.0 and npm 10.9.2. Offline tests include the production pure discovery adapter and algorithms; the React component checks are static, not mounted rendering tests.

| Check | Status | Actual outcome |
|---|---|---|
| Stage 07 archive and matching PDF | PASS | ZIP integrity; one hni root; matching SHA-256, 690 physical pages |
| Baseline `npm run validate:data` | PASS | 0 errors, 0 warnings; 522 ledger links; 143 references; 4 curated comparisons |
| Baseline `npm run test:offline` | PASS | 70/70 |
| `timeout 15 npm install --package-lock-only --ignore-scripts --fetch-retries=0 --fetch-timeout=7000` | BLOCKED | Exit 124, timed out, no package-lock.json generated; registry installation did not complete |
| `npm ci --offline` | BLOCKED | Exit 1, EUSAGE: requires a lockfile |
| `npm run typecheck` | BLOCKED | Exit 2, TS2688 missing vite/client and vitest/globals |
| `npm run lint` | BLOCKED | Exit 127, eslint not found |
| `npm run test` | BLOCKED | Exit 127, vitest not found |
| `npm run build` | BLOCKED | Exit 127, validators passed, vite not found |
| Final `npm run validate:data` | PASS | 0 errors, 0 expected warnings; 522 ledger links; 60 verified heading locators; 143 references; 4 comparisons |
| Final `npm run test:offline` | PASS | 83/83; includes 13 Stage 08 tests, 12 functional/data and 1 static UI-contract test |
| TypeScript syntax and import target scan | STATICALLY INSPECTED | 48 TS/TSX files, 147 relative import targets, zero parse or missing-target errors |
| CSS syntax and responsive rule inspection | STATICALLY INSPECTED | No top-level CSS parse errors; 600px wrapping rules and native 44px controls |
| Real React render, keyboard/touch, mobile overflow, Safari, production preview, Pages CI/deploy | NOT RUN | No dependency-backed bundle or real browser verification |

## Stage 08 specific tests
| Coverage | Actual result |
|---|---|
| All 6 node categories; all 127 canonical edge records retained | PASS |
| Actual CLM-0006 → RES-0001 → SRC-0002 association and REF-0133 resolution | PASS |
| Invalid endpoint, duplicate ID and self-link rejection | PASS |
| One/two-hop cap and link endpoint parity across all 146 focus IDs | PASS |
| Combined type, relation, query, editorial-only filters | PASS |
| Deterministic radial coordinates | PASS |
| Exact ID/title ranking, all query terms required | PASS |
| People, finding, bibliography and combined evidence/law search | PASS |
| Shared case IDs and absent overlap | PASS |
| Every graph link REF resolves to real source; cites links target correct SRC | PASS |
| UI source contracts: query state, graph/list, source detail, finding route, comparison route and search controls | STATICALLY INSPECTED (offline assertion passed) |
| Editorial endpoint types, direction, nonempty explanations/references and unique typed pairs | PASS |
| Apostrophe normalization and real indexed excerpts | PASS |
| SVG edge selection, focus interactions, URL back/forward, pan/zoom, iPhone 375/390/430px, screen reader behavior | NOT RUN in browser; implemented and source-inspected |
| Actual compiled bundle performance and cross-route browser smoke test | NOT RUN |

## Stage 09 verification recipe
With working network, run npm install (generate genuine lockfile), npm ci, typecheck, lint, validate:data, test:offline, test, build, preview. Fix real compiler errors without suppressing strictness. In built app, inspect /network?entity=LAW-03, select the claim CLM-0006, inspect RES-0001 then SRC-0002 via source links; back/forward restores graph query. Verify mouse, keyboard, touch at 375/390/430px, list fallback, zoom and pan, missing ID, all mode, filters, comparison and progress import cancel/confirm. Test Safari only when actual Safari is available.
