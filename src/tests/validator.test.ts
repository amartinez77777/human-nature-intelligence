import {describe,it,expect} from 'vitest';
import {validateDataset,type RawDataset} from '../domain/validator';
import {rawDataset} from '../services/repository';
const fixture=()=>structuredClone(rawDataset) as RawDataset;
describe('canonical data validator',()=>{
 it('accepts current data and warns on incomplete research',()=>{const r=validateDataset(fixture());expect(r.valid).toBe(true);expect(r.warnings.length).toBe((fixture().laws as {editorialStatus:string}[]).filter(l=>l.editorialStatus==='awaiting_review').length);});
 it('rejects a duplicate ID',()=>{const d=fixture();(d.laws as Record<string,unknown>[])[1].id='LAW-01';expect(validateDataset(d).errors.some(e=>e.code==='DUPLICATE_ID')).toBe(true);});
 it('rejects a missing reference',()=>{const d=fixture();(d.laws as Record<string,unknown>[])[0].relatedConceptIds=['CON-9999'];expect(validateDataset(d).errors.some(e=>e.code==='BROKEN_REFERENCE')).toBe(true);});
 it('rejects invalid knowledge endpoints',()=>{const d=fixture();(d.knowledgeEdges as Record<string,unknown>[])[0].toEntityId='CON-9999';expect(validateDataset(d).errors.some(e=>e.code==='INVALID_EDGE_ENDPOINT')).toBe(true);});
 it('rejects PDF page outside source',()=>{const d=fixture();(d.sourceReferences as Record<string,unknown>[])[0].pdfPageIndex=9999;expect(validateDataset(d).errors.some(e=>e.code==='INVALID_LOCATOR')).toBe(true);});
 it('rejects unknown status',()=>{const d=fixture();(d.laws as Record<string,unknown>[])[0].editorialStatus='secret';expect(validateDataset(d).errors.some(e=>e.code==='SCHEMA_INVALID')).toBe(true);});
 it('rejects nonexistent answer choice',()=>{const d=fixture();((d.exercises as {evaluationRules:{correctChoiceIds:string[]}}[])[0].evaluationRules).correctChoiceIds=['Z'];expect(validateDataset(d).errors.some(e=>e.code==='INVALID_EXERCISE_ANSWER')).toBe(true);});
 it('rejects incompatible dataset schema',()=>{const d=fixture();d.manifest={...(d.manifest as object),schemaVersion:9};expect(validateDataset(d).errors.some(e=>e.code==='INVALID_SCHEMA_VERSION')).toBe(true);});
});
