import type {UserProgress} from '../domain/schemas';
import {normalizeProgress} from './progress-validation.ts';
export const STORE_KEY='hni.user-progress.v1';
export const blankProgress=():UserProgress=>({schemaVersion:2,bookmarks:[],recentlyViewed:[],completedExercises:[],learningProgress:{},scenarioProgress:{}});
export type StoredProgressRead={progress:UserProgress;status:'found'|'missing'|'corrupt'|'unavailable'};
/** Access to the localStorage getter itself can throw in restricted browsers. */
function browserStorage():Storage|undefined{try{return typeof localStorage==='undefined'?undefined:localStorage;}catch{return undefined;}}
/** Reading/migration never writes; a bad original stays recoverable. */
export function readStoredProgress(storage:Pick<Storage,'getItem'>|undefined=browserStorage()):StoredProgressRead{
 if(!storage)return {progress:blankProgress(),status:'unavailable'};
 let raw:string|null;try{raw=storage.getItem(STORE_KEY);}catch{return {progress:blankProgress(),status:'unavailable'};}
 if(raw===null)return {progress:blankProgress(),status:'missing'};
 try{return {progress:normalizeProgress(JSON.parse(raw)),status:'found'};}catch{return {progress:blankProgress(),status:'corrupt'};}
}
export function saveProgress(progress:UserProgress,storage:Pick<Storage,'setItem'>|undefined=browserStorage()):boolean{
 try{if(!storage)return false;storage.setItem(STORE_KEY,JSON.stringify(normalizeProgress(progress)));return true;}catch{return false;}
}

/** Explicit read-only recovery: do not normalize or rewrite the original payload. */
export function readRawProgress(storage:Pick<Storage,'getItem'>|undefined=browserStorage()):string|null{
 if(!storage)throw Error('Browser storage is unavailable.');
 return storage.getItem(STORE_KEY);
}
