/** Build a return link only from actual canonical exercise/lesson membership. */
export function academyReturnUrl(params:URLSearchParams,exercises:readonly {id:string}[],paths:readonly {id:string;lessons?:{id:string;exerciseIds:string[]}[]}[]):string|undefined{
 const id=params.get('exercise');if(!id||!exercises.some(e=>e.id===id))return undefined;
 const base=`/academy/exercise/${id}`;
 const path=paths.find(p=>p.id===params.get('path'));
 const lesson=path?.lessons?.find(l=>l.id===params.get('lesson')&&l.exerciseIds.includes(id));
 return path&&lesson?`${base}?${new URLSearchParams({path:path.id,lesson:lesson.id})}`:base;
}
