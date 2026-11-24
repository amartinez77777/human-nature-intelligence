import {it,expect,describe} from 'vitest';
import {blankProgress,migrateProgress} from '../services/persistence';
import {exportData,importData} from '../services/import-export';
describe('local-first progress migration and backup',()=>{
 it('accepts current version and deduplicates bookmarks',()=>{const p=blankProgress();p.bookmarks=['LAW-01','LAW-01'];expect(migrateProgress(p).bookmarks).toEqual(['LAW-01']);});
 it('does not silently migrate future versions',()=>expect(()=>migrateProgress({...blankProgress(),schemaVersion:3})).toThrow());
 it('roundtrips exported personal data',()=>{const p=blankProgress();p.bookmarks=['LAW-01'];expect(importData(exportData(p))).toEqual(p);});
 it('rejects non-HNI JSON',()=>expect(()=>importData('{"other":true}')).toThrow());
});
