import {migrateProgress} from './persistence';
import {serializeProgress,deserializeProgress} from './backup-serialization';
import {readRawProgress} from './progress-storage';
import type {UserProgress} from '../domain/schemas';
export function exportData(progress:UserProgress):string{
 return serializeProgress(migrateProgress(progress));
}
export function importData(text:string):UserProgress{
 return migrateProgress(deserializeProgress(text));
}
export function downloadExport(progress:UserProgress){
 downloadText(exportData(progress),'HNI_PROGRESS_BACKUP.json','application/json');
}
export function downloadRawRecovery(){const raw=readRawProgress();if(raw===null)throw Error('No original progress payload exists.');downloadText(raw,'HNI_RAW_RECOVERY.txt','text/plain');}
function downloadText(text:string,filename:string,type:string){
 const blob=new Blob([text],{type});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
 a.download=filename;document.body.appendChild(a);a.click();a.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),60000);
}
