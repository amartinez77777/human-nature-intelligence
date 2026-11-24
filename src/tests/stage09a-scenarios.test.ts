import {describe,it,expect} from 'vitest';
import {scenarios,rawDataset} from '../services/repository';
import {ScenarioDataset} from '../domain/schemas';
import {validateDataset} from '../domain/validator';
import {startScenario,replayScenario,submitChoice} from '../services/scenario-engine';
import {migrateProgress,blankProgress} from '../services/persistence';
import {exportData,importData} from '../services/import-export';
describe('Stage 09A scenario and migration integration',()=>{
 it('loads all validated scenarios from the existing repository',()=>{expect(ScenarioDataset.parse(rawDataset.scenarios)).toEqual(scenarios);expect(validateDataset(rawDataset).valid).toBe(true);expect(scenarios).toHaveLength(6);});
 it('rejects a missing reference through the canonical dataset validator',()=>{const copy=structuredClone(rawDataset);copy.scenarios.scenarios[0].sourceReferenceIds=['REF-9999'];expect(validateDataset(copy).errors.some(e=>e.code==='INVALID_SCENARIOS')).toBe(true);});
 it('replays a saved branching session through actual backup entry points',()=>{const s=scenarios[0];const initial=startScenario(s);const c=replayScenario(s,initial).current!.choices.find(x=>x.evaluation==='needs_review')!;const session=submitChoice(s,initial,c.id);const data={...blankProgress(),scenarioProgress:{[s.id]:session}};const restored=importData(exportData(data));expect(restored).toEqual(data);expect(replayScenario(s,restored.scenarioProgress[s.id]).current?.kind).toBe('reflection');});
 it('migrates V1 and rejects future schemas',()=>{const p=migrateProgress({schemaVersion:1,bookmarks:['LAW-01'],recentlyViewed:['LAW-02'],completedExercises:['EXR-0001'],learningProgress:{'PATH-0001':true}});expect(p.schemaVersion).toBe(2);expect(p.scenarioProgress).toEqual({});expect(p.completedExercises).toEqual(['EXR-0001']);expect(()=>migrateProgress({...p,schemaVersion:3})).toThrow();});
});
