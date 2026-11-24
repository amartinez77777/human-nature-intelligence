import {normalizeProgress} from './progress-validation.ts';
import {extractBackupProgress} from './backup-envelope.ts';
import type {UserProgress} from '../domain/schemas';
export function serializeProgress(progress:UserProgress,exportedAt=new Date().toISOString()):string{return JSON.stringify({format:'hni-progress',exportedAt,progress:normalizeProgress(progress)},null,2);}
export function deserializeProgress(text:string):UserProgress{return normalizeProgress(extractBackupProgress(text));}
