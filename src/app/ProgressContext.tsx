import type {AcademyAttempt} from '../services/exercise-engine';
import {recordAcademyAttempt} from '../services/academy-progress';
import {exercises,learningPaths} from '../services/repository';
import {createContext,useContext,useRef,useState,type ReactNode} from 'react';
import {readStoredProgress,saveProgress} from '../services/persistence';
import {commitProgressReplacement} from '../services/progress-validation';
import type {ScenarioSession} from '../domain/scenario-types';
import type {UserProgress} from '../domain/schemas';
type Context={progress:UserProgress;bookmark:(id:string)=>void;view:(id:string)=>void;complete:(id:string)=>boolean;replace:(data:UserProgress)=>boolean;saveScenario:(session:ScenarioSession)=>boolean;saveAttempt:(attempt:AcademyAttempt)=>boolean;storageWarning:boolean;storageCorrupt:boolean};
const ProgressContext=createContext<Context|undefined>(undefined);
export function ProgressProvider({children}:{children:ReactNode}){
 const initial=useRef<ReturnType<typeof readStoredProgress>|null>(null);
 if(initial.current===null)initial.current=readStoredProgress();
 const [progress,setProgress]=useState<UserProgress>(initial.current.progress);
 const current=useRef(progress);
 const [storageWarning,setStorageWarning]=useState(initial.current.status==='unavailable'||initial.current.status==='corrupt');
 const [storageCorrupt,setStorageCorrupt]=useState(initial.current.status==='corrupt');
 const commit=(next:UserProgress):boolean=>{
  // Never destroy an unreadable local backup through ordinary navigation or bookmarking.
  if(storageCorrupt){setStorageWarning(true);return false;}
  const ok=saveProgress(next);
  setStorageWarning(!ok);
  if(ok){current.current=next;setProgress(next);}return ok;
 };
 const bookmark=(id:string)=>void commit({...current.current,bookmarks:current.current.bookmarks.includes(id)?current.current.bookmarks.filter(x=>x!==id):[...current.current.bookmarks,id]});
 const view=(id:string)=>{if(current.current.recentlyViewed[0]!==id)void commit({...current.current,recentlyViewed:[id,...current.current.recentlyViewed.filter(x=>x!==id)].slice(0,18)});};
 const complete=(id:string):boolean=>commit({...current.current,completedExercises:[...new Set([...current.current.completedExercises,id])]});
 const saveScenario=(session:ScenarioSession):boolean=>commit({...current.current,scenarioProgress:{...current.current.scenarioProgress,[session.scenarioId]:session}});
 const saveAttempt=(attempt:AcademyAttempt):boolean=>{
  try{return commit(recordAcademyAttempt(current.current,attempt,exercises,learningPaths));}catch{return false;}
 };
 const replace=(data:UserProgress):boolean=>{
  const result=commitProgressReplacement(current.current,data,true,saveProgress);
  setStorageWarning(result.status!=='saved');
  if(result.status!=='saved')return false;
  current.current=result.value;setProgress(result.value);setStorageCorrupt(false);return true;
 };
 return <ProgressContext.Provider value={{progress,bookmark,view,complete,replace,saveScenario,saveAttempt,storageWarning,storageCorrupt}}>{children}</ProgressContext.Provider>;
}
export function useProgress(){const ctx=useContext(ProgressContext);if(!ctx)throw Error('Progress provider missing');return ctx;}
