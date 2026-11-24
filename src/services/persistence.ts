import {UserProgressRecord,type UserProgress} from '../domain/schemas';
import {normalizeProgress} from './progress-validation';
import {readStoredProgress} from './progress-storage';
export {STORE_KEY,blankProgress,readStoredProgress,saveProgress} from './progress-storage';
export type {StoredProgressRead} from './progress-storage';
/** The normalized version 2 data is additionally checked by the Zod runtime schema. */
export function migrateProgress(input:unknown):UserProgress{
 const parsed=UserProgressRecord.safeParse(normalizeProgress(input));
 if(!parsed.success)throw Error('The file does not contain valid HNI version 1 or 2 progress data.');
 return parsed.data;
}
export function loadProgress():UserProgress{return readStoredProgress().progress;}
