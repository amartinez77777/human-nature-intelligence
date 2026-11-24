import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import process from 'node:process';
import { resolveBuildTarget } from './scripts/build-target.mjs';
export default defineConfig(({ mode }) => {
  const target = resolveBuildTarget(mode, process.env.HNI_GITHUB_BASE);
  return { plugins: [react()], base: target.base, build: { outDir: target.outDir, emptyOutDir: true }, test: { environment: 'node', include: ['src/tests/**/*.test.ts'] } };
});
