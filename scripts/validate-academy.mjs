import {readFileSync} from 'node:fs';
import {validateAcademy} from '../src/domain/academy-validator.ts';
const json=n=>JSON.parse(readFileSync(new URL('../src/data/'+n+'.json',import.meta.url),'utf8'));
export const academyData=()=>({exercises:json('exercises'),learningPaths:json('learning-paths'),laws:json('laws'),concepts:json('concepts'),historicalCases:json('historical-cases'),researchFindings:json('research-findings'),sourceReferences:json('source-references'),scenarios:json('scenarios').scenarios});
if(process.argv[1]&&new URL('file://'+process.argv[1]).href===import.meta.url){const d=academyData();validateAcademy(d);console.log(`HNI Academy integrity: PASS (${d.exercises.length} exercises, ${d.learningPaths.length} paths, ${d.learningPaths.reduce((n,p)=>n+p.lessons.length,0)} lessons)`);}
