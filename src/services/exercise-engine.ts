export type ExerciseKind='multiple_choice'|'evidence_classification'|'multiple_interpretations';
export interface ExerciseInput {id:string;exerciseType:ExerciseKind;choices:{id:string;text:string}[];evaluationRules:{correctChoiceIds:string[]};explanations:Record<string,string>;revision?:number}
export interface AcademyAttempt {exerciseId:string;revision:number;choiceIds:string[]}
export function evaluateExercise(ex:ExerciseInput,choiceIds:string[]){
 const allowed=new Set(ex.choices.map(c=>c.id)),correct=new Set(ex.evaluationRules.correctChoiceIds);
 if(!['multiple_choice','evidence_classification','multiple_interpretations'].includes(ex.exerciseType)||allowed.size!==ex.choices.length||!correct.size||correct.size!==ex.evaluationRules.correctChoiceIds.length||[...correct].some(id=>!allowed.has(id))||[...allowed].some(id=>!ex.explanations[id]?.trim())||(ex.exerciseType!=='multiple_interpretations'&&correct.size!==1))throw Error('Invalid exercise definition');
 if(!Array.isArray(choiceIds)||!choiceIds.length||new Set(choiceIds).size!==choiceIds.length||choiceIds.some(id=>!allowed.has(id))||(ex.exerciseType!=='multiple_interpretations'&&choiceIds.length!==1))throw Error('Invalid answer selection');
 const selected=new Set(choiceIds);return {complete:correct.size===selected.size&&[...correct].every(id=>selected.has(id)),feedback:ex.choices.map(c=>({id:c.id,text:c.text,selected:selected.has(c.id),supported:correct.has(c.id),explanation:ex.explanations[c.id]}))};
}
export function nextExercise(ids:readonly string[],completed:readonly string[]){return ids.find(id=>!completed.includes(id));}
export function lessonComplete(lesson:{exerciseIds:readonly string[]},completed:readonly string[]){return lesson.exerciseIds.length>0&&lesson.exerciseIds.every(id=>completed.includes(id));}
export function resumeLesson<T extends {exerciseIds:readonly string[]}>(lessons:readonly T[],completed:readonly string[]):T|undefined{return lessons.find(l=>!lessonComplete(l,completed))??lessons[0];}
