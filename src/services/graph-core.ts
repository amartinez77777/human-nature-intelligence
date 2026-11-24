import type {EntityType} from '../domain/entity-types';
import type {Edge} from '../domain/schemas';
export interface GraphNode {id:string;type:EntityType;title:string;description:string;lawIds:string[];evidence:string[];indexText:string;referenceIds:string[]}
export interface GraphLink {id:string;from:string;to:string;kind:'editorial'|'record_link';relation:string;explanation:string;referenceIds:string[];provenance:string;verification:string}
export interface GraphFilters {relation?:string;type?:string;query?:string;editorialOnly?:boolean}
export function editorialLink(e:Edge):GraphLink{return {id:e.id,from:e.fromEntityId,to:e.toEntityId,kind:'editorial',relation:e.relationshipType,explanation:e.explanation,referenceIds:e.sourceReferenceIds,provenance:e.provenanceType,verification:e.verificationStatus}}
export function buildGraph(nodes:readonly GraphNode[],links:readonly GraphLink[]){
 const byId=new Map(nodes.map(n=>[n.id,n]));const byLink=new Map<string,GraphLink>();const adjacency=new Map<string,GraphLink[]>();const issues:string[]=[];
 if(byId.size!==nodes.length)issues.push('Duplicate node ID');
 for(const link of links){if(byLink.has(link.id)){issues.push(`Duplicate link ${link.id}`);continue;}if(!byId.has(link.from)||!byId.has(link.to)||link.from===link.to){issues.push(`Invalid endpoints ${link.id}`);continue;}byLink.set(link.id,link);for(const id of [link.from,link.to]){const bucket=adjacency.get(id)??[];bucket.push(link);adjacency.set(id,bucket);}}
 return {byId,byLink,adjacency,issues};
}
export type GraphIndex=ReturnType<typeof buildGraph>;
export const neighbor=(link:GraphLink,id:string)=>link.from===id?link.to:link.from;
export function filteredLinks(graph:GraphIndex,focus:string,filters:GraphFilters={}){
 const base=focus?graph.adjacency.get(focus)??[]:[...graph.byLink.values()];const q=filters.query?.trim().toLowerCase()??'';
 return base.filter(e=>{const a=graph.byId.get(e.from),b=graph.byId.get(e.to);const types=focus?[graph.byId.get(neighbor(e,focus))?.type]:[a?.type,b?.type];return (!filters.relation||filters.relation==='all'||e.relation===filters.relation)&&(!filters.type||filters.type==='all'||types.includes(filters.type as EntityType))&&(!filters.editorialOnly||e.kind==='editorial')&&(!q||`${e.id} ${e.explanation} ${e.relation} ${a?.title} ${b?.title} ${e.from} ${e.to}`.toLowerCase().includes(q));});
}
/** A bounded one/two-hop view; list and diagram use exactly the same link set. */
export function neighborhood(graph:GraphIndex,focus:string,filters:GraphFilters={},expanded=false,cap=16){
 const ids=new Set<string>();if(!graph.byId.has(focus))return {nodes:[] as GraphNode[],links:[] as GraphLink[],omitted:0};ids.add(focus);
 const direct=filteredLinks(graph,focus,filters);const candidates=[...direct];
 if(expanded){for(const e of direct){const id=neighbor(e,focus);candidates.push(...filteredLinks(graph,id,filters));}}
 const unique=[...new Map(candidates.map(e=>[e.id,e])).values()];const links:GraphLink[]=[];
 for(const e of unique){const missing=[e.from,e.to].filter(id=>!ids.has(id));if(ids.size+missing.length>cap)continue;missing.forEach(id=>ids.add(id));links.push(e);}
 return {nodes:[...ids].map(id=>graph.byId.get(id)!),links,omitted:unique.length-links.length};
}
export function radialLayout(ids:string[],focus:string){const rest=ids.filter(id=>id!==focus);return new Map([[focus,{x:400,y:300}],...rest.map((id,i)=>{const angle=2*Math.PI*i/rest.length-Math.PI/2;return [id,{x:400+290*Math.cos(angle),y:300+220*Math.sin(angle)}] as const;})]);}
export interface SearchFilters {type?:string;law?:string;evidence?:string}
export const normalizeLexical=(value:string)=>value.normalize('NFKC').replace(/[‘’]/g,"'").toLowerCase();
export function createLexicalIndex(nodes:readonly GraphNode[]){return nodes.map(hit=>({hit,title:normalizeLexical(`${hit.title} ${hit.id}`),body:normalizeLexical(`${hit.description} ${hit.indexText}`)}));}
export function rankedSearch(index:ReturnType<typeof createLexicalIndex>,query:string,filters:SearchFilters={},limit=50){const q=normalizeLexical(query.trim());const tokens=q.split(/\s+/).filter(Boolean);return index.filter(({hit})=>(!filters.type||filters.type==='all'||hit.type===filters.type)&&(!filters.law||filters.law==='all'||hit.lawIds.includes(filters.law))&&(!filters.evidence||filters.evidence==='all'||hit.evidence.includes(filters.evidence))).map(({hit,title,body})=>({hit,score:tokens.every(t=>title.includes(t)||body.includes(t))?tokens.reduce((sum,t)=>sum+(title.includes(t)?8:0)+(body.includes(t)?1:0),0)+(q&&title.includes(q)?12:0)+(q&&hit.id.toLowerCase()===q?30:0):-1})).filter(r=>r.score>=0).sort((a,b)=>b.score-a.score||a.hit.id.localeCompare(b.hit.id)).slice(0,limit).map(x=>x.hit);}
export function sharedIds(a:readonly string[],b:readonly string[]){const set=new Set(b);return [...new Set(a)].filter(id=>set.has(id));}

/** Verbatim excerpt from the canonical indexed fields, not generated interpretation. */
export function searchSnippet(hit:GraphNode,query:string,max=250){const text=`${hit.description} ${hit.indexText}`.trim();const words=normalizeLexical(query).split(/\s+/).filter(Boolean);const body=normalizeLexical(text);const positions=words.map(word=>body.indexOf(word)).filter(i=>i>=0);const start=positions.length?Math.max(0,Math.min(...positions)-55):0;return (start?'…':'')+text.slice(start,start+max)+(start+max<text.length?'…':'');}
