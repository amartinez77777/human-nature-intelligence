import { readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolveBuildTarget } from './build-target.mjs';
export function verifyBuild(mode, root=process.cwd(), override=process.env.HNI_GITHUB_BASE) {
  const {base,outDir}=resolveBuildTarget(mode,override), dir=resolve(root,outDir);
  const html=readFileSync(resolve(dir,'index.html'),'utf8');
  const assets=[...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(m=>m[1]).filter(s=>/\.(?:js|css)(?:\?|$)/.test(s));
  if(!assets.some(s=>s.endsWith('.js'))||!assets.some(s=>s.endsWith('.css')))throw Error('Missing compiled JS or CSS entry');
  for(const url of assets){
    if(!url.startsWith(base))throw Error(`Wrong base: ${url}`);
    const path=resolve(dir,url.slice(base.length).split('?')[0]);
    if(relative(dir,path).startsWith('..')||!existsSync(path)||!statSync(path).isFile()||statSync(path).size===0)throw Error(`Missing or unsafe asset: ${url}`);
  }
  return {base,outDir,assets};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const target=process.argv[2];if(!['github','netlify'].includes(target))throw Error('Expected github or netlify');console.log('Compiled artifact check:',verifyBuild(target));}
