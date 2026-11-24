import type {Source,SourceReference} from '../domain/schemas';
/** Resolve a locator through its own sourceId; never assume every locator belongs to Greene. */
export function resolveSourceReference(referenceId:string,references:readonly SourceReference[],sources:readonly Source[]){
 const reference=references.find(item=>item.id===referenceId);
 if(!reference)return null;
 const source=sources.find(item=>item.id===reference.sourceId);
 return source?{reference,source}:null;
}
export function referenceSourceUrl(referenceId:string,references:readonly SourceReference[],sources:readonly Source[]):string|null{
 const result=resolveSourceReference(referenceId,references,sources);
 return result?`/sources/${result.source.id}`:null;
}
