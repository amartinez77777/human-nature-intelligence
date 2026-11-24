/** Single source of truth for isolated static hosting targets. */
export function resolveBuildTarget(mode, override) {
  if (mode === 'netlify') return { base: '/', outDir: 'dist/netlify' };
  const base = override ?? '/human-nature-intelligence/';
  if (!/^\/(?:[A-Za-z0-9._-]+\/)?$/.test(base) || base === '/../' || base === '/./') throw Error('HNI_GITHUB_BASE must be / or /repository-name/');
  return { base, outDir: 'dist/github' };
}
