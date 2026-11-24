import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {readFileSync} from 'node:fs';
import {readData,validateData} from './validate-data.mjs';
const clone=()=>structuredClone(readData());
test('cumulative dataset passes integrity checks and only unreviewed laws trigger research warnings',()=>{const d=clone();const r=validateData(d);assert.equal(r.valid,true);assert.equal(r.warnings.length,d.laws.filter(l=>l.editorialStatus==='awaiting_review').length);});
test('duplicate IDs are rejected',()=>{const d=clone();d.laws[1].id='LAW-01';assert(validateData(d).errors.some(e=>e.code==='DUPLICATE_ID'));});
test('missing foreign keys are rejected',()=>{const d=clone();d.laws[0].relatedConceptIds=['CON-9999'];assert(validateData(d).errors.some(e=>e.code==='BROKEN_REFERENCE'));});
test('invalid graph endpoint is rejected',()=>{const d=clone();d.knowledgeEdges[0].toEntityId='CON-9999';assert(validateData(d).errors.some(e=>e.code==='INVALID_EDGE_ENDPOINT'));});
test('invalid PDF locators are rejected',()=>{const d=clone();d.sourceReferences[0].pdfPageIndex=900;assert(validateData(d).errors.some(e=>e.code==='INVALID_SOURCE_LOCATOR'));});
test('incompatible schema version is rejected',()=>{const d=clone();d.manifest.schemaVersion=99;assert(validateData(d).errors.some(e=>e.code==='INVALID_SCHEMA_VERSION'));});
test('invalid exercises are rejected',()=>{const d=clone();d.exercises[0].evaluationRules.correctChoiceIds=['Z'];assert(validateData(d).errors.some(e=>e.code==='INVALID_EXERCISE_ANSWER'));});
test('invalid provenance is rejected',()=>{const d=clone();d.historicalCases[0].verificationStatus='peer_reviewed';assert(validateData(d).errors.some(e=>e.code==='INVALID_PROVENANCE'));});

// Real dependency-free functions used by the React app. Node 22.16+ strips TS types.
const {normalizeProgress,commitProgressReplacement}=await import('../src/services/progress-validation.ts');
const {extractBackupProgress}=await import('../src/services/backup-envelope.ts');
const {resolveSourceReference,referenceSourceUrl}=await import('../src/services/source-resolution.ts');
const {sourceLabel,locatorLabel}=await import('../src/services/source-labels.ts');
const sampleProgress=()=>({schemaVersion:1,bookmarks:['LAW-01','LAW-01','CON-0001'],recentlyViewed:['LAW-01','LAW-01'],completedExercises:['EXR-0001','EXR-0001'],learningProgress:{'PATH-0001':true}});
test('import format accepts a valid HNI progress backup and deduplicates data',()=>{
 const text=JSON.stringify({format:'hni-progress',progress:sampleProgress()});
 const restored=normalizeProgress(extractBackupProgress(text));
 assert.deepEqual(restored.bookmarks,['LAW-01','CON-0001']);
 assert.deepEqual(restored.completedExercises,['EXR-0001']);
 assert.deepEqual(restored.recentlyViewed,['LAW-01']);
});
test('backup import rejects corrupt JSON, empty data, and research payloads',()=>{
 assert.throws(()=>extractBackupProgress('{missing'),/valid JSON/);
 assert.throws(()=>extractBackupProgress(' '),/empty/);
 assert.throws(()=>extractBackupProgress('{"format":"hni-research","progress":{}}'),/Not an HNI/);
});
test('backup import rejects absent fields and future schema versions',()=>{
 assert.throws(()=>normalizeProgress({...sampleProgress(),schemaVersion:3}),/Unsupported/);
 const bad=sampleProgress();delete bad.learningProgress;
 assert.throws(()=>normalizeProgress(bad),/learning progress/);
});
test('backup import rejects bogus IDs and unsafe learning-progress values',()=>{
 assert.throws(()=>normalizeProgress({...sampleProgress(),bookmarks:['XYZ-9999']}),/bookmarks/);
 assert.throws(()=>normalizeProgress({...sampleProgress(),learningProgress:{'PATH-0001':'yes'}}),/learning progress/);
});
test('cancelled import retains existing progress without attempting a storage write',()=>{
 const original=sampleProgress();let writes=0;
 const result=commitProgressReplacement(original,{...original,bookmarks:[]},false,()=>{writes++;return true;});
 assert.equal(result.status,'cancelled');assert.equal(result.value,original);assert.equal(writes,0);
});
test('confirmed import only replaces existing state after a successful storage write',()=>{
 const original=sampleProgress();const newer={...original,bookmarks:[]};
 const failed=commitProgressReplacement(original,newer,true,()=>false);
 assert.equal(failed.status,'storage_error');assert.equal(failed.value,original);
 const success=commitProgressReplacement(original,newer,true,()=>true);
 assert.equal(success.status,'saved');assert.equal(success.value,newer);
});
test('progress export envelope roundtrips without losing valid data',()=>{
 const current=normalizeProgress(sampleProgress());
 const exported=JSON.stringify({format:'hni-progress',exportedAt:new Date(0).toISOString(),progress:current});
 assert.deepEqual(normalizeProgress(extractBackupProgress(exported)),current);
});
test('source reference resolution chooses correct source for multiple independent sources',()=>{
 const sources=[
  {id:'SRC-0001',author:'Test author A',title:'Fixture book',sourceType:'book',verificationStatus:'directly_inspected'},
  {id:'SRC-0002',author:'Test author B',title:'Fixture article',sourceType:'journal_article',verificationStatus:'unverified'}
 ];
 const refs=[{id:'REF-0001',sourceId:'SRC-0001',pdfPageIndex:4,printedPage:null,verificationStatus:'directly_inspected'},
  {id:'REF-0002',sourceId:'SRC-0002',pdfPageIndex:null,printedPage:'27',verificationStatus:'unverified'}];
 assert.equal(resolveSourceReference('REF-0001',refs,sources).source.id,'SRC-0001');
 assert.equal(resolveSourceReference('REF-0002',refs,sources).source.id,'SRC-0002');
 assert.equal(referenceSourceUrl('REF-0002',refs,sources),'/sources/SRC-0002');
 assert.match(sourceLabel(sources[1]),/Journal article.*Unverified/);
 assert.match(locatorLabel(refs[1]),/Printed page 27/);
});
test('missing or corrupted source foreign keys never silently navigate to an unrelated source',()=>{
 const sources=[{id:'SRC-0001'}];
 const refs=[{id:'REF-0002',sourceId:'SRC-9999'}];
 assert.equal(resolveSourceReference('REF-0002',refs,sources),null);
 assert.equal(referenceSourceUrl('REF-9999',refs,sources),null);
});
test('future web sources may cite sections without assuming the 690-page book PDF',()=>{
 const d=clone();d.sources.push({id:'SRC-0999',author:'Fixture author',title:'Fixture web article',publicationYear:2024,edition:null,publisherOrJournal:null,isbnOrDoi:null,verifiedUrl:'https://example.com/fixture',sourceType:'web',verificationStatus:'unverified'});
 d.sourceReferences.push({id:'REF-9999',sourceId:'SRC-0999',chapter:null,section:'Methods',pdfPageIndex:null,printedPage:null,locatorNotes:'Example test locator only',verificationStatus:'unverified'});
 assert.equal(validateData(d).valid,true);
});

test('rejects unsafe source URL schemes',()=>{const d=clone();d.sources[0].verifiedUrl='javascript:alert(1)';assert(validateData(d).errors.some(e=>e.code==='INVALID_SOURCE_URL'));});

// Stage 02 integration: research is connected to existing canonical repository contracts.
test('Stage 02 preserves all original stable IDs and supplies four linked dossiers',()=>{
 const d=clone();
 assert.deepEqual(d.laws.map(x=>x.id),Array.from({length:18},(_,i)=>`LAW-${String(i+1).padStart(2,'0')}`));
 for(const n of [1,2,3,4]){
  const law=d.laws[n-1];
  assert.equal(law.editorialStatus,'partially_reviewed');
  assert(law.explanation.length>1900,`LAW-${n} dossier must be substantive`);
  assert(law.relatedConceptIds.length>=2);
  assert(law.exerciseIds.length>=2);
  assert(law.sourceReferenceIds.length>=3);
  for(const rid of law.sourceReferenceIds)assert(d.sourceReferences.some(r=>r.id===rid));
 }
});
test('every Stage 02 canonical reference resolves to the intended real book source',()=>{
 const d=clone();
 for(const law of d.laws.slice(0,4))for(const id of law.sourceReferenceIds){
  const resolved=resolveSourceReference(id,d.sourceReferences,d.sources);
  assert(resolved,`${law.id} missing ${id}`);
  assert.equal(resolved.source.id,'SRC-0001');
  assert.equal(referenceSourceUrl(id,d.sourceReferences,d.sources),'/sources/SRC-0001');
 }
});
test('new case interpretations are book-based, not fake independent historical facts',()=>{
 const d=clone();
 for(const c of d.historicalCases){
  assert.equal(c.verificationStatus,'secondary_source_account');
  if(!['CAS-0001','CAS-0013','CAS-0015','CAS-0016','CAS-0018'].includes(c.id))assert.deepEqual(c.documentedFacts,[]);
  assert(c.sourceReferenceIds.length>0);
 }
 for(const clm of d.claims.filter(c=>!c.researchFindingIds.length))assert.equal(clm.evidenceStatus,'not_assessed');
 assert.equal(d.researchFindings.filter(f=>!/^RES-000[1-6]$/.test(f.id)).length,0);
});
test('Stage 02 educational question links and correct answers are referentially sound',()=>{
 const d=clone();const exerciseIds=new Set(d.exercises.map(e=>e.id));
 for(const l of d.laws.slice(0,4))for(const id of l.exerciseIds)assert(exerciseIds.has(id));
 for(const ex of d.exercises){
  const correct=ex.evaluationRules.correctChoiceIds;
  assert(correct.length>0);
  assert(correct.every(id=>ex.choices.some(c=>c.id===id)));
  assert(ex.sourceReferenceIds.length>0);
 }
});
test('Stage 02 authored edges never introduce unsupported relationship types',()=>{
 const d=clone();const allowed=new Set(['illustrates','explores','supports','contradicts','complements','qualifies','extends','alternative_to','related_to','shared_foundation']);
 assert(d.knowledgeEdges.every(e=>allowed.has(e.relationshipType)));
 assert(validateData(d).valid);
});

// Stage 03: versioned comparisons and substantive law dossiers, independently tested without npm dependencies.
const {validateComparisons}=await import('./validate-comparisons.mjs');
const fresh=()=>({raw:JSON.parse(readFileSync(new URL('../src/data/concept-comparisons.json',import.meta.url),'utf8')),d:clone()});
test('Stage 03 four canonical law dossiers are substantial and retain all original 18 IDs',()=>{
 const d=clone();assert.equal(d.laws.length,18);
 for(let n=5;n<=8;n++){
  const law=d.laws[n-1];assert.equal(law.id,`LAW-${String(n).padStart(2,'0')}`);
  assert.equal(law.editorialStatus,'partially_reviewed');
  assert(law.explanation.trim().split(/\s+/).length>=470);
  assert(law.relatedConceptIds.length>=3);assert(law.historicalCaseIds.length>=1);
  assert(law.sourceReferenceIds.length>=6);assert(law.exerciseIds.length>=2);
  assert(law.sourceReferenceIds.every(id=>d.sourceReferences.some(ref=>ref.id===id)));
 }
});
test('Stage 03 historical cases are attributed accounts, not fake verified facts',()=>{
 const d=clone();for(const row of d.historicalCases.slice(4)){
  assert.equal(row.verificationStatus,'secondary_source_account');if(!['CAS-0013','CAS-0015','CAS-0016','CAS-0018'].includes(row.id))assert.deepEqual(row.documentedFacts,[]);
  assert(row.sourceReferenceIds.length>=3);
 }
 assert.equal(d.researchFindings.filter(f=>!/^RES-000[1-6]$/.test(f.id)).length,0);
});
test('Stage 03 comparison records are canonical and source grounded',()=>{
 const {raw,d}=fresh(),r=validateComparisons(raw,{concepts:d.concepts,laws:d.laws,refs:d.sourceReferences});
 assert.equal(r.valid,true,JSON.stringify(r.errors));assert.equal(raw.schemaVersion,1);assert.equal(raw.comparisons.length,4);
});
test('Stage 03 comparison validator rejects duplicates, bad concepts, and invalid sources',()=>{
 const {raw,d}=fresh();raw.comparisons[1].id=raw.comparisons[0].id;
 raw.comparisons[2].leftConceptId='CON-9999';raw.comparisons[3].sourceReferenceIds=['REF-9999'];
 const r=validateComparisons(raw,{concepts:d.concepts,laws:d.laws,refs:d.sourceReferences});
 for(const err of ['DUPLICATE_COMPARISON','INVALID_CONCEPT_ENDPOINT','INVALID_REFERENCE'])assert(r.errors.some(e=>e.includes(err)),err);
});
test('Stage 03 comparison validator rejects unsupported schema revisions',()=>{
 const {raw,d}=fresh();raw.schemaVersion=2;
 const r=validateComparisons(raw,{concepts:d.concepts,laws:d.laws,refs:d.sourceReferences});
 assert(r.errors.some(e=>e.includes('INVALID_COMPARISON_SCHEMA')));
});
test('Stage 03 cross-law relationships preserve approved edge types and valid endpoints',()=>{
 const d=clone();assert.equal(validateData(d).valid,true);
 const newer=d.knowledgeEdges.filter(e=>Number(e.id.slice(-4))>21);
 assert(newer.some(e=>e.fromEntityId==='LAW-08'&&e.toEntityId==='LAW-04'));
 assert(newer.some(e=>e.fromEntityId==='LAW-07'&&e.toEntityId==='LAW-02'));
 assert(newer.every(e=>e.explanation.length>30&&e.sourceReferenceIds.length));
});
test('Stage 03 source locator lineage is zero-based and within the exact PDF chapters',()=>{
 const d=clone();for(let n=5;n<=8;n++){
  const refs=d.laws[n-1].sourceReferenceIds.map(id=>d.sourceReferences.find(r=>r.id===id));
  assert.equal(refs.length,6);assert(refs.every(r=>r.sourceId==='SRC-0001'&&r.pdfPageIndex>=0&&r.pdfPageIndex<690));
  assert(refs.every(r=>r.printedPage===null));
 }
});
test('Stage 03 preserves migration from version 1 progress, import confirmation or two-source resolver',()=>{
 assert.equal(normalizeProgress(sampleProgress()).schemaVersion,2);
 const original=sampleProgress();assert.equal(commitProgressReplacement(original,{...original,bookmarks:[]},false,()=>{throw Error('must not persist');}).value,original);
 const fakeSources=[{id:'SRC-0001'},{id:'SRC-0002'}];const fakeRefs=[{id:'REF-0001',sourceId:'SRC-0001'},{id:'REF-0002',sourceId:'SRC-0002'}];
 assert.equal(resolveSourceReference('REF-0002',fakeRefs,fakeSources).source.id,'SRC-0002');
});

// Stage 04: direct book-backed research, source separation and reliable perspective modeling.
const {summarizePerspectives}=await import('../src/services/perspective-model.ts');
test('Stage 04 laws 9–12 contain substantive critical dossiers with stable IDs',()=>{
 const d=clone();assert.equal(d.laws.length,18);
 for(let n=9;n<=12;n++){
  const law=d.laws[n-1];assert.equal(law.id,`LAW-${String(n).padStart(2,'0')}`);
  assert.equal(law.editorialStatus,'partially_reviewed');
  assert(law.explanation.split(/\s+/).length>=475,law.id+' short explanation');
  assert.equal(law.relatedConceptIds.length,3);assert.equal(law.historicalCaseIds.length,1);
  assert(law.sourceReferenceIds.length>=6);assert.equal(law.exerciseIds.length,3);
  assert(law.alternativeExplanations.length>=2);assert(law.limitations.length>=2);
 }
});
test('Stage 04 book reference positions are inside the exact checked chapter bounds',()=>{
 const d=clone();const map=JSON.parse(readFileSync(new URL('../research/CHAPTER_MAP.json',import.meta.url),'utf8'));
 for(let n=9;n<=12;n++){
  const chapter=map.chapters[n-1],law=d.laws[n-1];
  assert.equal(chapter.chapterTitle,law.chapterTitle);
  assert.equal(chapter.lawSubtitle,law.chapterSubtitle);
  for(const id of law.sourceReferenceIds){const ref=d.sourceReferences.find(r=>r.id===id);assert(ref,id);
   assert.equal(ref.sourceId,'SRC-0001');assert.equal(ref.printedPage,null);
   assert(ref.pdfPageIndex>=chapter.pdfStartIndexZeroBased&&ref.pdfPageIndex<=chapter.pdfEndIndexZeroBased);
   assert.equal(resolveSourceReference(id,d.sourceReferences,d.sources).source.id,'SRC-0001');}
 }
});
test('Stage 04 corrects Law 11 Practical Grandiosity heading versus inherited cross-reference',()=>{
 const map=JSON.parse(readFileSync(new URL('../research/CHAPTER_MAP.json',import.meta.url),'utf8'));
 const section=map.chapters[10].internalSections.find(s=>s.title==='Practical Grandiosity');
 assert.equal(section.pdfPageIndexZeroBased,347);assert.equal(section.pdfPageOneBased,348);
});
test('Stage 04 four cases do not conflate Greene biography with verified history or diagnosis',()=>{
 const d=clone();for(const row of d.historicalCases.filter(c=>Number(c.id.slice(-4))>=9)){
  assert.equal(row.verificationStatus,'secondary_source_account');if(!['CAS-0013','CAS-0015','CAS-0016','CAS-0018'].includes(row.id))assert.deepEqual(row.documentedFacts,[]);
  assert(row.alternativeInterpretations.length>0&&row.limitations.length>0);
  assert(row.sourceReferenceIds.every(id=>d.sourceReferences.some(r=>r.id===id)));
 }
 for(const claim of d.claims.filter(c=>Number(c.id.slice(-4))>=19)){
  if(!claim.researchFindingIds.length)assert.equal(claim.evidenceStatus,'not_assessed');assert.equal(claim.claimType,'author_argument');
  if(!claim.researchFindingIds.length)assert.equal(claim.researchFindingIds.length,0);
 }
 assert.equal(d.researchFindings.filter(f=>!/^RES-000[1-6]$/.test(f.id)).length,0);
});
test('perspective model does not mistake book attribution for empirical findings',()=>{
 const claims=[{id:'CLM-0020',statement:'Greene claim',evidenceStatus:'not_assessed',researchFindingIds:[]}];
 const m=summarizePerspectives(['CLM-0020'],claims,[]);
 assert.equal(m.evidenceLabel,'Not independently assessed');assert.equal(m.assessmentComplete,false);
 assert.equal(m.claims[0].statement,'Greene claim');assert.equal(m.findings.length,0);
});
test('perspective model only displays independently linked findings and flags broken claims',()=>{
 const claims=[{id:'CLM-1234',statement:'Fixture claim',evidenceStatus:'mixed',researchFindingIds:['RES-1234']}];
 const findings=[{id:'RES-1234',finding:'Fixture result',evidenceAssessment:'limited'}];
 const r=summarizePerspectives(['CLM-1234','CLM-9999'],claims,findings);
 assert.equal(r.evidenceLabel,'limited');assert.equal(r.assessmentComplete,true);
 assert.deepEqual(r.missingClaimIds,['CLM-9999']);assert.equal(r.findings[0].id,'RES-1234');
});
test('Stage 04 changes do not break versioned comparison data or local progress',()=>{
 const {raw,d}=fresh();assert.equal(validateComparisons(raw,{concepts:d.concepts,laws:d.laws,refs:d.sourceReferences}).valid,true);
 assert.equal(raw.comparisons.length,4);assert.equal(normalizeProgress(sampleProgress()).schemaVersion,2);
 const old=sampleProgress();const staged=commitProgressReplacement(old,{...old,bookmarks:[]},false,()=>{throw Error('must not write');});
 assert.equal(staged.value,old);
});
test('Stage 04 cross-law edges are explicit, explained and use approved relationships',()=>{
 const d=clone(),newEdges=d.knowledgeEdges.filter(e=>Number(e.id.slice(-4))>=46);
 assert(newEdges.length>=20);assert(newEdges.every(e=>e.explanation.length>=45&&e.sourceReferenceIds.length));
 assert(newEdges.some(e=>e.fromEntityId==='LAW-12'&&e.toEntityId==='LAW-09'));
 assert(newEdges.some(e=>e.fromEntityId==='LAW-10'&&e.toEntityId==='LAW-05'));
 assert(validateData(d).valid);
});
test('Stage 04 perspective panels remain reachable from laws, concepts and cases in source',()=>{
 for(const path of ['laws-library/LawsLibrary.tsx','behavior-atlas/BehaviorAtlas.tsx','historical-cases/HistoricalCases.tsx']){
  const source=readFileSync(new URL('../src/modules/'+path,import.meta.url),'utf8');
  assert.match(source,/<ResearchPerspectives\s+claimIds=/,path);
 }
});

// Stage 05: canonical v2 facet, historical cases, link continuity and source-grounded coverage.
const {hasLevel,levelLabel,explanationLevels}=await import('../src/services/explanation-levels.ts');
test('Stage 05 retains every existing law and expands 13–15 with substantive sourced research',()=>{
 const d=clone();assert.equal(d.manifest.schemaVersion,3);assert.equal(d.laws.length,18);
 for(let n=13;n<=15;n++){
  const law=d.laws[n-1];assert.equal(law.id,`LAW-${n}`);
  assert.equal(law.editorialStatus,'partially_reviewed');
  assert(law.explanation.trim().split(/\s+/).length>=500,law.id);
  assert.equal(law.relatedConceptIds.length,3);assert.equal(law.historicalCaseIds.length,1);
  assert.equal(law.claimIds.length,2);assert.equal(law.exerciseIds.length,3);assert.equal(law.sourceReferenceIds.length,10);
  for(const id of law.sourceReferenceIds){assert(d.sourceReferences.some(r=>r.id===id),id);}
 }
});
test('Stage 05 concept and case level facets are valid multi-valued classifications',()=>{
 const d=clone();const allowed=new Set(explanationLevels.map(x=>x.value));assert.equal(allowed.size,4);
 for(const c of [...d.concepts,...d.historicalCases]){
  assert(Array.isArray(c.levelsOfExplanation));assert.equal(new Set(c.levelsOfExplanation).size,c.levelsOfExplanation.length);
  assert(c.levelsOfExplanation.every(x=>allowed.has(x)));
 }
 assert(d.concepts.slice(-9).some(c=>c.levelsOfExplanation.length>=3));
 assert(d.historicalCases.slice(-3).every(c=>c.levelsOfExplanation.includes('historical_institutional')));
});
test('explanation filters preserve multi-level matches and unclassified legacy records',()=>{
 assert(hasLevel(['group','individual'],'group'));
 assert(hasLevel(['group','individual'],'individual'));
 assert(!hasLevel(['individual'],'historical_institutional'));
 assert(hasLevel([],'unclassified'));
 assert(!hasLevel(['individual'],'unclassified'));
 assert.equal(levelLabel('group'),'Group');
});
test('invalid explanation levels, duplicate facets and absent facet are rejected',()=>{
 const d=clone();d.concepts[0].levelsOfExplanation=['imaginary'];assert(validateData(d).errors.some(x=>x.code==='INVALID_EXPLANATION_LEVEL'));
 const e=clone();e.historicalCases[0].levelsOfExplanation=['group','group'];assert(validateData(e).errors.some(x=>x.code==='INVALID_EXPLANATION_LEVEL'));
 const f=clone();delete f.concepts[0].levelsOfExplanation;assert(validateData(f).errors.some(x=>x.code==='INVALID_EXPLANATION_LEVEL'));
});
test('Stage 05 case file → concept → LAW-14 source reference chain resolves',()=>{
 const d=clone();const law=d.laws.find(x=>x.id==='LAW-14');const ca=d.historicalCases.find(x=>x.id==='CAS-0014');
 const co=d.concepts.find(x=>x.id==='CON-0040');assert(law&&ca&&co);
 assert(law.historicalCaseIds.includes(ca.id));assert(law.relatedConceptIds.includes(co.id));
 assert(ca.relatedConceptIds.includes(co.id));assert(co.relatedLawIds.includes(law.id));
 for(const id of [...ca.sourceReferenceIds,...co.sourceReferenceIds])assert.equal(resolveSourceReference(id,d.sourceReferences,d.sources)?.source?.id,'SRC-0001');
 assert.equal(ca.verificationStatus,'secondary_source_account');assert.deepEqual(ca.documentedFacts,[]);
});
test('Stage 05 revised source locator is a real section heading, not forward page mention',()=>{
 const chapter=JSON.parse(readFileSync(new URL('../research/CHAPTER_MAP.json',import.meta.url),'utf8')).chapters[13];
 const section=chapter.internalSections.find(x=>x.title==='The Reality Group');
 assert.equal(section.pdfPageIndexZeroBased,472);assert.equal(section.pdfPageOneBased,473);
 const r=JSON.parse(readFileSync(new URL('../research/STAGE_05_READING_LOG.json',import.meta.url),'utf8'));
 assert(r.sections.some(x=>x.lawId==='LAW-14'&&x.section==='The Reality Group'&&x.headingVerified));
});
test('Stage 05 knowledge edges only cite actual sources and preserve old IDs',()=>{
 const d=clone(),newEdges=d.knowledgeEdges.filter(e=>Number(e.id.slice(-4))>=74&&Number(e.id.slice(-4))<=97);
 assert.equal(newEdges.length,24);
 for(const e of newEdges){assert(e.explanation.length>50&&e.sourceReferenceIds.length>=1);assert(e.sourceReferenceIds.every(id=>d.sourceReferences.some(r=>r.id===id)));}
 assert.equal(d.laws.slice(0,12).filter(l=>l.editorialStatus==='partially_reviewed').length,12);
});
test('Stage 05 authored cases distinguish book narrative from historical corroboration',()=>{
 const d=clone();for(const c of d.historicalCases.slice(12,15)){
  assert.equal(c.verificationStatus,'secondary_source_account');if(c.id!=='CAS-0013'&&c.id!=='CAS-0015')assert.deepEqual(c.documentedFacts,[]);
  assert(c.alternativeInterpretations.length>=2&&c.limitations.length>=2);
 }
 for(const cl of d.claims.slice(-6)){if(!cl.researchFindingIds.length)assert.equal(cl.evidenceStatus,'not_assessed');}
});
test('Stage 05 model retains compatibility with local user progress v1 and prior curated comparison records',()=>{
 const d=clone();const raw=JSON.parse(readFileSync(new URL('../src/data/concept-comparisons.json',import.meta.url),'utf8'));
 assert.equal(normalizeProgress(sampleProgress()).schemaVersion,2);
 assert.equal(raw.schemaVersion,1);assert.equal(raw.comparisons.length,4);
 assert.equal(d.researchFindings.filter(f=>!/^RES-000[1-6]$/.test(f.id)).length,0);assert.equal(d.sources.length,12);
});
test('Stage 05 UI exposes case and concept filters and explicit cross-record navigation',()=>{
 const atlas=readFileSync(new URL('../src/modules/behavior-atlas/BehaviorAtlas.tsx',import.meta.url),'utf8');
 const cases=readFileSync(new URL('../src/modules/historical-cases/HistoricalCases.tsx',import.meta.url),'utf8');
 assert(atlas.includes('Filter by level of explanation')&&atlas.includes('historicalCases.filter'));
 assert(cases.includes('Filter cases by level of explanation')&&cases.includes('type="concept"'));
});


// Stage 06: independently checked chapter source structure, preservation and synthesis.
test('Stage 06 provides substantive, sourced Law 16–18 dossiers without fabricated completion',()=>{
 const d=clone();assert.equal(d.laws.length,18);
 for(let n=16;n<=18;n++){const law=d.laws[n-1];assert.equal(law.id,`LAW-${n}`);
  assert(law.explanation.split(/\s+/).length>=500);assert.equal(law.editorialStatus,'partially_reviewed');
  assert.equal(law.relatedConceptIds.length,3);assert.equal(law.historicalCaseIds.length,1);
  assert.equal(law.claimIds.length,2);assert.equal(law.sourceReferenceIds.length,10);
  assert.equal(law.exerciseIds.length,3);
 }
 assert.equal(d.researchFindings.filter(f=>!/^RES-000[1-6]$/.test(f.id)).length,0);
});
test('Stage 06 attribution and uncertainty remain separate from historical/scientific certification',()=>{
 const d=clone();for(const x of d.historicalCases.slice(-3)){
  assert.equal(x.verificationStatus,'secondary_source_account');if(x.id==='CAS-0017')assert.deepEqual(x.documentedFacts,[]);
  assert(x.alternativeInterpretations.length>=2&&x.limitations.length>=2);
 }
 for(const x of d.claims.slice(-6)){if(!x.researchFindingIds.length)assert.equal(x.evidenceStatus,'not_assessed');}
});
test('Stage 06 preserves all prior stable IDs and source reference lineage',()=>{
 const d=clone();assert.deepEqual(d.laws.map(x=>x.id),Array.from({length:18},(_,i)=>`LAW-${String(i+1).padStart(2,'0')}`));
 for(const [kind,count] of [['concepts',54],['historicalCases',18],['claims',38],['sourceReferences',143],['knowledgeEdges',127],['exercises',57]])assert.equal(d[kind].length,count,kind);
 const source=new Set(d.sourceReferences.map(x=>x.id));assert(d.laws.every(l=>l.sourceReferenceIds.every(x=>source.has(x))));
 assert(validateData(d).valid);
});
test('Stage 06 corrected section headings refer to actual openings rather than early mentions',()=>{
 const m=JSON.parse(readFileSync(new URL('../research/CHAPTER_MAP.json',import.meta.url),'utf8'));
 assert.equal(m.chapters[15].internalSections.find(x=>x.title==='Controlled Aggression').pdfPageIndexZeroBased,560);
 assert.equal(m.chapters[16].internalSections.find(x=>x.title==='Generational Patterns').pdfPageIndexZeroBased,595);
 const log=JSON.parse(readFileSync(new URL('../research/STAGE_06_READING_LOG.json',import.meta.url),'utf8'));
 assert.equal(log.sections.length,11);assert.equal(log.pageChecks.length,30);
 assert(log.sections.every(x=>x.headingVerified&&x.startPdfPageIndex<=x.endPdfPageIndex));
});
test('Stage 06 newly classified concepts reject unknown or duplicated explanation levels',()=>{
 const d=clone();assert(d.concepts.slice(-9).every(c=>c.levelsOfExplanation.length>0));
 assert(d.historicalCases.slice(-3).every(c=>c.levelsOfExplanation.includes('historical_institutional')));
 d.concepts.at(-1).levelsOfExplanation.push('group','group');assert(validateData(d).errors.some(e=>e.code==='INVALID_EXPLANATION_LEVEL'));
});
test('Stage 06 links every new case to chapter, concept, and correctly resolved book source',()=>{
 const d=clone();for(let n=16;n<=18;n++){const law=d.laws[n-1];const ca=d.historicalCases.find(x=>x.id===law.historicalCaseIds[0]);
  assert(ca&&ca.relatedLawIds.includes(law.id));
  assert(ca.relatedConceptIds.some(id=>law.relatedConceptIds.includes(id)));
  assert(ca.sourceReferenceIds.some(id=>resolveSourceReference(id,d.sourceReferences,d.sources)?.source.id==='SRC-0001'));
  assert(ca.sourceReferenceIds.every(id=>Boolean(resolveSourceReference(id,d.sourceReferences,d.sources))));
 }
});
test('Stage 06 cross-law synthesis is explicit and typed without fabricating science',()=>{
 const d=clone(),edges=d.knowledgeEdges.filter(x=>Number(x.id.slice(-4))>=98);
 assert.equal(edges.length,30);assert(edges.every(e=>e.explanation.length>=45&&e.sourceReferenceIds.length));
 assert(edges.some(e=>e.fromEntityId==='LAW-16'&&e.toEntityId==='LAW-04'));
 assert(edges.some(e=>e.fromEntityId==='LAW-17'&&e.toEntityId==='LAW-14'));
 assert(edges.some(e=>e.fromEntityId==='LAW-18'&&e.toEntityId==='LAW-13'));
 assert(edges.every(e=>e.verificationStatus!=='independently_verified'));
});
test('Stage 06 all-law coverage matrix is complete but does not pretend fully reviewed chapters',()=>{
 const a=JSON.parse(readFileSync(new URL('../research/STAGE_06_FULL_BOOK_AUDIT.json',import.meta.url),'utf8'));
 assert.equal(a.laws.length,18);assert(a.laws.every(x=>x.uiRoute===`/laws/${x.lawId}`));
 assert(a.laws.every(x=>x.editorialStatus==='partially_reviewed'));
 assert(a.laws.every(x=>x.identifiedSections===x.substantivelyReviewedSections.length+x.sectionsRemaining.length));
 assert.deepEqual(a.duplicateConceptNames,[]);
});
test('Stage 07 evidence queue is claim-linked, actionable and not misrepresented as completed evidence',()=>{
 const d=clone(),q=JSON.parse(readFileSync(new URL('../research/STAGE_07_EVIDENCE_BACKLOG.json',import.meta.url),'utf8'));
 assert(q.items.length>=10&&q.items.length<=15);
 for(const x of q.items){const c=d.claims.find(y=>y.id===x.claimId);assert(c&&c.relatedLawIds.includes(x.lawId));
  assert.equal(x.scientificEvidenceStatus,c.evidenceStatus);
  assert(x.bookReferenceIds.length>0&&x.bookReferenceIds.every(id=>d.sourceReferences.some(r=>r.id===id)));
 }
});
test('Stage 06 user-state migration and source-aware imports remain safe',()=>{
 const d=clone();assert.equal(d.manifest.schemaVersion,3);assert.equal(d.sources.length,12);
 const old=sampleProgress();assert.equal(normalizeProgress(old).schemaVersion,2);
 assert.equal(commitProgressReplacement(old,{...old,bookmarks:[]},false,()=>{throw Error('must not write')}).status,'cancelled');
});
test('Stage 06 updated Command Center and Network expose sourced coverage and synthesis links',()=>{
 const home=readFileSync(new URL('../src/modules/command-center/CommandCenter.tsx',import.meta.url),'utf8');
 const net=readFileSync(new URL('../src/modules/knowledge-network/KnowledgeNetwork.tsx',import.meta.url),'utf8');
 const cov=readFileSync(new URL('../src/services/coverage.ts',import.meta.url),'utf8');
 assert(home.includes('LAWS 01–18')&&home.includes('COVERAGE / SOURCED RESEARCH')&&home.includes('researchedCounts.sectionsReviewed')&&home.includes('coverage-disclosure'));
 assert(net.includes('Full-book synthesis · 18 laws')&&net.includes('LAW-18'));
 assert(cov.includes('rawCoverage.chapters.slice(0,18)'));
});

// Stage 07 independent scholarly evidence and historical corroboration regression gates.
test('Stage 07 research records link exactly six scoped findings with independent source locators',()=>{
 const d=clone();assert.equal(d.researchFindings.length,6);
 for(const f of d.researchFindings){assert(f.relatedClaimIds.length>0);assert(f.sourceReferenceIds.length>0);
  for(const id of f.sourceReferenceIds){const pair=resolveSourceReference(id,d.sourceReferences,d.sources);assert(pair);assert.notEqual(pair.source.id,'SRC-0001');assert(pair.source.verifiedUrl?.startsWith('https://'));}
  assert(f.limitations.length>=1);assert(['limited','mixed'].includes(f.evidenceAssessment));
  for(const id of f.relatedClaimIds){const claim=d.claims.find(c=>c.id===id);assert(claim);assert(claim.researchFindingIds.includes(f.id));assert.equal(claim.evidenceStatus,f.evidenceAssessment);}
 }
});
test('Stage 07 source records cannot overwrite the Greene book or falsify PDF page numbering',()=>{
 const d=clone();assert.equal(d.sources.find(x=>x.id==='SRC-0001').title,'The Laws of Human Nature');
 assert.equal(d.sources.length,12);assert.equal(d.sourceReferences.length,143);
 for(const r of d.sourceReferences.filter(x=>x.sourceId!=='SRC-0001')){assert.equal(r.pdfPageIndex,null);assert.equal(r.printedPage,null);assert(r.locatorNotes.length>30);}
 assert(validateData(d).valid);
});
test('Stage 07 five historical cases retain their book interpretation while reporting narrowly corroborated chronology',()=>{
 const d=clone();for(const id of ['CAS-0001','CAS-0013','CAS-0015','CAS-0016','CAS-0018']){
  const c=d.historicalCases.find(c=>c.id===id);assert(c);assert(c.documentedFacts.length>0);assert(c.sourceReferenceIds.some(id=>resolveSourceReference(id,d.sourceReferences,d.sources)?.source.id!=='SRC-0001'));
  assert.equal(c.verificationStatus,'secondary_source_account');assert(c.limitations.some(x=>x.includes('not')||x.includes('cannot')));
 }
});
test('Stage 07 no unassessed claim receives an automatic evidence upgrade',()=>{
 const d=clone();assert.equal(d.claims.filter(c=>c.evidenceStatus!=='not_assessed').length,6);
 for(const c of d.claims){if(c.researchFindingIds.length===0)assert.equal(c.evidenceStatus,'not_assessed');}
 assert(d.laws.every(x=>x.editorialStatus==='partially_reviewed'));
});
test('Stage 07 evidence navigator includes law, status and source filters and a methodology route',()=>{
 const ui=readFileSync(new URL('../src/modules/science-evidence/ScienceEvidence.tsx',import.meta.url),'utf8');
 const routes=readFileSync(new URL('../src/app/router.tsx',import.meta.url),'utf8');
 assert(ui.includes('Filter by evidence status')&&ui.includes('Filter by source category')&&ui.includes('Filter by law'));
 assert(ui.includes('Independent findings')&&ui.includes('Research method')&&ui.includes('Competing explanations'));
 assert(routes.includes('evidence/methodology'));
});

test('Stage 07 external evidence ledger covers all independent references with real source IDs',()=>{
 const d=clone(), ledger=JSON.parse(readFileSync(new URL('../research/SOURCE_LEDGER.json',import.meta.url),'utf8'));
 const refs=d.sourceReferences.filter(r=>r.sourceId!=='SRC-0001');
 assert.equal(refs.length,11);
 for(const r of refs){assert(ledger.records.some(x=>x.referenceId===r.id&&x.sourceId===r.sourceId&&x.pdfPageIndexZeroBased===null));}
});
test('Stage 07 evidence backlog records progress without claiming 14 finished external reviews',()=>{
 const q=JSON.parse(readFileSync(new URL('../research/STAGE_07_EVIDENCE_BACKLOG.json',import.meta.url),'utf8'));
 assert.equal(q.items.length,14);assert.equal(q.items.filter(x=>x.stage07FindingIds.length>0).length,6);
 assert.equal(q.items.filter(x=>x.stage07FindingIds.length===0).length,8);
});
test('Stage 07 finding-detail route resolves canonical research findings rather than separate silo',()=>{
 const route=readFileSync(new URL('../src/app/router.tsx',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/modules/science-evidence/ScienceEvidence.tsx',import.meta.url),'utf8');
 assert(route.includes('/evidence/findings/:id'));assert(ui.includes('export function FindingDetail'));
 assert(ui.includes('researchFindings.find(x=>x.id===id)'));
});

// Stage 08: the same dependency-free graph/index adapter consumed by the React UI.
const {makeDiscoveryIndex}=await import('../src/services/discovery-adapter.ts');
const {buildGraph,neighborhood,filteredLinks,rankedSearch,radialLayout,sharedIds}=await import('../src/services/graph-core.ts');
const {graph:stage08Graph,graphNodes:stage08Nodes,lexicalIndex:stage08Search}=makeDiscoveryIndex(readData());
test('Stage 08 all six canonical node types and every original editorial edge are retained',()=>{
 const d=clone();assert.equal(stage08Nodes.length,146);assert.equal(stage08Graph.issues.length,0);
 assert.equal([...stage08Graph.byLink.values()].filter(e=>e.kind==='editorial').length,d.knowledgeEdges.length);
 for(const e of d.knowledgeEdges){const link=stage08Graph.byLink.get(e.id);assert.equal(link.from,e.fromEntityId);assert.equal(link.to,e.toEntityId);assert.equal(link.relation,e.relationshipType);assert.equal(link.explanation,e.explanation);assert.deepEqual(link.referenceIds,e.sourceReferenceIds);}
 assert.equal(new Set(stage08Nodes.map(n=>n.type)).size,6);
});
test('Stage 08 claim to finding and finding to external source are real canonical associations',()=>{
 const a=stage08Graph.adjacency.get('CLM-0006');assert(a.some(e=>e.to==='RES-0001'&&e.kind==='record_link'&&e.relation==='assessed_by'));
 const f=stage08Graph.adjacency.get('RES-0001');const link=f.find(e=>e.to==='SRC-0002'&&e.relation==='cites');assert(link);assert.deepEqual(link.referenceIds,['REF-0133']);assert(!link.provenance.includes('independently verified'));
 const d=clone();assert.equal(resolveSourceReference(link.referenceIds[0],d.sourceReferences,d.sources).source.id,'SRC-0002');
});
test('Stage 08 graph rejects missing nodes, duplicate links and self-links',()=>{
 const n=stage08Nodes.slice(0,2),good={id:'fixture',from:n[0].id,to:n[1].id,kind:'editorial',relation:'related_to',explanation:'Fixture',referenceIds:[],provenance:'fixture',verification:'fixture'};
 const a=buildGraph(n,[good,good,{...good,id:'missing',to:'MISSING'},{...good,id:'self',to:good.from}]);assert.equal(a.issues.length,3);assert.equal(a.byLink.size,1);
});
test('Stage 08 neighborhood and list share link set with bounded expansion and valid endpoints',()=>{
 for(const node of stage08Nodes){const one=neighborhood(stage08Graph,node.id,{},false,18),two=neighborhood(stage08Graph,node.id,{},true,18);assert(one.nodes.length<=18&&two.nodes.length<=18);assert(two.links.length>=one.links.length);assert.equal(new Set(two.links.map(e=>e.id)).size,two.links.length);const ids=new Set(two.nodes.map(n=>n.id));assert(two.links.every(e=>ids.has(e.from)&&ids.has(e.to)));assert(two.links.every(e=>stage08Graph.byLink.has(e.id)));}
 assert.deepEqual(neighborhood(stage08Graph,'INVALID').nodes,[]);
});
test('Stage 08 focused type, relationship, query and editorial-only filters combine correctly',()=>{
 const edges=filteredLinks(stage08Graph,'CLM-0006',{relation:'assessed_by',type:'research_finding',query:'deception'});assert.equal(edges.length,1);assert.equal(edges[0].to,'RES-0001');assert.equal(filteredLinks(stage08Graph,'CLM-0006',{relation:'assessed_by',editorialOnly:true}).length,0);
 assert(filteredLinks(stage08Graph,'',{editorialOnly:true}).every(e=>e.kind==='editorial'));
});
test('Stage 08 deterministic radial layout keeps every visible node finite and inside its nominal canvas',()=>{
 const nodes=neighborhood(stage08Graph,'LAW-01',{},true,18).nodes;const a=radialLayout(nodes.map(n=>n.id),'LAW-01');assert.equal(a.size,nodes.length);assert.deepEqual(a.get('LAW-01'),{x:400,y:300});for(const p of a.values()){assert(p.x>=0&&p.x<=800&&p.y>=0&&p.y<=600);}
});
test('Stage 08 lexical ranking prioritizes exact identifiers and complete multiword matches',()=>{
 assert.equal(rankedSearch(stage08Search,'CON-0001')[0].id,'CON-0001');assert.equal(rankedSearch(stage08Search,'confirmation bias')[0].id,'CON-0001');assert.deepEqual(rankedSearch(stage08Search,'confirmation nonexistentxyz'),[]);
});
test('Stage 08 search indexes people, findings, bibliography and combination filters',()=>{
 assert(rankedSearch(stage08Search,'Flannery O’Connor',{type:'historical_case'}).some(x=>x.id==='CAS-0018'));
 assert.equal(rankedSearch(stage08Search,'DePaulo',{type:'source'})[0].id,'SRC-0002');
 const results=rankedSearch(stage08Search,'',{type:'research_finding',law:'LAW-03',evidence:'limited'});assert.deepEqual(results.map(x=>x.id),['RES-0001']);
});
test('Stage 08 comparison overlap is exact and never creates an editorial relationship',()=>{
 assert.deepEqual(sharedIds(['CAS-0001','CAS-0002','CAS-0001'],['CAS-0001']),['CAS-0001']);assert.deepEqual(sharedIds(['LAW-01'],['LAW-02']),[]);
 assert.equal(stage08Graph.byLink.get('EDG-0001').kind,'editorial');
});
test('Stage 08 graph citations are resolved through actual per-source references',()=>{
 const d=clone();for(const e of stage08Graph.byLink.values()){for(const id of e.referenceIds)assert(resolveSourceReference(id,d.sourceReferences,d.sources));if(e.relation==='cites')assert(e.referenceIds.every(id=>resolveSourceReference(id,d.sourceReferences,d.sources).source.id===e.to));}
});
test('Stage 08 UI integration retains actual graph route, accessible controls and canonical finding routes (static contract)',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');const ui=read('src/modules/knowledge-network/KnowledgeNetwork.tsx');assert(ui.includes('view.links.map')&&ui.includes('Accessible list')&&ui.includes('useSearchParams')&&ui.includes('ReferencePanel ids={e.referenceIds}'));assert(read('src/domain/entity-types.ts').includes("research_finding:'/evidence/findings/'"));assert(read('src/app/router.tsx').includes('path="/compare"'));assert(read('src/modules/command-center/SearchPage.tsx').includes('Linked evidence status'));
});
test('Stage 08 editorial edge types and directed endpoint pairs are valid, unique and sourced',()=>{
 const d=clone(),pairs=new Set();for(const e of d.knowledgeEdges){assert.equal(stage08Graph.byId.get(e.fromEntityId).type,e.fromEntityType);assert.equal(stage08Graph.byId.get(e.toEntityId).type,e.toEntityType);const key=`${e.fromEntityId}|${e.relationshipType}|${e.toEntityId}`;assert(!pairs.has(key));pairs.add(key);assert(e.explanation.trim()&&e.sourceReferenceIds.length);}
});
test('Stage 08 search normalizes common apostrophes and excerpts actual indexed text',async()=>{
 const {searchSnippet}=await import('../src/services/graph-core.ts');assert(rankedSearch(stage08Search,"Flannery O'Connor",{type:'historical_case'}).some(x=>x.id==='CAS-0018'));const n=stage08Nodes.find(x=>x.id==='SRC-0002');assert(searchSnippet(n,'DePaulo').includes('DePaulo'));
});

// Stage 09A: executable scenario, storage and integration tests.
await import("./stage09a-tests.mjs");

await import("./stage09b-tests.mjs");

await import("./stage10-tests.mjs");
