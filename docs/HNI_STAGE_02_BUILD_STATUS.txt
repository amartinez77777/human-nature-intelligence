# HUMAN NATURE INTELLIGENCE — STAGE 02 BUILD & VERIFICATION STATUS

**Version:** 0.2.0  
**Source:** `HNI_STAGE_01B_REPAIRED_UNVERIFIED_SOURCE(1).zip`  
**Environment:** Node v22.16.0; npm v10.9.2; Linux container  
**Release qualification:** **Research/data-integrity validated; React production build NOT verified.**

## Executed commands and outcomes

| Check or command | Result | Real outcome |
|---|---|---|
| Source ZIP extraction and baseline comparison | PASS | Original `hni/` source restored with 75 files. No pre-existing lockfile. |
| PDF SHA-256 and page count | PASS | 690-page PDF; SHA-256 `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`, identical to Stage 01B. |
| `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=8000 --prefer-offline` | BLOCKED | One bounded attempt was terminated by the shell timeout; the npm registry did not supply usable dependencies. No `package-lock.json` was produced. Not counted as a successful install. |
| `npm ci --offline --no-audit --no-fund` | BLOCKED | Exited unsuccessfully: `npm ci` requires an existing lockfile; none is present. No claim of reproducibility. |
| `npm run typecheck` | BLOCKED | `tsc --noEmit` ran but failed resolving missing `vite/client` and `vitest/globals` type definitions. Not a passed project typecheck. |
| `npm run lint` | BLOCKED | `eslint: not found`; the npm dev dependencies are absent. |
| `npm run validate:data` | **PASS** | JSON integrity **0 errors**, **14 expected warnings** for Laws 5–18 awaiting review; research-integrity validator passed **56 ledger links**, **14 section headings**, **22 references**. |
| `npm run test:offline` | **PASS** | **24/24 Node offline tests** passed; original regression suite retained and 5 Stage 02 research-integration checks added. |
| `npm run test` | BLOCKED | `vitest: not found`; no dependency installation completed. |
| `npm run build` | BLOCKED | Data validation passed; Vite executable missing (`vite: not found`). No production build emitted. |
| TypeScript/TSX syntax parser (global TypeScript 5.x) | **PASS — STATIC ONLY** | 37 files parsed; 0 syntax parse errors. This does **not** prove module resolution or type safety. |
| Relative import audit | **PASS — STATIC ONLY** | 98 relative imports, 0 missing target paths. |
| CSS tokenization (`tinycss2`) | **PASS — STATIC ONLY** | 316 top-level rules, 0 syntax parse errors. |
| Compiled browser smoke testing | **NOT RUN** | No compiled app available. Eight routes inspected at source level only. |
| 375/390/430px real viewport testing | **NOT RUN** | Responsive CSS inspected, but not rendered in a browser. |
| iPhone Mobile Safari testing | **NOT RUN** | No Safari device/test session. |
| GitHub Actions execution and Pages deployment | **NOT RUN** | Workflow retained but cannot pass its lockfile gate until a real lockfile is generated and committed. |

## Failures discovered and corrected during Stage 02

1. The Stage 01B offline test expected exactly 16 awaiting-review warnings. With 4 researched law records, the count legitimately dropped to 14. The assertion now derives the expected warning count from the actual incomplete law records.
2. A Stage 01B test fixture had reserved `REF-0007`, conflicting with a new real research reference. The fixture now uses isolated `REF-9999`, preserving validation of multi-source behavior without altering production data.
3. The Law 4 *Toxic Types* heading was mislocated at the chapter opening in the previous coverage map. The section begins on **viewer page 138 (zero-based index 137)**. The chapter map and coverage log now identify the verified location.

## Dependency gate: precise follow-up

From the extracted `hni/` project in a network-enabled environment with Node >=22.16.0:

```bash
npm install --no-audit --no-fund
# Confirm that a GENUINE package-lock.json was created.
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm run validate:data
npm run test:offline
npm run test
npm run build
npm run preview
```

Fix actual errors before calling this build production ready. **Commit the generated lockfile** to the Git repository and retain it in every cumulative ZIP. Do not generate fake integrity hashes or disable checks. The existing Pages workflow checks for `package-lock.json` before enabling npm caching, performs `npm ci`, runs all quality commands, and uploads `dist` only after success. Its presence does **not** certify that it has passed on GitHub.

**Project site base:** `/human-nature-intelligence/` in `vite.config.ts`, with `HashRouter` for client-side static-host navigation. Configure GitHub Pages to deploy via **GitHub Actions** before the first real deployment.

## Release truth

- **Data and research integrity:** PASS under the executed dependency-free checks.
- **Full React runtime and production build:** BLOCKED by npm registry/dependency availability and missing lockfile.
- **Browser, accessibility and Safari behavior:** NOT RUN. No screenshots or browser certification claimed.
- **Historical and scientific evidence verification:** NOT ASSESSED in Stage 02. Verified PDF attribution is not independent corroboration.
