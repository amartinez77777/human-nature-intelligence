import {describe,it,expect} from 'vitest';
import {graph,graphNodes,lexicalIndex} from '../services/discovery-index';
import {filteredLinks,neighborhood,rankedSearch} from '../services/graph-core';
import {entityUrl} from '../domain/entity-types';
import {knowledgeEdges} from '../services/repository';
describe('canonical discovery graph',()=>{
 it('retains all editorial relationships and resolves evidence navigation',()=>{expect(graph.issues).toEqual([]);expect(graphNodes).toHaveLength(146);expect([...graph.byLink.values()].filter(e=>e.kind==='editorial')).toHaveLength(knowledgeEdges.length);expect(filteredLinks(graph,'CLM-0006',{relation:'assessed_by'}).map(e=>e.to)).toEqual(['RES-0001']);expect(entityUrl('research_finding','RES-0001')).toBe('/evidence/findings/RES-0001');});
 it('bounds both one and two hop neighborhoods',()=>{for(const n of graphNodes){expect(neighborhood(graph,n.id,{},true,18).nodes.length).toBeLessThanOrEqual(18);}});
 it('combines deterministic lexical and evidence filters',()=>{expect(rankedSearch(lexicalIndex,'confirmation bias')[0]?.id).toBe('CON-0001');expect(rankedSearch(lexicalIndex,'',{law:'LAW-03',type:'research_finding',evidence:'limited'}).map(n=>n.id)).toEqual(['RES-0001']);});
});
