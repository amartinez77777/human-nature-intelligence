# HNI Stage 06 — build verification truth table

| Command | Status | Observed outcome |
|---|---|---|
| `npm run validate:data` | PASS | 0 data errors, 0 expected awaiting-review warnings, 511 ledger links, 60 heading locators, 132 references |
| `npm run test:offline` | PASS | 62/62 Node offline tests |
| PDF SHA-256 / pages | PASS | 690 pages; matches prior hash |
| `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=8000` | BLOCKED | Timed out after 15s, npm registry inaccessible, no lockfile produced |
| `npm ci --offline` | BLOCKED | npm EUSAGE: missing `package-lock.json` |
| `npm run typecheck` | BLOCKED | TS2688 missing `vite/client` and `vitest/globals` type definitions |
| `npm run lint` | BLOCKED | `eslint: not found` |
| `npm run test` | BLOCKED | `vitest: not found` |
| `npm run build` | BLOCKED | Data validation PASS, `vite: not found` |
| Global TypeScript parser / local relative imports / PostCSS | STATICALLY INSPECTED | 42 TS/TSX/TS files, 124 local imports, 1 CSS, no parse errors or missing targets |
| Vite preview / compiled browser / iPhone Safari | NOT RUN | No compiled bundle |
| GitHub Actions / GitHub Pages deploy | NOT RUN | No committed lockfile or actual deployment |

Do not claim `npm ci`, compiler, lint, Vitest, Vite or browser passed. A real lockfile must be generated only in a working registry environment and committed before CI is verified. GitHub Actions currently fails fast without it by design.
