import type {Scenario,ScenarioSession,ScenarioStep} from '../domain/scenario-types';
export const startScenario=(scenario:Scenario):ScenarioSession=>({scenarioId:scenario.id,history:[]});
/** History is the only persisted state. Replay validates every transition and recomputes feedback. */
export function replayScenario(scenario:Scenario,session:ScenarioSession){
 if(session.scenarioId!==scenario.id||!Array.isArray(session.history)||session.history.length>scenario.steps.length)throw Error('Invalid scenario history');
 let stepId:string|null=scenario.entryStepId;
 const seen=new Set<string>();const evidenceIds=new Set<string>();
 const feedback=session.history.map(entry=>{
  if(stepId!==entry.stepId||seen.has(entry.stepId))throw Error('Invalid step sequence');
  const step=scenario.steps.find(s=>s.id===stepId);const choice=step?.choices.find(c=>c.id===entry.choiceId);
  if(!step||!choice)throw Error('Invalid saved choice');
  seen.add(step.id);step.evidenceIds.forEach(id=>evidenceIds.add(id));stepId=choice.nextStepId;
  return {step,choice};
 });
 const current:ScenarioStep|undefined=scenario.steps.find(s=>s.id===stepId);
 if(stepId!==null&&!current)throw Error('Invalid transition target');
 current?.evidenceIds.forEach(id=>evidenceIds.add(id));
 return {current,completed:stepId===null,feedback,evidence:scenario.evidenceItems.filter(e=>evidenceIds.has(e.id))};
}
export function submitChoice(scenario:Scenario,session:ScenarioSession,choiceId:string):ScenarioSession{
 const {current}=replayScenario(scenario,session);
 if(!current||!current.choices.some(c=>c.id===choiceId))throw Error('Choice is not available');
 const next={scenarioId:scenario.id,history:[...session.history,{stepId:current.id,choiceId}]};replayScenario(scenario,next);return next;
}
export function resumeScenario(scenario:Scenario,session:ScenarioSession|undefined){
 if(!session)return {session:startScenario(scenario),recovered:false};
 try{replayScenario(scenario,session);return {session,recovered:false};}catch{return {session:startScenario(scenario),recovered:true};}
}
