/** Deterministic, source-aware perspectives. No research claims are inferred by the app. */
export interface PerspectiveClaim {id:string;statement:string;evidenceStatus:string;researchFindingIds:string[]}
export interface PerspectiveFinding {id:string;finding:string;evidenceAssessment:string}
export function summarizePerspectives(claimIds:string[],allClaims:PerspectiveClaim[],allFindings:PerspectiveFinding[]){
 const selected=claimIds.map(id=>allClaims.find(c=>c.id===id)).filter((item):item is PerspectiveClaim=>Boolean(item));
 const linked=selected.flatMap(c=>c.researchFindingIds).map(id=>allFindings.find(f=>f.id===id)).filter((x):x is PerspectiveFinding=>Boolean(x));
 const unmatchedIds=claimIds.filter(id=>!selected.some(c=>c.id===id));
 return {claims:selected,findings:linked,missingClaimIds:unmatchedIds,evidenceLabel:linked.length ? [...new Set(linked.map(x=>x.evidenceAssessment))].join(', ').replaceAll('_',' ') : 'Not independently assessed',assessmentComplete:linked.length>0};
}
