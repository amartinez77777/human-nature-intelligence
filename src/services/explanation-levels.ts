/** Stable, read-only analysis facet; a concept or case can have several levels. */
import type {ExplanationLevelName} from '../domain/schemas';
export const explanationLevels:ReadOnlyArray<{value:ExplanationLevelName;label:string;definition:string}>=[
 {value:'individual',label:'Individual',definition:'Choices, interpretations and processes within a person.'},
 {value:'interpersonal',label:'Interpersonal',definition:'Interactions, expectations and influence between people.'},
 {value:'group',label:'Group',definition:'Norms, coordinated action and social dynamics of groups.'},
 {value:'historical_institutional',label:'Historical / institutional',definition:'Political, cultural, material and institutional settings.'}
];
export type LevelFilter='all'|'unclassified'|ExplanationLevelName;
export const hasLevel=(levels:readonly ExplanationLevelName[],filter:LevelFilter)=>filter==='all'||(filter==='unclassified' ? levels.length===0:levels.includes(filter));
export const levelLabel=(value:ExplanationLevelName)=>explanationLevels.find(level=>level.value===value)?.label??value;
