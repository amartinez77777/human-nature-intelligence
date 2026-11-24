import {readFileSync} from 'node:fs';
import {parseScenarios} from '../src/domain/scenario-validator.ts';
const read=name=>JSON.parse(readFileSync(new URL(`../src/data/${name}.json`,import.meta.url),'utf8'));
try{const scenarios=parseScenarios(read('scenarios'),{laws:read('laws'),concepts:read('concepts'),historicalCases:read('historical-cases'),claims:read('claims'),researchFindings:read('research-findings'),sourceReferences:read('source-references')});console.log(`HNI scenario integrity: PASS (${scenarios.length} fictional scenarios, ${scenarios.reduce((n,s)=>n+s.steps.length,0)} steps)`);}catch(e){console.error(e.message);process.exitCode=1;}
