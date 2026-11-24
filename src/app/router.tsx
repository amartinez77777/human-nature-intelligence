import {Routes,Route,Navigate} from 'react-router-dom';
import CommandCenter from '../modules/command-center/CommandCenter';
import {LawsIndex,LawDetail} from '../modules/laws-library/LawsLibrary';
import {AtlasIndex,ConceptDetail} from '../modules/behavior-atlas/BehaviorAtlas';
import ComparisonExplorer from '../modules/behavior-atlas/ComparisonExplorer';
import ConceptComparisons from '../modules/behavior-atlas/ConceptComparisons';
import {CasesIndex,CaseDetail} from '../modules/historical-cases/HistoricalCases';
import KnowledgeNetwork from '../modules/knowledge-network/KnowledgeNetwork';
import SimulationLab from '../modules/simulation-lab/SimulationLab';
import {EvidenceIndex,ClaimDetail,EvidenceMethodology,FindingDetail} from '../modules/science-evidence/ScienceEvidence';
import IntelligenceAcademy from '../modules/intelligence-academy/IntelligenceAcademy';
import {SourcesIndex,SourceDetail,Settings} from '../modules/command-center/SourceAndSettings';
import SearchPage from '../modules/command-center/SearchPage';
export default function Router(){return <Routes>
 <Route path="/" element={<CommandCenter/>}/><Route path="/laws" element={<LawsIndex/>}/><Route path="/laws/:id" element={<LawDetail/>}/>
 <Route path="/atlas" element={<AtlasIndex/>}/><Route path="/atlas/compare" element={<ConceptComparisons/>}/><Route path="/atlas/:id" element={<ConceptDetail/>}/>
 <Route path="/cases" element={<CasesIndex/>}/><Route path="/cases/:id" element={<CaseDetail/>}/>
 <Route path="/compare" element={<ComparisonExplorer/>}/><Route path="/network" element={<KnowledgeNetwork/>}/><Route path="/lab" element={<SimulationLab/>}/><Route path="/lab/:id" element={<SimulationLab/>}/>
 <Route path="/evidence" element={<EvidenceIndex/>}/><Route path="/evidence/methodology" element={<EvidenceMethodology/>}/><Route path="/evidence/findings/:id" element={<FindingDetail/>}/><Route path="/evidence/:id" element={<ClaimDetail/>}/>
 <Route path="/academy" element={<IntelligenceAcademy/>}/><Route path="/academy/path/:pathId" element={<IntelligenceAcademy/>}/><Route path="/academy/path/:pathId/lesson/:lessonId" element={<IntelligenceAcademy/>}/><Route path="/academy/exercise/:exerciseId" element={<IntelligenceAcademy/>}/><Route path="/sources" element={<SourcesIndex/>}/><Route path="/sources/:id" element={<SourceDetail/>}/>
 <Route path="/search" element={<SearchPage/>}/><Route path="/settings" element={<Settings/>}/>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>}
