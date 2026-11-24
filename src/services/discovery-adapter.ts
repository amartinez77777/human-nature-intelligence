import {buildGraph,editorialLink,createLexicalIndex} from './graph-core.ts';
import type {GraphNode,GraphLink} from './graph-core';
import {sourceLabel} from './source-labels.ts';
import type {Law,Concept,HistoricalCase,Claim,Source,SourceReference,Edge,ResearchFindingRecord} from '../domain/schemas';
import type {z} from 'zod';
export interface DiscoveryDataset {laws:Law[];concepts:Concept[];historicalCases:HistoricalCase[];claims:Claim[];researchFindings:z.infer<typeof ResearchFindingRecord>[];sources:Source[];sourceReferences:SourceReference[];knowledgeEdges:Edge[]}
export function makeDiscoveryIndex({laws,concepts,historicalCases,claims,researchFindings,sources,sourceReferences,knowledgeEdges}:DiscoveryDataset){
const evidenceFor=(ids:string[])=>[...new Set(claims.filter(c=>ids.includes(c.id)).map(c=>c.evidenceStatus))];
const claimLaws=(ids:string[])=>[...new Set(claims.filter(c=>ids.includes(c.id)).flatMap(c=>c.relatedLawIds))];
const base:GraphNode[]=[
 ...laws.map(x=>({id:x.id,type:'law' as const,title:x.chapterSubtitle??x.chapterTitle,description:x.centralArgument??'',indexText:[x.chapterTitle,x.explanation,...x.mechanisms,...x.distinctions,...x.alternativeExplanations,...x.behavioralPatterns].join(' '),lawIds:[x.id],evidence:evidenceFor(x.claimIds),referenceIds:x.sourceReferenceIds})),
 ...concepts.map(x=>({id:x.id,type:'concept' as const,title:x.name,description:x.definition,indexText:[x.mechanism,...x.observableIndicators,...x.alternativeExplanations,...x.commonMisinterpretations,...x.levelsOfExplanation.map(level=>level.replaceAll('_',' '))].join(' '),lawIds:x.relatedLawIds,evidence:evidenceFor(x.claimIds),referenceIds:x.sourceReferenceIds})),
 ...historicalCases.map(x=>({id:x.id,type:'historical_case' as const,title:x.title,description:x.context,indexText:[...x.people,x.historicalPeriod,...x.documentedFacts,...x.alternativeInterpretations,...x.chronology.map(c=>`${c.dateLabel} ${c.event}`)].join(' '),lawIds:x.relatedLawIds,evidence:evidenceFor(x.greeneInterpretationClaimIds),referenceIds:x.sourceReferenceIds})),
 ...claims.map(x=>({id:x.id,type:'claim' as const,title:`${x.id} · ${x.statement}`,description:x.statement,indexText:[x.attributedTo,...x.qualifications].join(' '),lawIds:x.relatedLawIds,evidence:[x.evidenceStatus],referenceIds:x.sourceReferenceIds})),
 ...researchFindings.map(x=>({id:x.id,type:'research_finding' as const,title:x.researchQuestion,description:x.finding,indexText:[x.method,x.populationOrContext,...x.limitations].join(' '),lawIds:claimLaws(x.relatedClaimIds),evidence:[x.evidenceAssessment],referenceIds:x.sourceReferenceIds}))
];
const graphNodes:GraphNode[]=[...base,...sources.map(s=>{const refIds=sourceReferences.filter(r=>r.sourceId===s.id).map(r=>r.id);const linked=base.filter(n=>n.referenceIds.some(id=>refIds.includes(id)));return {id:s.id,type:'source' as const,title:s.title,description:`${s.author} · ${sourceLabel(s)}`,indexText:[s.publicationYear,s.publisherOrJournal,s.isbnOrDoi,s.edition].join(' '),lawIds:[...new Set(linked.flatMap(n=>n.lawIds))],evidence:[],referenceIds:refIds};})];
const recordLinks:GraphLink[]=[];
function add(from:string,to:string,relation:string,explanation:string,referenceIds:string[]){recordLinks.push({id:`link:${from}:${relation}:${to}`,from,to,kind:'record_link',relation,explanation,referenceIds,provenance:'canonical record association',verification:'not an independent relationship assessment'});}
for(const c of claims){for(const law of c.relatedLawIds)add(law,c.id,'attributed_claim','The claim record explicitly lists this law; this is a catalog association, not empirical support.',c.sourceReferenceIds);for(const id of c.researchFindingIds){const f=researchFindings.find(x=>x.id===id);if(f)add(c.id,id,'assessed_by',`The claim links to this independent finding; assessment: ${f.evidenceAssessment.replaceAll('_',' ')}. Read its scope and limitations.`,f.sourceReferenceIds);}}
for(const n of base){const groups=new Map<string,string[]>();for(const id of n.referenceIds){const r=sourceReferences.find(x=>x.id===id);if(r){const refs=groups.get(r.sourceId)??[];refs.push(id);groups.set(r.sourceId,refs);}}for(const [source,refs] of groups)add(n.id,source,'cites','The record references this source via the displayed locators. Citation does not establish truth.',refs);}
const graph=buildGraph(graphNodes,[...knowledgeEdges.map(editorialLink),...recordLinks]);
const lexicalIndex=createLexicalIndex(graphNodes);

return {graph,graphNodes,lexicalIndex};
}
