import {graphNodes,lexicalIndex} from './discovery-index';
import {rankedSearch,type SearchFilters,type GraphNode} from './graph-core';
export type SearchHit=GraphNode;
export const searchable=graphNodes;
export function search(query:string,limit=30,filters:SearchFilters={}):SearchHit[]{if(!query.trim()&&!Object.values(filters).some(x=>x&&x!=='all'))return [];return rankedSearch(lexicalIndex,query,filters,limit);}
