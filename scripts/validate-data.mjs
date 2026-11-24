/** Dependency-free integrity audit for bundled JSON. Zod is the runtime schema authority; this gives CI a second independent structural check. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const files = {laws:'laws.json',concepts:'concepts.json',historicalCases:'historical-cases.json',claims:'claims.json',sources:'sources.json',sourceReferences:'source-references.json',researchFindings:'research-findings.json',knowledgeEdges:'knowledge-edges.json',exercises:'exercises.json',learningPaths:'learning-paths.json',manifest:'dataset-manifest.json'};
const prefixes={laws:/^LAW-(0[1-9]|1[0-8])$/,concepts:/^CON-\d{4}$/,historicalCases:/^CAS-\d{4}$/,claims:/^CLM-\d{4}$/,sources:/^SRC-\d{4}$/,sourceReferences:/^REF-\d{4}$/,researchFindings:/^RES-\d{4}$/,knowledgeEdges:/^EDG-\d{4}$/,exercises:/^EXR-\d{4}$/,learningPaths:/^PATH-\d{4}$/};
const mappings=[
 ['laws','relatedConceptIds','concepts'],['laws','historicalCaseIds','historicalCases'],['laws','claimIds','claims'],['laws','exerciseIds','exercises'],['laws','sourceReferenceIds','sourceReferences'],
 ['concepts','relatedLawIds','laws'],['concepts','relatedConceptIds','concepts'],['concepts','claimIds','claims'],['concepts','sourceReferenceIds','sourceReferences'],
 ['historicalCases','greeneInterpretationClaimIds','claims'],['historicalCases','relatedLawIds','laws'],['historicalCases','relatedConceptIds','concepts'],['historicalCases','sourceReferenceIds','sourceReferences'],
 ['claims','relatedLawIds','laws'],['claims','sourceReferenceIds','sourceReferences'],['claims','researchFindingIds','researchFindings'],
 ['researchFindings','relatedClaimIds','claims'],['researchFindings','sourceReferenceIds','sourceReferences'],
 ['knowledgeEdges','sourceReferenceIds','sourceReferences'],['exercises','relatedLawIds','laws'],['exercises','relatedConceptIds','concepts'],['exercises','sourceReferenceIds','sourceReferences'],
 ['learningPaths','lawIds','laws'],['learningPaths','conceptIds','concepts'],['learningPaths','exerciseIds','exercises']
];
const targetCollections={law:'laws',concept:'concepts',historical_case:'historicalCases',claim:'claims',source:'sources',source_reference:'sourceReferences',research_finding:'researchFindings',exercise:'exercises',learning_path:'learningPaths'};
const provenance=['directly_inspected','independently_verified','secondary_source_account','editorial_synthesis','unverified'];
const coverage=['fully_reviewed','partially_reviewed','provisional','awaiting_review','blocked'];
const evidence=['supported','mixed','limited','contested','not_assessed'];
const collectionRequired={
 laws:['chapterNumber','chapterTitle','centralArgument','mechanisms','sourceReferenceIds','editorialStatus'],
 concepts:['name','definition','mechanism','sourceReferenceIds','editorialStatus','levelsOfExplanation'],
 historicalCases:['title','context','documentedFacts','sourceReferenceIds','verificationStatus','levelsOfExplanation'],
 claims:['statement','attributedTo','sourceReferenceIds','evidenceStatus'],
 sources:['author','title','publicationYear','verificationStatus'],
 sourceReferences:['sourceId','pdfPageIndex','printedPage','locatorNotes','verificationStatus'],
 researchFindings:['researchQuestion','finding','evidenceAssessment'],
 knowledgeEdges:['fromEntityType','fromEntityId','toEntityType','toEntityId','relationshipType','provenanceType','sourceReferenceIds'],
 exercises:['prompt','choices','evaluationRules','explanations','sourceReferenceIds'],
 learningPaths:['title','description','lawIds','conceptIds','exerciseIds','editorialStatus']
};
export function readData(){return Object.fromEntries(Object.entries(files).map(([name,file])=>[name,JSON.parse(readFileSync(resolve(root,file),'utf8'))]));}
export function validateData(d,pdfPages=690){
 const errors=[],warnings=[],ids=new Map(),maps={};
 const fail=(code,path,message)=>errors.push({code,path,message});
 if(d.manifest?.schemaVersion!==3)fail('INVALID_SCHEMA_VERSION','manifest','Expected dataset schemaVersion 3');
 const levels=new Set(['individual','interpersonal','group','historical_institutional']);
 for(const [collection,regex] of Object.entries(prefixes)){
  const rows=d[collection];if(!Array.isArray(rows)){fail('MISSING_DATASET',collection,'Missing record array');continue;}
  maps[collection]=new Set();
  for(const [i,row] of rows.entries()){
   if(typeof row!=='object'||row===null){fail('INVALID_RECORD',`${collection}[${i}]`,'Record is not object');continue;}
   for(const field of collectionRequired[collection])if(!(field in row))fail('MISSING_FIELD',`${collection}.${row.id||i}`,`Missing required field ${field}`);
   if(!regex.test(row.id||''))fail('INVALID_ID',`${collection}[${i}]`,String(row.id));
   if(ids.has(row.id))fail('DUPLICATE_ID',`${collection}[${i}]`,`${row.id} previously in ${ids.get(row.id)}`);
   ids.set(row.id,collection);maps[collection].add(row.id);
   if(['concepts','historicalCases'].includes(collection)){
    if(!Array.isArray(row.levelsOfExplanation)||row.levelsOfExplanation.some(value=>!levels.has(value))||new Set(row.levelsOfExplanation).size!==row.levelsOfExplanation.length)
     fail('INVALID_EXPLANATION_LEVEL',`${collection}.${row.id}`,'Unknown, repeated or missing explanation levels');
   }
   if('editorialStatus' in row&&!coverage.includes(row.editorialStatus))fail('INVALID_EDITORIAL_STATUS',`${collection}.${row.id}`,String(row.editorialStatus));
   if('verificationStatus' in row&&!provenance.includes(row.verificationStatus))fail('INVALID_PROVENANCE',`${collection}.${row.id}`,String(row.verificationStatus));
   if('provenanceType' in row&&!provenance.includes(row.provenanceType))fail('INVALID_PROVENANCE',`${collection}.${row.id}`,String(row.provenanceType));
   if('evidenceStatus' in row&&!evidence.includes(row.evidenceStatus))fail('INVALID_EVIDENCE_STATUS',`${collection}.${row.id}`,String(row.evidenceStatus));
   if('evidenceAssessment' in row&&!evidence.includes(row.evidenceAssessment))fail('INVALID_EVIDENCE_STATUS',`${collection}.${row.id}`,String(row.evidenceAssessment));
  }
 }
 if(d.laws?.length!==18)fail('INVALID_LAW_COUNT','laws',`Expected 18, got ${d.laws?.length}`);
 for(let n=1;n<=18;n++){
  const id='LAW-'+String(n).padStart(2,'0');const x=d.laws?.find(x=>x.id===id);
  if(!x)fail('MISSING_LAW','laws',id);else if(x.chapterNumber!==n)fail('INVALID_CHAPTER_NUMBER',id,String(x.chapterNumber));
 }
 for(const [src,field,target] of mappings){
  for(const row of (d[src]||[])){if(!Array.isArray(row[field])){fail('INVALID_REFERENCE_LIST',`${src}.${row.id}`,field);continue;}
   for(const id of row[field])if(!maps[target]?.has(id))fail('BROKEN_REFERENCE',`${src}.${row.id}.${field}`,`${id} missing from ${target}`);
  }
 }
 for(const src of d.sources||[]){if(src.verifiedUrl!==null&&(!/^https?:\/\//.test(src.verifiedUrl)||typeof src.verifiedUrl!=='string'))fail('INVALID_SOURCE_URL',src.id,'Source URL must be HTTP(S)');}
 for(const ref of d.sourceReferences||[]){
  if(!maps.sources?.has(ref.sourceId))fail('BROKEN_SOURCE',ref.id,String(ref.sourceId));
  if(ref.pdfPageIndex!==null&&(!Number.isInteger(ref.pdfPageIndex)||ref.pdfPageIndex<0||(ref.sourceId==='SRC-0001'&&ref.pdfPageIndex>=pdfPages)))fail('INVALID_SOURCE_LOCATOR',ref.id,String(ref.pdfPageIndex));
  if(ref.pdfPageIndex===null&&ref.printedPage===null&&ref.chapter===null&&ref.section===null)fail('MISSING_LOCATOR',ref.id,'No PDF or printed locator');
 }
 for(const edge of d.knowledgeEdges||[]){for(const side of ['from','to']){const collection=targetCollections[edge[side+'EntityType']];if(!collection||!maps[collection]?.has(edge[side+'EntityId']))fail('INVALID_EDGE_ENDPOINT',edge.id,`${side} ${edge[side+'EntityType']}:${edge[side+'EntityId']}`);}}
 for(const ex of d.exercises||[]){const choiceIds=(ex.choices||[]).map(c=>c.id);const allowed=new Set(choiceIds);
  if(allowed.size!==choiceIds.length)fail('DUPLICATE_CHOICE',ex.id,'Duplicate answer choice');
  for(const id of ex.evaluationRules?.correctChoiceIds||[])if(!allowed.has(id))fail('INVALID_EXERCISE_ANSWER',ex.id,id);
  for(const id of choiceIds)if(!ex.explanations?.[id])fail('MISSING_EXPLANATION',ex.id,id);
 }
 for(const law of d.laws||[])if(law.editorialStatus==='awaiting_review')warnings.push({code:'AWAITING_RESEARCH',path:law.id,message:'No substantive review yet'});
 return {valid:errors.length===0,errors,warnings};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const r=validateData(readData());
 for(const x of r.errors)console.error(`ERROR ${x.code}: ${x.path} ${x.message}`);
 console.log(`HNI JSON integrity: ${r.errors.length} error(s), ${r.warnings.length} expected research warnings`);
 process.exitCode=r.valid?0:1;
}
