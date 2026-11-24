# HNI — STAGE 03 COMPARISON AUDIT

**Status:** Four curated, versioned, read-only comparative records are integrated into the existing React Human Behavior Atlas. **Their UI was statically inspected but NOT compiled or browser-tested.**

## Contract and implementation

`src/data/concept-comparisons.json` uses `{ "schemaVersion": 1, "comparisons": [ … ] }` and immutable IDs `CMP-0001`–`CMP-0004`. Runtime Zod validators reside in `src/domain/schemas.ts` and integrate with the typed repository and the general `validateDataset` validator; dependency-free `scripts/validate-comparisons.mjs` detects duplicate IDs, missing concepts/laws/REF links, unsupported schema versions, same-concept endpoints and incomplete written distinctions. Tests use independent failing fixtures.

The new `src/modules/behavior-atlas/ConceptComparisons.tsx` component is routed at `#/atlas/compare` with native accessible dropdown selection and two linked canonical concept columns, fictional illustration, caution, attributed law context and source locators. The Atlas index and Command Center link to it. Unsupported pairings are **not** silently generated; only curated pairs appear. The eight original module identities remain unchanged.

| Comparison | Canonical endpoints | Source law | Boundary |
|---|---|---|---|
| CMP-0001 · Desire vs. need | CON-0013 / CON-0014 | LAW-05 | Symbolic anticipation is not equivalent to material necessity |
| CMP-0002 · Persuasion vs. coercion | CON-0020 / CON-0021 | LAW-07 | Real refusal and informed choice differ from threats |
| CMP-0003 · Immediate rewards vs. decision horizon | CON-0017 / CON-0016 | LAW-06 | Salient present rewards are not automatically poor decisions |
| CMP-0004 · Interpretive attitude vs. external circumstance | CON-0023 / CON-0024 | LAW-08 | Mental interpretation does not eliminate structural or material constraints |

Each pairing has original editorial contrast text, side-specific interpretive questions, an explicitly fictional illustration, ethical limitation, law IDs and actual REF IDs linked to `SRC-0001`. A reference to Greene’s argument **does not certify** an independent psychological finding.

## Verification

- PASS: `npm run validate:data`, including 4/4 comparisons through the independent validator and 0 dataset errors.
- PASS: `npm run test:offline`: 32/32; 4 new comparison and dataset regression checks including broken IDs and unsupported version.
- STATICALLY INSPECTED: comparison TSX syntax parses; imports resolve; responsive two-column CSS collapses to one column at narrow widths.
- BLOCKED: Zod-backed React render, Vitest component tests, Vite build, browser interactions and real iPhone tap/screen-size testing.

**Important technical debt:** Run full `npm ci`, `typecheck`, `lint`, `test` and `build` in a registry-connected environment before claiming the comparison interaction works at runtime. Do not convert future comparisons into unsourced auto-generated text.
