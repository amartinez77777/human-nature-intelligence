import {it,expect} from 'vitest';
import {laws,concepts,historicalCases,claims,knowledgeEdges,sourceReferences} from '../services/repository';
import {search} from '../services/search';
import {resolveSourceReference} from '../services/source-resolution';
import {sources} from '../services/repository';
it('integrates Laws 16–18 with stable IDs, concept, case and source navigation',()=>{
 expect(laws).toHaveLength(18);
 for (let n=16;n<=18;n++) {const id=`LAW-${n}`;const law=laws.find(x=>x.id===id);
  expect(law?.editorialStatus).toBe('partially_reviewed');
  expect(law?.relatedConceptIds.length).toBe(3);
  expect(law?.historicalCaseIds.length).toBe(1);
  expect(law?.claimIds.length).toBe(2);
  for(const ref of law?.sourceReferenceIds??[])
   expect(resolveSourceReference(ref,sourceReferences,sources)?.source.id).toBe('SRC-0001');
 }
 expect(concepts).toHaveLength(54);expect(historicalCases).toHaveLength(18);expect(claims).toHaveLength(38);
 expect(knowledgeEdges).toHaveLength(127);
});
it('finds newly ingested concepts and final chapters using canonical search',()=>{
 expect(search('mortality').some(x=>x.id==='LAW-18'||x.id==='CON-0052')).toBe(true);
 expect(search('Instrumental intimidation').some(x=>x.id==='CON-0047')).toBe(true);
});
