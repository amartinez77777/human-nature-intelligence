# HUMAN NATURE INTELLIGENCE — STAGE 08 HANDOFF TO STAGE 09

Authoritative source: HNI_STAGE_08_SOURCE.zip (one hni/ root). Application v0.8.0. Dataset schema v2; progress schema v1. Source/data checks PASS; dependency-backed React build BLOCKED / UNVERIFIED.

## Inputs verified
Actual uploaded HNI_STAGE_07_SOURCE(1).zip SHA-256 `c1b2e24c4766b9da40e07fc77a06792adf7c19e947f14562903615fc64efec83`. Embedded Stage 07 handoff and provided HNI_STAGE_07_HANDOFF(1).md inspected. Archive integrity passed. The attached 690-page PDF, The Laws of Human Nature by Robert Greene (Viking / Penguin Random House, copyright 2018), matched fingerprint `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e` exactly. Same edition/rendition; format-specific ISBN and printed-page mapping still not established. The book PDF is excluded from the release; SRC-0001 indices remain zero-based.

## What Stage 08 adds
- Real canonical discovery adapter and typed indexed graph: 146 nodes, 127 unchanged editorial edges, 189 derived catalog associations (316 total links). No new EDG IDs, invented citations or independent research. Derived `link:` IDs are UI-only and never stored in canonical datasets or local progress. `src/services/graph-core.ts`, `discovery-adapter.ts`, `discovery-index.ts` are the reusable services.
- `/network` now provides SVG diagram and native accessible relationship browser with focus, one/two-hop expansion, relation/entity/text filters, editorial-only toggle, node and edge selection, source panels, 18-node cap, zoom/fit and button pan. Query parameters: entity, mode, depth, relation, type, q, editorial, edge, zoom, panX, panY. List shares bounded graph subset, with explicit all-relations list option. Keyboard/touch source implementation exists, real browser not tested.
- `/search` ranked deterministic lexical index across laws, concepts, people/cases, claims, findings, source metadata; combined filters and literal snippets. `/compare` compares actual law/concept fields, shared case IDs, real edges and curated pair explanations. Existing `/atlas/compare` unchanged. Network backlinks from all 6 detail types; finding route resolution fixed; source registry now includes findings. Command Center derives explained discovery links; stale version and historical captions corrected.
- All 8 permanent routes preserved. Simulation Lab and Academy remain their original Stage 07 versions, intentionally reserved for Stage 09. GitHub Pages base and HashRouter preserved.

## Research and user state
All original src/data and research files are byte-for-byte unchanged. 18 law records, 54 concepts, 18 historical cases, 38 claims, 12 sources, 143 references, 6 findings, 127 EDG records, 47 exercises, 4 curated comparisons, 1 path. 522 ledger links. No schema migrations or aliases added. 18 partially reviewed chapters; 23/60 substantive sections, 37 pending. 8 of 14 external evidence backlog questions remain unassessed. No new source-independent verification in this stage. Book claims, empirical status and editorial coverage still distinct.

Protect Stage 01B pre-overwrite import confirmation, transactional writes, corrupt storage protection, JSON export/import, actual REF→SRC lookup, source-aware rendering, existing evidence methodology, case comparison, four-level facets, research-perspectives and all existing IDs. User storage key `hni.user-progress.v1` unchanged. Never persist graph transient keys in progress.

## Executed verification
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

## Changed files (relative to hni/)
- README.md
- docs/ARCHITECTURE.md
- docs/STAGE_HANDOFF.md
- package.json
- scripts/offline-tests.mjs
- src/app/router.tsx
- src/components/layout/Shell.tsx
- src/components/shared/UI.tsx
- src/domain/entity-types.ts
- src/modules/behavior-atlas/BehaviorAtlas.tsx
- src/modules/command-center/CommandCenter.tsx
- src/modules/command-center/SearchPage.tsx
- src/modules/command-center/SourceAndSettings.tsx
- src/modules/historical-cases/HistoricalCases.tsx
- src/modules/knowledge-network/KnowledgeNetwork.tsx
- src/modules/laws-library/LawsLibrary.tsx
- src/modules/science-evidence/ScienceEvidence.tsx
- src/services/relationships.ts
- src/services/search.ts
- src/styles/global.css
- src/modules/behavior-atlas/ComparisonExplorer.tsx
- src/services/discovery-adapter.ts
- src/services/discovery-index.ts
- src/services/graph-core.ts
- src/tests/stage08-discovery.test.ts
- New Stage 08 handoff, manifest, feature audit and graph-test matrix included in docs/; README, ARCHITECTURE and STAGE_HANDOFF updated.

## Stage 09 first actions
1. Attach the actual HNI_STAGE_08_SOURCE.zip, HNI_STAGE_08_HANDOFF.md or iPhone TXT, and the same PDF. Extract existing source, read current schemas, datasets, routes, tests and this handoff. Never use older stage ZIPs as working source.
2. In Node >=22.16 environment with npm access, generate a genuine package-lock.json by npm install, commit it, npm ci, typecheck, lint, validate:data, test:offline, test, build. Fix actual errors. No lockfile exists here; do not fabricate it. If blocked, make a bounded attempt and proceed with accurate verification statuses. Browser smoke test Stage 08 graph/search/compare and storage. See HNI_STAGE_08_GRAPH_TEST_MATRIX.md.
3. Implement Behavioral Simulation Lab and Intelligence Academy advanced functionality using canonical IDs and existing records. Current exercises are multiple_choice only; any new types, scenario model or saved learning progress require explicit versioned schema migration and validation, backward-compatible handling of old backups, source-linked fictional scenarios, alternatives and uncertainty. No diagnosis or personality scoring. Preserve optional progress as secondary to educational knowledge.
4. Preserve all Stage 08 discovery algorithms and routes. Test new and old features, keep graph associations distinct from EDG research, no copied datasets or backend. Carry forward all evidence and section-review limitations without silently upgrading coverage.
5. Ship complete HNI_STAGE_09_SOURCE.zip with one hni/ root, handoff and verification reports, iPhone-readable TXT, no PDF, build cache or nested older archives.

Remaining blockers: dependency lockfile and build, real browser and Safari/accessibility testing, GitHub Pages deployment, 37 substantive section reviews, 8 unassessed evidence questions, full-text scholarly review of limited evidence, printed-page mapping. Stage 08 is an implemented source package, not a certified compiled site.
