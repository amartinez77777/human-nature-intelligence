# HUMAN NATURE INTELLIGENCE — STAGE 01B HANDOFF TO PROMPT 02

**Date:** 2026-11-23  
**App version:** 0.1.1  
**Status:** Foundation repaired and offline-validated; **full app release unverified**.  
**Attach this cumulative archive to Stage 02:** `HNI_STAGE_01B_REPAIRED_UNVERIFIED_SOURCE.zip`  
**Also attach:** the original complete *The Laws of Human Nature* PDF, this handoff, and the verification report.

## 1. Restore and architecture

The cumulative ZIP contains **one** root `hni/` application, derived directly from the original Stage 01 ZIP. React 18 + TypeScript strict + Vite + HashRouter + Zod + Vitest remain. Source files are divided into `src/app`, `src/components`, eight `src/modules` groups, `src/domain`, `src/data`, `src/services`, and `src/tests`. Research manifests and locators remain in `research/`; GitHub Pages uses `.github/workflows/deploy.yml`.

**Eight protected modules:** Intelligence Command Center, The 18 Laws Library, Human Behavior Atlas, Historical Case Studies, Interactive Knowledge Network, Behavioral Simulation Lab, Science/Evidence/Criticism, Intelligence Academy. Graph visualization still belongs to Stage 08; advanced simulations and Academy to Stage 09; external scientific review to Stage 07. Source registry, settings, search, and detail routes are also preserved.

## 2. Dependency and build status

- **PASS:** `npm run validate:data` — 0 errors, 16 intentional metadata-only chapter warnings.
- **PASS:** `npm run test:offline` — 19/19 actual dependency-free Node tests.
- **PASS:** static TS/TSX parser on 36 source files, 97 relative import checks, CSS parser and YAML parser. These are not equivalent to full typechecking or browser compilation.
- **BLOCKED:** npm installation/lockfile creation, `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test` (Vitest) and `npm run build`. Registry DNS failed and offline cache is inadequate. No genuine lockfile present.
- **NOT RUN:** compiled browser smoke tests, iPhone Safari, responsive visual assertions, GitHub Actions execution or deployment.

**Required Stage 02 preflight:** from inside extracted `hni/` with Node >=22.16 and npm registry access, run `npm install` (real lockfile), `npm ci`, `npm run typecheck`, `npm run lint`, `npm run validate:data`, `npm run test:offline`, `npm run test`, `npm run build`. Fix actual failures; preserve resulting lockfile in every later ZIP. CI now fails intentionally without it. Do not infer successful build from this handoff.

## 3. Canonical contracts (do not reseed)

- Laws `LAW-01` … `LAW-18`. Other stable prefixes: `CON-`, `CAS-`, `CLM-`, `SRC-`, `REF-`, `RES-`, `EDG-`, `EXR-`, `PATH-`, each with four numeric digits.
- `src/domain/schemas.ts` defines runtime Zod records. `src/domain/validator.ts` and `scripts/validate-data.mjs` enforce integrity. Dataset manifest schema remains **1**. User progress schema remains **1** at key `hni.user-progress.v1`.
- Research statuses are separate: **provenance** (`directly_inspected` etc.), **scientific evidence** (`not_assessed` etc.) and **editorial coverage** (`partially_reviewed` etc.). Do not conflate them or upgrade statuses without reading source material.
- `REF` → actual `SourceReference.sourceId` → `SRC` → source registry detail. Never hardcode `SRC-0001` for an edge. `src/services/source-resolution.ts` and `src/services/source-labels.ts` implement this rule.
- `pdfPageIndex` is zero-based; viewer page is +1 only for the corresponding PDF. The known Greene PDF has 690 pages; that bound applies to `SRC-0001`, **not** to other research documents. Printed pages remain unverified unless explicitly recorded.
- Typed knowledge edges preserve explicit endpoints, relationship types, provenance, and real locator references.
- User imports are version-checked, staged, confirmed, then saved before replacing visible state. Preserve corrupt stored data, honor failed writes, and never permit progress import to mutate bundled research.

## 4. Protected existing functionality

Keep real implementations of: eight routes, law/concept/case/source/claim detail pages, canonical search, relationship list, bookmarks, recently viewed records, Academy question, fictional simulation, local progress, versioned JSON export/import, source registry, responsive dark shell and GitHub Pages HashRouter configuration.

## 5. Source research starting point

- 18 chapters and 60 major subsection headings were indexed from the original 690-page uploaded PDF in Stage 01.
- Original PDF SHA-256: `e3ce8025644078a192204f200b428e8f8346c7108571307f414b40a92c175c7e`.
- Copyright page identifies Viking/Penguin Random House, 2018, but the PDF's precise print-format ISBN remains unestablished.
- **LAW-01 and LAW-02 remain partially reviewed.** Laws 03–18 remain metadata-only/awaiting comprehensive research. Stage 1B did **not** do Laws 1–4 ingestion.
- Preserved dataset counts: **18 laws, 3 concepts, 1 case, 2 claims, 1 source, 6 references, 4 knowledge edges, 1 exercise, 1 path, 0 research findings**.
- `src/data/*.json` and `research/*.json` were proven **byte-for-byte identical to the Stage 01 ZIP**. No historical sources, empirical findings or original-book quotations were fabricated.

## 6. Technical work still outstanding

**P0:** obtain real dependency lock, `npm ci`, full TS/lint/Vitest/Vite build verification.  
**P1:** test actual compiled navigation including source resolution and import confirmation; handle any genuine runtime errors found.  
**P2:** browser viewport checks at 375/390/430 px and desktop, accessible native dialog behavior and real Safari as available.  
**Release:** verify CI on an actual GitHub runner; no deployment during 1B.

## 7. Exact Stage 02 continuation steps

1. Open the **actual** `HNI_STAGE_01B_REPAIRED_UNVERIFIED_SOURCE.zip` and read this Stage 1B handoff plus verification and repair log. Do not start over.
2. Read the original book PDF and verify edition/source locators for any research material added. Do not rely only on remembered or derivative summaries.
3. Complete the P0 npm and build verification above; correct any errors without deleting stable data or modules.
4. Preserve every canonical record, ID, provenance status, and existing working interaction, including the Stage 1B repairs.
5. Execute the **previously planned Prompt 02** research mission: deep research and historical intelligence for **Laws 1–4**, grounded in the actual PDF, with careful distinction between Greene's interpretation and independently verified evidence.
6. Append substantive concepts, case records, claims, source references, relationships, and research exercises; update corresponding ledgers and coverage using verified locators. Do not reassign previous IDs.
7. Run all available validations and build checks, verify the interface, and issue honest status reports.
8. Deliver one **cumulative** `HNI_STAGE_02_SOURCE.zip`, with current handoff and research manifests, no previous nested ZIPs or duplicate project.

Stage 02 should proceed from this repaired foundation **while treating unverified dependency/build gates as unresolved**, never as tacit PASS.
