export type StepKind='observation'|'interpretation'|'assessment'|'missing_information'|'revision'|'response'|'reflection';
export type Evaluation='well_supported'|'defensible'|'needs_review';
export interface ScenarioChoice {id:string;label:string;evaluation:Evaluation;explanation:string;nextStepId:string|null}
export interface ScenarioStep {id:string;kind:StepKind;prompt:string;evidenceIds:string[];choices:ScenarioChoice[];qualification:string}
export interface Scenario {id:string;title:string;description:string;context:string;characters:string[];learningObjectives:string[];difficulty:'intermediate'|'advanced';fictional:true;observations:string[];interpretations:string[];evidenceItems:{id:string;text:string;kind:'observation'|'report'|'document'}[];entryStepId:string;steps:ScenarioStep[];finalAnalysis:string[];uncertaintyNotes:string[];ethicalConsiderations:string[];relatedLawIds:string[];relatedConceptIds:string[];relatedCaseIds:string[];relatedClaimIds:string[];relatedResearchFindingIds:string[];sourceReferenceIds:string[];editorialStatus:'provisional'}
export interface ScenarioSession {scenarioId:string;history:{stepId:string;choiceId:string}[]}
