import type {Scenario} from './scenario-types';
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const text=(v:unknown):v is string=>typeof v==='string'&&v.trim().length>0;
const texts=(v:unknown):v is string[]=>Array.isArray(v)&&v.every(text);
const rows=(v:unknown):v is Record<string,unknown>[]=>Array.isArray(v)&&v.every(record);
const kinds=['observation','interpretation','assessment','missing_information','revision','response','reflection'];
export const scenarioRefFields={relatedLawIds:'laws',relatedConceptIds:'concepts',relatedCaseIds:'historicalCases',relatedClaimIds:'claims',relatedResearchFindingIds:'researchFindings',sourceReferenceIds:'sourceReferences'} as const;
export function parseScenarios(input:unknown,catalog?:Record<string,readonly {id:string}[]>):Scenario[]{
 if(!record(input)||input.schemaVersion!==1||!rows(input.scenarios))throw Error('Invalid scenario dataset version or records');
 const ids=new Set<string>();
 for(const s of input.scenarios){
  const fail=(message:string):never=>{throw Error(`${String(s.id)}: ${message}`)};
  if(!text(s.id)||!/^SIM-\d{4}$/.test(s.id)||ids.has(s.id))throw Error('Duplicate or invalid scenario ID');ids.add(s.id);
  for(const f of ['title','description','context','entryStepId'])if(!text(s[f]))fail(`missing ${f}`);
  if(s.fictional!==true||s.editorialStatus!=='provisional'||!['intermediate','advanced'].includes(String(s.difficulty)))fail('Invalid classification');
  for(const f of ['characters','learningObjectives','observations','interpretations','finalAnalysis','uncertaintyNotes','ethicalConsiderations',...Object.keys(scenarioRefFields)])if(!texts(s[f]))fail(`invalid ${f}`);
  const typed=s as unknown as Scenario;
  if(!typed.context.trim()||!typed.observations.length||!typed.characters.length||!typed.learningObjectives.length||!typed.uncertaintyNotes.length||!typed.ethicalConsiderations.length||typed.interpretations.length<3||typed.finalAnalysis.length<3||!typed.sourceReferenceIds.length||!typed.relatedLawIds.length||!typed.relatedConceptIds.length)fail('Missing instructional depth or source links');
  for(const [field,collection] of Object.entries(scenarioRefFields)){const refs=s[field] as string[];if(new Set(refs).size!==refs.length)fail(`duplicate ${field}`);if(catalog&&refs.some(id=>!catalog[collection]?.some(x=>x.id===id)))fail(`broken ${field}`);}
  if(!rows(s.evidenceItems)||!rows(s.steps))fail('Invalid steps or evidence');
  const evidence=new Set<string>();for(const e of typed.evidenceItems){if(!text(e.id)||!text(e.text)||!['observation','report','document'].includes(e.kind)||evidence.has(e.id))fail('Invalid evidence');evidence.add(e.id);}
  const steps=new Map<string,Scenario['steps'][number]>();const choices=new Set<string>();
  for(const step of typed.steps){
   if(!text(step.id)||steps.has(step.id)||!kinds.includes(step.kind)||!text(step.prompt)||!text(step.qualification)||!texts(step.evidenceIds)||step.evidenceIds.some(id=>!evidence.has(id))||!rows(step.choices)||step.choices.length<2)fail('Invalid step');steps.set(step.id,step);
   for(const c of step.choices){if(!text(c.id)||choices.has(c.id)||!text(c.label)||!text(c.explanation)||!['well_supported','defensible','needs_review'].includes(c.evaluation)||!(c.nextStepId===null||text(c.nextStepId)))fail('Invalid choice or feedback');choices.add(c.id);}
  }
  for(const k of kinds.filter(x=>x!=='reflection'))if(!typed.steps.some(step=>step.kind===k))fail(`Missing phase ${k}`);
  const visited=new Set<string>();const active=new Set<string>();
  function visit(id:string){if(active.has(id))fail('Cyclic transition');if(visited.has(id))return;const step=steps.get(id);if(!step)throw Error(`Invalid transition ${id}`);active.add(id);for(const c of step.choices){if(c.nextStepId!==null)visit(c.nextStepId);else if(step.kind!=='response')fail('Premature completion');}active.delete(id);visited.add(id);}
  visit(typed.entryStepId);if(visited.size!==steps.size)fail('Unreachable steps');
  // Every terminal path must pass all six instructional phases in order, with optional reflection.
  const phases=kinds.filter(x=>x!=='reflection');const checkedPaths=new Set<string>();
  function checkPath(id:string,phase:number){const key=`${id}:${phase}`;if(checkedPaths.has(key))return;checkedPaths.add(key);const step=steps.get(id)!;const next=step.kind==='reflection'?phase:phase+1;if(step.kind!=='reflection'&&step.kind!==phases[phase])fail('Out-of-order instructional phase');for(const c of step.choices){if(c.nextStepId===null){if(next!==phases.length)fail('Incomplete instructional path');}else checkPath(c.nextStepId,next);}}
  checkPath(typed.entryStepId,0);
 }
 return input.scenarios as unknown as Scenario[];
}
