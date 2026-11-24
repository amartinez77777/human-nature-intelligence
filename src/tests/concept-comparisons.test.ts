import {describe,it,expect} from 'vitest';
import {conceptComparisons,findConcept,findLaw,findReference,findSource} from '../services/repository';
import {validateDataset} from '../domain/validator';
import {rawDataset} from '../services/repository';
describe('Stage 03 curated comparative concepts',()=>{
 it('has 4 distinct, reader-visible and source-linked comparisons',()=>{
  expect(conceptComparisons).toHaveLength(4);
  expect(new Set(conceptComparisons.map(c=>c.id)).size).toBe(4);
  for(const comparison of conceptComparisons){
   expect(findConcept(comparison.leftConceptId)).toBeDefined();
   expect(findConcept(comparison.rightConceptId)).toBeDefined();
   expect(comparison.leftConceptId).not.toBe(comparison.rightConceptId);
   comparison.relatedLawIds.forEach(id=>expect(findLaw(id)).toBeDefined());
   comparison.sourceReferenceIds.forEach(id=>{
    const reference=findReference(id);expect(reference).toBeDefined();
    expect(findSource(reference!.sourceId)).toBeDefined();
   });
  }
 });
 it('cannot accept a broken concept lookup',()=>{
  const data=structuredClone(rawDataset);
  data.conceptComparisons.comparisons[0].rightConceptId='CON-9999';
  expect(validateDataset(data).errors.some(e=>e.code==='BROKEN_COMPARISON_CONCEPT')).toBe(true);
 });
});
