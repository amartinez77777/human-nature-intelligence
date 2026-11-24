/** Runtime-independent second check for curated comparisons. Zod schema remains the app authority. */
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=(path)=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
export function validateComparisons(raw,{concepts,laws,refs}){
 const errors=[];
 const fail=(code,id)=>errors.push(`${code}: ${id}`);
 if(!raw||raw.schemaVersion!==1)fail('INVALID_COMPARISON_SCHEMA','schemaVersion');
 if(!Array.isArray(raw?.comparisons))return {valid:false,errors:[...errors,'MISSING_COMPARISONS']};
 const ids=new Set(),cn=new Set(concepts.map(x=>x.id)),ls=new Set(laws.map(x=>x.id)),rf=new Set(refs.map(x=>x.id));
 for(const x of raw.comparisons){
  if(!/^CMP-\d{4}$/.test(x.id??''))fail('INVALID_ID',x.id);
  if(ids.has(x.id))fail('DUPLICATE_COMPARISON',x.id);
  ids.add(x.id);
  if(!cn.has(x.leftConceptId)||!cn.has(x.rightConceptId)||x.leftConceptId===x.rightConceptId)fail('INVALID_CONCEPT_ENDPOINT',x.id);
  for(const field of ['title','contrast','leftLens','rightLens','illustration','ethics'])if(typeof x[field]!=='string'||x[field].trim().length<(field==='title'?5:20))fail('INCOMPLETE_EDITORIAL_CONTRAST',`${x.id}.${field}`);
  if(!['fully_reviewed','partially_reviewed','provisional','awaiting_review','blocked'].includes(x.editorialStatus))fail('INVALID_COVERAGE',x.id);
  if(!Array.isArray(x.relatedLawIds)||x.relatedLawIds.length===0||x.relatedLawIds.some(id=>!ls.has(id)))fail('INVALID_LAW_LINK',x.id);
  if(!Array.isArray(x.sourceReferenceIds)||x.sourceReferenceIds.length===0||x.sourceReferenceIds.some(id=>!rf.has(id)))fail('INVALID_REFERENCE',x.id);
 }
 return {valid:errors.length===0,errors};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const raw=load('src/data/concept-comparisons.json');const r=validateComparisons(raw,{concepts:load('src/data/concepts.json'),laws:load('src/data/laws.json'),refs:load('src/data/source-references.json')});
 if(!r.valid){for(const e of r.errors)console.error('COMPARISON ERROR:',e);process.exitCode=1;}
 else console.log(`HNI comparisons integrity: PASS (${raw.comparisons.length} curated, versioned, source-linked pairs)`);
}
