import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {resolveBuildTarget} from './build-target.mjs';
import {verifyBuild} from './verify-build.mjs';
import {academyReturnUrl} from '../src/services/academy-navigation.ts';
import {readRawProgress,readStoredProgress,STORE_KEY} from '../src/services/progress-storage.ts';
const read=name=>JSON.parse(readFileSync(new URL(`../src/data/${name}.json`,import.meta.url),'utf8'));
test('build targets use isolated output directories and correct default bases',()=>{
 assert.deepEqual(resolveBuildTarget('github'),{base:'/human-nature-intelligence/',outDir:'dist/github'});
 assert.deepEqual(resolveBuildTarget('netlify','/ignored/'),{base:'/',outDir:'dist/netlify'});
 assert.equal(resolveBuildTarget('production','/renamed-repo/').base,'/renamed-repo/');
 assert.equal(resolveBuildTarget('github','/').base,'/');
});
test('build target rejects invalid or traversing overrides',()=>{for(const base of ['https://example.com','repo','/../','/a/b/','//','/./','/a?b/'])assert.throws(()=>resolveBuildTarget('github',base),/HNI_GITHUB_BASE/);});
function fixture(target,base,fn){const root=mkdtempSync(join(tmpdir(),'hni-build-fixture-'));try{const folder=join(root,resolveBuildTarget(target,base).outDir);mkdirSync(join(folder,'assets'),{recursive:true});writeFileSync(join(folder,'assets','a.js'),'/* synthetic test fixture */');writeFileSync(join(folder,'assets','a.css'),'/* synthetic test fixture */');fn(root,folder);}finally{rmSync(root,{recursive:true,force:true});}}
const html=base=>`<script type="module" src="${base}assets/a.js"></script><link rel="stylesheet" href="${base}assets/a.css">`;
test('artifact validator checks correct assets for both targets using explicit synthetic fixtures',()=>{for(const [target,base] of [['github','/example/'],['netlify','/']])fixture(target,base,(root,folder)=>{writeFileSync(join(folder,'index.html'),html(base));assert.equal(verifyBuild(target,root,base).assets.length,2);});});
test('artifact validator rejects missing assets and wrong base',()=>fixture('github','/example/',(root,folder)=>{writeFileSync(join(folder,'index.html'),html('/'));assert.throws(()=>verifyBuild('github',root,'/example/'),/Wrong base/);writeFileSync(join(folder,'index.html'),html('/example/'));rmSync(join(folder,'assets/a.js'));assert.throws(()=>verifyBuild('github',root,'/example/'),/Missing or unsafe asset/);}));
test('artifact validator rejects source-only HTML or empty assets',()=>fixture('netlify','/',(root,folder)=>{writeFileSync(join(folder,'index.html'),'<script src="/src/main.tsx"></script>');assert.throws(()=>verifyBuild('netlify',root),/Missing compiled/);writeFileSync(join(folder,'index.html'),html('/'));writeFileSync(join(folder,'assets/a.js'),'');assert.throws(()=>verifyBuild('netlify',root),/Missing or unsafe/);}));
test('Academy comparison return retains actual lesson membership',()=>{const paths=read('learning-paths'),exercises=read('exercises'),path=paths[0],lesson=path.lessons[0],id=lesson.exerciseIds[0];assert.equal(academyReturnUrl(new URLSearchParams({exercise:id,path:path.id,lesson:lesson.id}),exercises,paths),`/academy/exercise/${id}?path=${path.id}&lesson=${lesson.id}`);});
test('Academy return rejects unknown exercise and drops invalid context safely',()=>{const paths=read('learning-paths'),exercises=read('exercises'),id=exercises[0].id;assert.equal(academyReturnUrl(new URLSearchParams({exercise:'EXR-9999'}),exercises,paths),undefined);assert.equal(academyReturnUrl(new URLSearchParams({exercise:id,path:'PATH-9999',lesson:'LES-9999'}),exercises,paths),`/academy/exercise/${id}`);});
test('raw recovery preserves exact corrupt bytes and does not write storage',()=>{const raw='{bad JSON\n';let writes=0;const storage={getItem:key=>{assert.equal(key,STORE_KEY);return raw;},setItem:()=>{writes++;}};assert.equal(readStoredProgress(storage).status,'corrupt');assert.equal(readRawProgress(storage),raw);assert.equal(writes,0);});
test('raw recovery propagates read failure and missing payload without fabricating backup',()=>{assert.throws(()=>readRawProgress({getItem:()=>{throw Error('storage denied');}}),/storage denied/);assert.equal(readRawProgress({getItem:()=>null}),null);});
