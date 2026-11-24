// Network-enabled CI executes this against both compiled hosting targets.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { verifyBuild } from './verify-build.mjs';
const json=name=>JSON.parse(readFileSync(new URL(`../src/data/${name}.json`,import.meta.url),'utf8'));
const paths=json('learning-paths'), exercises=json('exercises'), scenarios=json('scenarios').scenarios;
const widths=[320,375,390,430,768,1440];
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.png':'image/png'};
const key='hni.user-progress.v1';
const routes=['/','/laws','/laws/LAW-01','/atlas','/atlas/CON-0001','/cases','/cases/CAS-0001','/network','/lab','/lab/SIM-0001','/evidence','/evidence/CLM-0001','/evidence/findings/RES-0001','/academy','/academy/path/PATH-0001',`/academy/path/${paths[0].id}/lesson/${paths[0].lessons[0].id}`,'/academy/exercise/EXR-0001','/sources','/sources/SRC-0001','/compare','/atlas/compare','/search?q=confirmation','/settings'];
mkdirSync('browser-evidence',{recursive:true});
async function serve(target){
 const {base,outDir}=verifyBuild(target), root=resolve(outDir);
 const server=createServer((req,res)=>{
  try{const pathname=new URL(req.url,'http://localhost').pathname;if(!pathname.startsWith(base)){res.writeHead(404).end();return;}
   const file=resolve(root,decodeURIComponent(pathname.slice(base.length))||'index.html');
   if(relative(root,file).startsWith('..')||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404).end();return;}
   res.setHeader('Content-Type',mime[extname(file)]??'application/octet-stream');createReadStream(file).pipe(res);
  }catch{res.writeHead(400).end();}
 });server.listen(0,'127.0.0.1');await once(server,'listening');return {server,url:`http://127.0.0.1:${server.address().port}${base}`};
}
async function verify(target,browser){
 const {server,url}=await serve(target);const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();page.setDefaultTimeout(15000);const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.url().startsWith(url)&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 // Full navigation reload so each direct deep link is tested independently.
 async function open(route){await page.goto(`${url}#${route}`);await page.reload();await page.locator('main').waitFor();await page.locator('main h1').first().waitFor();assert.equal(new URL(page.url()).hash,`#${route}`,`Unexpected route redirect: ${route}`);}
 async function stored(){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'null'),key);}
 try{
  for(const width of widths){await page.setViewportSize({width,height:width>800?1000:844});for(const route of routes){await open(route);const title=await page.locator('main h1').first().innerText();assert(title.trim(),`${route}: missing title`);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);assert(overflow<=2,`${target} ${width}px ${route}: horizontal overflow ${overflow}px`);}
   await open('/');await page.screenshot({path:`browser-evidence/${target}-${width}-home.png`});console.log(`${target}: ${width}px, ${routes.length} direct routes loaded without document overflow`);
  }
  await page.setViewportSize({width:390,height:844});await open('/');await page.getByRole('button',{name:'Open menu'}).click();assert.equal(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
  await open('/laws/LAW-01');const bookmark=page.getByRole('button',{name:'Add bookmark'});if(await bookmark.count())await bookmark.click();await page.getByRole('button',{name:'Remove bookmark'}).waitFor();await page.reload();await page.getByRole('button',{name:'Remove bookmark'}).waitFor();assert((await stored()).bookmarks.includes('LAW-01'));
  await page.locator('main a[href="#/atlas/CON-0001"]').first().click();await page.waitForURL('**#/atlas/CON-0001');await page.locator('main a[href="#/sources/SRC-0001"]').first().click();await page.waitForURL('**#/sources/SRC-0001');
  await open('/network');await page.getByRole('button',{name:'Accessible list',exact:true}).click();await page.getByRole('button',{name:'Inspect relationship & sources'}).first().click();await page.getByRole('button',{name:'Hide source details'}).waitFor();
  await open('/search?q=confirmation');assert(await page.locator('.discovery-result').count()>0);
  // Test each exercise format using canonical choices; save and reload a supported answer.
  for(const type of ['multiple_choice','evidence_classification','multiple_interpretations']){
   const ex=exercises.find(e=>e.exerciseType===type);await open(`/academy/exercise/${ex.id}`);
   for(const id of ex.evaluationRules.correctChoiceIds){const index=ex.choices.findIndex(c=>c.id===id);await page.locator('.academy-question fieldset input').nth(index).check();}
   await page.getByLabel('Save this answer locally').check();await page.getByRole('button',{name:'Submit answer'}).click();await page.locator('.academy-feedback').waitFor();assert((await stored()).completedExercises.includes(ex.id));await page.reload();await page.getByText('Previously completed.',{exact:false}).waitFor();
  }
  // Verify canonical lesson-to-simulation and comparison return journeys.
  const learningPath=paths.find(p=>p.lessons.some(l=>l.scenarioIds.length));const lesson=learningPath.lessons.find(l=>l.scenarioIds.length);
  await open(`/academy/path/${learningPath.id}/lesson/${lesson.id}`);await page.locator(`main a[href="#/lab/${lesson.scenarioIds[0]}?path=${learningPath.id}&lesson=${lesson.id}"]`).click();await page.getByRole('link',{name:'Return to lesson',exact:true}).click();await page.waitForURL(`**#/academy/path/${learningPath.id}/lesson/${lesson.id}`);
  const pairPath=paths.find(p=>p.lessons.some(l=>l.exerciseIds.some(id=>exercises.find(e=>e.id===id).relatedConceptIds.length>=2)));const pairLesson=pairPath.lessons.find(l=>l.exerciseIds.some(id=>exercises.find(e=>e.id===id).relatedConceptIds.length>=2));const pairExercise=pairLesson.exerciseIds.find(id=>exercises.find(e=>e.id===id).relatedConceptIds.length>=2);
  const exerciseRoute=`/academy/exercise/${pairExercise}?path=${pairPath.id}&lesson=${pairLesson.id}`;await open(exerciseRoute);await page.getByRole('link',{name:'Compare related concepts'}).click();await page.getByRole('link',{name:'Return to Academy question'}).click();await page.waitForURL(`**#${exerciseRoute}`);
  // Complete all six simulations, following actual offered controls (branching allowed).
  for(const s of scenarios){await open(`/lab/${s.id}`);await page.getByLabel('Save this investigation locally').check();await page.getByRole('button',{name:'Begin investigation'}).click();let steps=0;
   while(!(await page.getByRole('heading',{name:'Investigation complete'}).count())){assert(++steps<=s.steps.length,`${s.id}: scenario exceeded bounded steps`);await page.locator('.sim-choices input').first().check();await page.getByRole('button',{name:'Submit reasoning'}).click();await page.getByRole('heading',{name:'Reasoning feedback'}).waitFor();await page.getByRole('button',{name:/Continue investigation|View final analysis/}).click();}
   assert((await stored()).scenarioProgress[s.id].history.length>=6);await page.reload();await page.getByRole('heading',{name:'Investigation complete'}).waitFor();
  }
  // Export existing progress, then prove cancellation and confirmed restore.
  await open('/settings');const before=await stored();const downloading=page.waitForEvent('download');await page.getByRole('button',{name:'Export progress JSON'}).click();const download=await downloading;const backupPath=`browser-evidence/${target}-test-backup.json`;await download.saveAs(backupPath);const exported=JSON.parse(readFileSync(backupPath,'utf8'));assert.deepEqual(exported.progress,before);
  const replacement={...exported,progress:{...before,bookmarks:[]}};
  const file=page.locator('input[type=file]');await file.setInputFiles({name:'replacement.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(replacement))});await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.deepEqual(await stored(),before);
  await file.setInputFiles({name:'replacement.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(replacement))});await page.getByRole('button',{name:'Confirm replacement'}).click();assert.deepEqual(await stored(),replacement.progress);
  await file.setInputFiles(backupPath);await page.getByRole('button',{name:'Confirm replacement'}).click();assert.deepEqual(await stored(),before);
  assert.deepEqual(errors,[],`${target}: browser console/asset failures`);console.log(`${target}: critical browser interactions PASS`);
 }catch(error){await page.screenshot({path:`browser-evidence/${target}-failure.png`,fullPage:false}).catch(()=>{});throw error;}finally{await context.close();server.close();}
}
const browser=await chromium.launch();try{for(const target of ['github','netlify'])await verify(target,browser);}finally{await browser.close();}
