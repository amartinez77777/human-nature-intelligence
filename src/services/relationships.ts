import { knowledgeEdges } from './repository';
import type { EntityType } from '../domain/entity-types';
const adjacency=new Map<string,typeof knowledgeEdges>();
for(const e of knowledgeEdges){for(const id of new Set([e.fromEntityId,e.toEntityId])){const list=adjacency.get(id)??[];list.push(e);adjacency.set(id,list);}}
export function edgesFor(type: EntityType,id:string) {
 return (adjacency.get(id)??[]).filter(e=>(e.fromEntityType===type && e.fromEntityId===id)||(e.toEntityType===type && e.toEntityId===id));
}
export function otherEnd(edge: (typeof knowledgeEdges)[number],type:EntityType,id:string){
 return edge.fromEntityType===type && edge.fromEntityId===id ? {type:edge.toEntityType,id:edge.toEntityId}: {type:edge.fromEntityType,id:edge.fromEntityId};
}
