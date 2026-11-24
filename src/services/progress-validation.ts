import rawExercises from '../data/exercises.json' with {type:'json'};
import rawPaths from '../data/learning-paths.json' with {type:'json'};
import {evaluateExercise,type ExerciseInput,type AcademyAttempt} from './exercise-engine.ts';
import rawScenarios from '../data/scenarios.json' with {type:'json'};
import {parseScenarios} from '../domain/scenario-validator.ts';
import {replayScenario} from './scenario-engine.ts';
import type {ScenarioSession} from '../domain/scenario-types';
import type {UserProgress} from '../domain/schemas';
const scenarios=parseScenarios(rawScenarios);

const bookmarkId=/^(LAW-(0[1-9]|1[0-8])|(?:CON|CAS|CLM|SRC|REF|RES|EDG|EXR|PATH)-\d{4})$/;
const exerciseId=/^EXR-\d{4}$/;
const maxEntries=5000;
const isRecord=(x:unknown):x is Record<string,unknown>=>typeof x==='object'&&x!==null&&!Array.isArray(x);
const validIdArray=(value:unknown,pattern:RegExp,name:string):string[]=>{
 if(!Array.isArray(value)||value.length>maxEntries||!value.every(x=>typeof x==='string'&&pattern.test(x)))
  throw new Error(`Backup has invalid ${name}.`);
 return [...new Set(value as string[])];
};
/** Dependency-free strict gate. Never silently accept missing fields or a future schema. */
export function normalizeProgress(input:unknown):UserProgress {
 if(!isRecord(input))throw Error('Backup progress must be an object.');
 if(input.schemaVersion!==1&&input.schemaVersion!==2)throw Error(`Unsupported user-data schema version ${String(input.schemaVersion)}; this app supports versions 1 and 2.`);
 const bookmarks=validIdArray(input.bookmarks,bookmarkId,'bookmarks');
 const recentlyViewed=validIdArray(input.recentlyViewed,bookmarkId,'recently viewed identifiers').slice(0,18);
 const completedExercises=validIdArray(input.completedExercises,exerciseId,'completed exercises');
 if(!isRecord(input.learningProgress)||Object.keys(input.learningProgress).length>maxEntries||
    Object.entries(input.learningProgress).some(([key,value])=>!/^PATH-\d{4}$/.test(key)||typeof value!=='boolean'))
  throw Error('Backup has invalid learning progress.');
 if(completedExercises.some(id=>!rawExercises.some(e=>e.id===id)))throw Error('Unknown completed exercise identifier');
 if(Object.keys(input.learningProgress).some(id=>!rawPaths.some(p=>p.id===id)))throw Error('Unknown learning path identifier');
 const academyAttempts:Record<string,AcademyAttempt>={};
 if(input.academyAttempts!==undefined){
  if(!isRecord(input.academyAttempts)||Object.keys(input.academyAttempts).length>rawExercises.length)throw Error('Invalid Academy attempts');
  for(const [id,a] of Object.entries(input.academyAttempts)){const ex=rawExercises.find(e=>e.id===id);if(!ex||!isRecord(a)||a.exerciseId!==id||typeof a.revision!=='number'||!Number.isInteger(a.revision)||a.revision<1||a.revision>(ex.revision??1)||!Array.isArray(a.choiceIds)||!a.choiceIds.every(x=>typeof x==='string'))throw Error('Invalid Academy attempt');const choices=a.choiceIds as string[];const exerciseType=ex.exerciseType;
   if(exerciseType!=='multiple_choice'&&exerciseType!=='evidence_classification'&&exerciseType!=='multiple_interpretations')throw Error('Invalid exercise type');
   const explanations:Record<string,string>={};
   for(const [key,value] of Object.entries(ex.explanations)){if(typeof value==='string')explanations[key]=value;}
   const exercise:ExerciseInput={id:ex.id,exerciseType,choices:ex.choices,evaluationRules:ex.evaluationRules,explanations,revision:ex.revision};
   evaluateExercise(exercise,choices);academyAttempts[id]={exerciseId:id,revision:a.revision,choiceIds:choices};}
 }
 const scenarioProgress:Record<string,ScenarioSession>={};
 if(input.schemaVersion===2){
  if(!isRecord(input.scenarioProgress)||Object.keys(input.scenarioProgress).length>scenarios.length)throw Error('Backup has invalid scenario progress.');
  for(const [id,value] of Object.entries(input.scenarioProgress)){
   const scenario=scenarios.find(s=>s.id===id);
   if(!scenario||!isRecord(value)||value.scenarioId!==id||!Array.isArray(value.history)||value.history.length>scenario.steps.length)throw Error(`Invalid scenario session ${id}`);
   const history=value.history.map((entry:unknown)=>{if(!isRecord(entry)||typeof entry.stepId!=='string'||typeof entry.choiceId!=='string')throw Error('Invalid scenario history entry');return {stepId:entry.stepId,choiceId:entry.choiceId};});
   const session={scenarioId:id,history};replayScenario(scenario,session);scenarioProgress[id]=session;
  }
 }
 return {schemaVersion:2,bookmarks,recentlyViewed,completedExercises,learningProgress:{...input.learningProgress} as Record<string,boolean>,scenarioProgress,...(input.academyAttempts!==undefined?{academyAttempts}:{})};
}

export type ReplacementResult<T>={status:'saved'|'cancelled'|'storage_error';value:T};
/** Single guarded, transactional replacement. On cancel or storage failure, keep the old value. */
export function commitProgressReplacement<T>(current:T,next:T,confirmed:boolean,write:(candidate:T)=>boolean):ReplacementResult<T>{
 if(!confirmed)return {status:'cancelled',value:current};
 if(!write(next))return {status:'storage_error',value:current};
 return {status:'saved',value:next};
}
