import {describe,it,expect} from 'vitest';
import {normalizeProgress,commitProgressReplacement} from '../services/progress-validation';
import {extractBackupProgress} from '../services/backup-envelope';
import {resolveSourceReference,referenceSourceUrl} from '../services/source-resolution';
import {sourceLabel,locatorLabel} from '../services/source-labels';
import type {Source,SourceReference} from '../domain/schemas';
const progress=()=>({schemaVersion:1 as const,bookmarks:['LAW-01','LAW-01'],recentlyViewed:['CON-0001'],completedExercises:['EXR-0001'],learningProgress:{'PATH-0001':true}});
describe('Stage 1B import protection',()=>{
 it('validates and deduplicates imported progress',()=>expect(normalizeProgress(extractBackupProgress(JSON.stringify({format:'hni-progress',progress:progress()}))).bookmarks).toEqual(['LAW-01']));
 it('rejects unsupported progress versions',()=>expect(()=>normalizeProgress({...progress(),schemaVersion:3})).toThrow());
 it('rejects invalid backup envelopes',()=>expect(()=>extractBackupProgress('{invalid')).toThrow());
 it('cancel leaves current data untouched',()=>{const original=progress();let writes=0;const result=commitProgressReplacement(original,progress(),false,()=>{writes++;return true;});expect(result.value).toBe(original);expect(writes).toBe(0);});
 it('storage failure cannot replace current data',()=>{const original=progress();const result=commitProgressReplacement(original,progress(),true,()=>false);expect(result.status).toBe('storage_error');expect(result.value).toBe(original);});
 it('confirmed replacement saves new data',()=>{const original=progress();const incoming={...progress(),bookmarks:[]};expect(commitProgressReplacement(original,incoming,true,()=>true).value).toBe(incoming);});
});
describe('Stage 1B source integrity',()=>{
 const fixtures:Source[]=[
  {id:'SRC-0001',author:'Test A',title:'Fixture book',publicationYear:2000,edition:null,publisherOrJournal:null,isbnOrDoi:null,verifiedUrl:null,sourceType:'book',verificationStatus:'directly_inspected'},
  {id:'SRC-0002',author:'Test B',title:'Fixture paper',publicationYear:2020,edition:null,publisherOrJournal:null,isbnOrDoi:null,verifiedUrl:null,sourceType:'journal_article',verificationStatus:'unverified'}
 ];
 const refs:SourceReference[]=[
  {id:'REF-0001',sourceId:'SRC-0001',chapter:'1',section:null,pdfPageIndex:3,printedPage:null,locatorNotes:'Fixture only',verificationStatus:'directly_inspected'},
  {id:'REF-0002',sourceId:'SRC-0002',chapter:null,section:'Discussion',pdfPageIndex:null,printedPage:'27',locatorNotes:'Fixture only',verificationStatus:'unverified'}
 ];
 it('resolves 2 distinct source IDs',()=>{expect(resolveSourceReference('REF-0001',refs,fixtures)?.source.id).toBe('SRC-0001');expect(resolveSourceReference('REF-0002',refs,fixtures)?.source.id).toBe('SRC-0002');});
 it('returns missing when a locator has an invalid source ID',()=>expect(resolveSourceReference('REF-0009',refs,fixtures)).toBeNull());
 it('constructs the linked source route',()=>expect(referenceSourceUrl('REF-0002',refs,fixtures)).toBe('/sources/SRC-0002'));
 it('labels bibliography and locators without inventing PDF provenance',()=>{expect(sourceLabel(fixtures[1])).toContain('Journal article');expect(locatorLabel(refs[1])).toContain('Printed page 27');});
});
