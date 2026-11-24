import {evaluateExercise,lessonComplete,type AcademyAttempt,type ExerciseInput} from './exercise-engine.ts';
import type {UserProgress} from '../domain/schemas';
/** Pure merge used by actual provider; caller commits only after successful storage write. */
export function recordAcademyAttempt(current:UserProgress,attempt:AcademyAttempt,exercises:readonly ExerciseInput[],paths:readonly {id:string;lessons?:{exerciseIds:string[]}[]}[]):UserProgress{
 const ex=exercises.find(e=>e.id===attempt.exerciseId);if(!ex||attempt.revision!==(ex.revision??1))throw Error('Exercise or revision unavailable');
 const result=evaluateExercise(ex,attempt.choiceIds);const completedExercises=result.complete?[...new Set([...current.completedExercises,ex.id])]:[...current.completedExercises];
 const learningProgress={...current.learningProgress};for(const path of paths)if(path.lessons?.length&&path.lessons.every(l=>lessonComplete(l,completedExercises)))learningProgress[path.id]=true;
 return {...current,completedExercises,learningProgress,academyAttempts:{...current.academyAttempts,[ex.id]:{...attempt,choiceIds:[...attempt.choiceIds]}}};
}
