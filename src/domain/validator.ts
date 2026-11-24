import {validateAcademy} from './academy-validator';
import {parseScenarios} from './scenario-validator';
import {z} from 'zod';
import { LawRecord,ConceptRecord,HistoricalCaseRecord,ClaimRecord,SourceRecord,SourceReferenceRecord,ResearchFindingRecord,KnowledgeEdgeRecord,ExerciseRecord,LearningPathRecord,DatasetManifest,ConceptComparisonDataset } from './schemas';

export const collections = {
 laws:LawRecord,concepts:ConceptRecord,historicalCases:HistoricalCaseRecord,claims:ClaimRecord,sources:SourceRecord,
 sourceReferences:SourceReferenceRecord,researchFindings:ResearchFindingRecord,knowledgeEdges:KnowledgeEdgeRecord,
 exercises:ExerciseRecord,learningPaths:LearningPathRecord
} as const;
export type CollectionName=keyof typeof collections;
export type RawDataset=Record<CollectionName,unknown> & {manifest:unknown;conceptComparisons:unknown;scenarios:unknown};
export interface ValidationIssue {severity:'error'|'warning';code:string;message:string;path:string}
export interface ValidationResult {valid:boolean;errors:ValidationIssue[];warnings:ValidationIssue[]}
const add=(out:ValidationIssue[],severity:'error'|'warning',code:string,message:string,path:string)=>out.push({severity,code,message,path});
export function validateDataset(input:RawDataset,pdfPageCount=690):ValidationResult{
 const errors:ValidationIssue[]=[];const warnings:ValidationIssue[]=[];
 const parsed:Record<string,Array<{id:string;[key:string]:unknown}>>={};
 const manifest=DatasetManifest.safeParse(input.manifest);
 if(!manifest.success)for(const e of manifest.error.issues)add(errors,'error','INVALID_SCHEMA_VERSION',e.message,`manifest.${e.path.join('.')}`);
 for(const [collection,schema] of Object.entries(collections) as [CollectionName,z.ZodTypeAny][]){
  const value=input[collection];
  const result=z.array(schema).safeParse(value);
  if(!result.success){for(const e of result.error.issues)add(errors,'error','SCHEMA_INVALID',e.message,`${collection}.${e.path.join('.')}`);continue;}
  parsed[collection]=result.data;
 }
 const compareResult=ConceptComparisonDataset.safeParse(input.conceptComparisons);
 if(!compareResult.success)for(const e of compareResult.error.issues)add(errors,'error','COMPARISON_SCHEMA_INVALID',e.message,`conceptComparisons.${e.path.join('.')}`);
 else {
  const conceptIds=new Set((parsed.concepts??[]).map(x=>x.id));
  const lawIds=new Set((parsed.laws??[]).map(x=>x.id));
  const sourceIds=new Set((parsed.sourceReferences??[]).map(x=>x.id));
  const seen=new Set<string>();
  for(const row of compareResult.data.comparisons){
   if(seen.has(row.id))add(errors,'error','DUPLICATE_COMPARISON',row.id,`conceptComparisons.${row.id}`);
   seen.add(row.id);
   for(const id of [row.leftConceptId,row.rightConceptId])if(!conceptIds.has(id))add(errors,'error','BROKEN_COMPARISON_CONCEPT',id,`conceptComparisons.${row.id}`);
   for(const id of row.relatedLawIds)if(!lawIds.has(id))add(errors,'error','BROKEN_COMPARISON_LAW',id,`conceptComparisons.${row.id}`);
   for(const id of row.sourceReferenceIds)if(!sourceIds.has(id))add(errors,'error','BROKEN_COMPARISON_REFERENCE',id,`conceptComparisons.${row.id}`);
  }
 }
 try{const scenarios=parseScenarios(input.scenarios,parsed);if(Object.keys(parsed).length===Object.keys(collections).length)try{validateAcademy({exercises:ExerciseRecord.array().parse(input.exercises),learningPaths:LearningPathRecord.array().parse(input.learningPaths),laws:parsed.laws,concepts:parsed.concepts,historicalCases:parsed.historicalCases,researchFindings:parsed.researchFindings,sourceReferences:parsed.sourceReferences,scenarios});}catch(error){add(errors,'error','INVALID_ACADEMY',error instanceof Error?error.message:'Invalid Academy','learningPaths');}}catch(error){add(errors,'error','INVALID_SCENARIOS',error instanceof Error?error.message:'Invalid scenarios','scenarios');}
 const all=new Set<string>();
 for(const [collection,records] of Object.entries(parsed)){
  for(const [idx,item] of records.entries()){
   if(all.has(item.id))add(errors,'error','DUPLICATE_ID',`ID ${item.id} repeats`,`${collection}[${idx}].id`);
   all.add(item.id);
  }
 }
 const maps:Record<string,Set<string>>=Object.fromEntries(Object.entries(parsed).map(([key,rows])=>[key,new Set(rows.map(x=>x.id))]));
 const ref=(src:string,row:{id:string;[key:string]:unknown},field:string,target:string)=>{
  const ids=row[field];if(!Array.isArray(ids))return;
  ids.forEach((id,i)=>{if(!maps[target]?.has(id))add(errors,'error','BROKEN_REFERENCE',`Missing ${target} record ${id}`,`${src}.${row.id}.${field}[${i}]`);});
 };
 const multi:[string,string,string][]=[
  ['laws','relatedConceptIds','concepts'],['laws','historicalCaseIds','historicalCases'],['laws','claimIds','claims'],['laws','exerciseIds','exercises'],['laws','sourceReferenceIds','sourceReferences'],
  ['concepts','relatedLawIds','laws'],['concepts','relatedConceptIds','concepts'],['concepts','claimIds','claims'],['concepts','sourceReferenceIds','sourceReferences'],
  ['historicalCases','greeneInterpretationClaimIds','claims'],['historicalCases','relatedLawIds','laws'],['historicalCases','relatedConceptIds','concepts'],['historicalCases','sourceReferenceIds','sourceReferences'],
  ['claims','relatedLawIds','laws'],['claims','sourceReferenceIds','sourceReferences'],['claims','researchFindingIds','researchFindings'],
  ['researchFindings','relatedClaimIds','claims'],['researchFindings','sourceReferenceIds','sourceReferences'],
  ['knowledgeEdges','sourceReferenceIds','sourceReferences'],['exercises','relatedLawIds','laws'],['exercises','relatedConceptIds','concepts'],['exercises','sourceReferenceIds','sourceReferences'],
  ['learningPaths','lawIds','laws'],['learningPaths','conceptIds','concepts'],['learningPaths','exerciseIds','exercises']
 ];
 for(const [src,field,target] of multi)for(const row of parsed[src]||[])ref(src,row,field,target);
 for(const item of parsed.sourceReferences||[]){
  if(!maps.sources?.has(item.sourceId as string))add(errors,'error','BROKEN_SOURCE',`Missing source ${item.sourceId}`,`sourceReferences.${item.id}.sourceId`);
  if(item.sourceId==='SRC-0001' && typeof item.pdfPageIndex==='number' && item.pdfPageIndex>=pdfPageCount)add(errors,'error','INVALID_LOCATOR',`PDF page index ${item.pdfPageIndex} is outside ${pdfPageCount} pages`,`sourceReferences.${item.id}.pdfPageIndex`);
  if(item.pdfPageIndex===null && item.printedPage===null && item.chapter===null && item.section===null)add(errors,'error','INVALID_LOCATOR','At least one structured locator is required',`sourceReferences.${item.id}`);
 }
 const entityCollections:Record<string,string>={law:'laws',concept:'concepts',historical_case:'historicalCases',claim:'claims',source:'sources',source_reference:'sourceReferences',research_finding:'researchFindings',exercise:'exercises',learning_path:'learningPaths'};
 for(const edge of parsed.knowledgeEdges||[]){
  for(const side of ['from','to']){
   const type=edge[`${side}EntityType`] as string;const id=edge[`${side}EntityId`] as string;
   if(!maps[entityCollections[type]]?.has(id))add(errors,'error','INVALID_EDGE_ENDPOINT',`${side} ${type}:${id} is not present`,`knowledgeEdges.${edge.id}.${side}EntityId`);
  }
 }
 for(const ex of parsed.exercises||[]){
  const choices=ex.choices as {id:string}[];const rules=ex.evaluationRules as {correctChoiceIds:string[]};const explanations=ex.explanations as Record<string,string>;
  const unique=new Set(choices.map(c=>c.id));
  if(unique.size!==choices.length)add(errors,'error','DUPLICATE_CHOICE','Choice identifiers must be unique',`exercises.${ex.id}.choices`);
  for(const a of rules.correctChoiceIds)if(!unique.has(a))add(errors,'error','INVALID_EXERCISE_ANSWER',`Correct answer ${a} not found in choices`,`exercises.${ex.id}.evaluationRules`);
  for(const a of unique)if(!explanations[a])add(errors,'error','MISSING_EXERCISE_EXPLANATION',`Choice ${a} lacks explanation`,`exercises.${ex.id}.explanations`);
 }
 const lawRows=parsed.laws||[];
 if(lawRows.length!==18)add(errors,'error','LAW_COUNT',`Expected 18 law records; found ${lawRows.length}`,'laws');
 for(let n=1;n<=18;n++){
  const expected=`LAW-${String(n).padStart(2,'0')}`;
  const item=lawRows.find(x=>x.id===expected);
  if(!item)add(errors,'error','LAW_MISSING',`Missing ${expected}`,'laws');
  else if(item.chapterNumber!==n)add(errors,'error','LAW_NUMBER_MISMATCH',`${expected} has chapterNumber ${item.chapterNumber}`,'laws');
 }
 for(const law of lawRows){if(law.editorialStatus==='awaiting_review' && law.centralArgument===null)add(warnings,'warning','INCOMPLETE_RESEARCH','Indexed only; no reviewed thesis',`laws.${law.id}`);}
 return {valid:errors.length===0,errors,warnings};
}
