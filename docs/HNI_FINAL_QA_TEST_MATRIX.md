# Final QA matrix — HNI v1.0.0-rc1

**Environment:** Node v22.16.0, npm 10.9.2. Original Stage 09 source archive CRC passes and externally supplied TXT handoff is byte-identical to embedded Markdown. No dependency lockfile or node_modules in source. A bounded registry attempt failed with DNS EAI_AGAIN for react, react-dom, react-router-dom, lucide-react and zod (npm debug log) and timed out after 12 seconds (exit 124). Cache listing did not contain usable dependency tarballs. No fake lockfile was made.

| Gate / command | Actual result | Evidence / repair / retest |
|---|---|---|
| Stage 09 baseline validation | PASS | All validators: 0 errors, 0 expected warnings; 522 ledger links, 60 headings, 143 refs, 4 comparisons, 6 simulations, 57 exercises, 3 paths, 18 lessons. |
| Stage 09 baseline offline suite | PASS | 119/119, exit 0. |
| `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=7000` (12s timeout) | BLOCKED | Exit 124; EAI_AGAIN. No lockfile generated. One-time CI bootstrap added. |
| `npm ci --offline --no-audit --no-fund` | BLOCKED | Exit 1 EUSAGE: requires existing package-lock.json. |
| `npm run typecheck` | BLOCKED | Exit 2 TS2688: unavailable vite/client, vitest/globals; after explicitly adding Node types, node also absent. Strict mode retained. |
| `npm run lint` | BLOCKED | Exit 127: eslint not found. Added Node globals for .mjs scripts without weakening TS rules. |
| `npm run validate:data` | PASS | Final exit 0; all original validators pass. |
| `npm run test:offline` first retest | FAIL, repaired | 127/128 passed; old source-level check required obsolete literal STAGE 06 label. Updated assertion to require current coverage label, actual count binding and disclosure while preserving network synthesis assertion. |
| `npm run test:offline` final | PASS | 128/128 tests; 119 inherited checks, 9 additional. No deleted checks. |
| `npm run test` (Vitest) | BLOCKED | Exit 127: vitest not found. Existing tests preserved. |
| `npm run build` | BLOCKED | Exit 127: data validation passed, vite not found. |
| `npm run build:github` | BLOCKED | Exit 127: data validation passed, vite not found. No dist/github. |
| `npm run build:netlify` | BLOCKED | Exit 127: data validation passed, vite not found. No dist/netlify. |
| `npm run test:browser` | BLOCKED | Exit 1 ERR_MODULE_NOT_FOUND: playwright. Real compiled browser app unavailable. New browser suite exists but has not executed. |
| Focused strict tsc (new Academy navigation service) | PASS | `tsc --noEmit --strict --target es2022 --lib ES2022,DOM src/services/academy-navigation.ts` exit 0. Not full app compilation. |
| TS/TSX/MTS syntax parse | PASS | 59 files, 0 parser diagnostics; global TS compiler API. |
| Relative source imports/exports | PASS | 192 static relative specifiers resolve, 0 missing. Not package dependency verification. |
| JS CLI syntax | PASS | `node --check` for scripts/*.mjs and eslint.config.js. |
| CSS syntax | PASS | PostCSS parse. Not visual layout verification. |
| Workflow YAML and Netlify TOML | PASS (syntax only) | All three YAML parsed; TOML parsed; workflow execution NOT RUN. |
| Compiled asset validator | PASS on synthetic fixtures | New offline tests check correct bases, both outputs, missing/empty assets, source-only HTML and unsafe base. Not actual production bundles. |
| Canonical data preservation | PASS | All pre-existing src/data/ and research/ files byte-identical; see inventory. No deletions. |
| PDF structural audit | PASS | SHA-256 exact match; 690 pages; 18 opening headings and subtitles, all 60 section anchor texts, 132/132 book refs within recorded chapter range. Not full review. |
| Mobile drawer, safe-area, typography, focus | STATICALLY INSPECTED | CSS/JS implemented; actual render at 320/375/390/430/tablet/desktop not verified. |
| User data logic | PASS offline | Existing v1/v2 migration, invalid/future data rejection, deduplication, replay checks, exercise completion, round trip, cancel and failed writes. New raw recovery tests ensure exact raw text and no writes. |
| User data UI | STATICALLY INSPECTED | Dialog, confirmation, race guard and raw export implemented; actual file picker/download/dialog behavior unverified. |
| Graph, search, comparisons, simulation and Academy | PASS offline / STATICALLY INSPECTED UI | Preserved existing tests and canonical datasets; new context-return tests. React mounting and interaction remain unverified. |
| Real iPhone Safari | NOT RUN | No actual iPhone or Safari available. Guide includes manual checklist. |
| Performance and formal accessibility | NOT RUN | No bundle size, load time or accessibility conformance score asserted. Source-level accessible focus/targets only. |
| GitHub CI / Pages / Netlify deployment | NOT RUN | Prepared recovery, dual-target builds, manual Pages workflow and Netlify config. No live site or compiled ZIP supplied. |

## Browser suite scope (written, not executed)

The script serves real dist output under each intended base, asserts exact hash route and nonempty h1, checks document width at six sizes, captures homepage and failure screenshots, tests drawer Escape, bookmarks across reload, law→concept→source, graph list and edge details, search, all three exercise types, lesson/simulation and comparison return, all six simulations with saved completion, export, canceled replacement, confirmed replacement and restoration. It checks browser errors and failed same-site assets. Fixtures are synthetic. Actual Safari, full keyboard navigation, all historical/claim details and full formal accessibility review remain pending. Source-defined behavior is not equivalent to executed browser behavior.

## Release blockers

P0: no dependency lockfile; full compile/lint/Vitest/production builds remain blocked. Run workflow 1 then 2 and fix demonstrated errors. P1: actual browser smoke is unexecuted; mobile, import dialog, cross-module navigation and source panels require verification. Research coverage remains partial. P2: no measured bundle performance, no formal accessibility audit, no Safari/device certification. Optional spaced review and PWA deferred. No mandatory gate weakened.
