# HNI — STAGE 03 BUILD & TEST STATUS

**Version:** 0.3.0. **No genuine package-lock.json; do not call this a verified build.**

| Command / check | Status | Actual result / blocker |
|---|---|---|
| `npm run validate:data` | PASS | 0 dataset errors; 10 expected unresearched-law warnings; 136 valid ledger links; 26 verified headings; 4 curated comparisons |
| `npm run test:offline` | PASS | 32/32 Node tests passed |
| Stage 02 ZIP CRC and PDF fingerprint | PASS | 87 ZIP members, no corruption; PDF SHA-256 unchanged, 690 pages |
| TS/TSX parser / relative imports | STATICALLY INSPECTED | 39 TypeScript files, 0 parse errors; 107 relative imports resolve |
| CSS stylesheet parser | STATICALLY INSPECTED | 343 rules, 0 top-level syntax errors |
| `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=9000` | BLOCKED | One `timeout 27s` attempt returned exit 124; no lockfile generated; registry unavailable or unresponsive |
| `npm ci --offline --no-audit --no-fund` | BLOCKED | Exit 1, npm `EUSAGE`: required lockfile missing |
| `npm run typecheck` | BLOCKED | Exit 2, TS2688: missing type libraries `vite/client` and `vitest/globals` |
| `npm run lint` | BLOCKED | Exit 127, `eslint: not found` |
| `npm run test` | BLOCKED | Exit 127, `vitest: not found` |
| `npm run build` | BLOCKED | Exit 127, `validate:data` passed then `vite: not found` |
| Browser / real iPhone Safari / GitHub Actions / Pages deployment | NOT RUN | No compiled build or browser execution; GitHub workflow has not run |

Current deployment workflow from Stage 01B is retained without claiming execution. It deliberately fails unless a real committed `package-lock.json` exists. React/Zod runtime validation and UI navigation remain unverified until dependencies are installed and the build passes. A static parser is **not** a substitute for TypeScript type checking.

**Exact repair in connected npm environment:** `npm install --no-audit --no-fund`, inspect generated genuine lockfile and dependency versions, `npm ci --no-audit --no-fund`, `npm run typecheck`, `npm run lint`, `npm run validate:data`, `npm run test:offline`, `npm run test`, `npm run build`, `npm run preview`; fix real failures and inspect 375px, 390px, 430px plus desktop. Do not manually invent the lockfile or remove quality gates.
