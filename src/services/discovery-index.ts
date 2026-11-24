import {laws,concepts,historicalCases,claims,researchFindings,sources,sourceReferences,knowledgeEdges} from './repository';
import {makeDiscoveryIndex} from './discovery-adapter';
export const {graph,graphNodes,lexicalIndex}=makeDiscoveryIndex({laws,concepts,historicalCases,claims,researchFindings,sources,sourceReferences,knowledgeEdges});
