import { z } from 'zod';
import { Coverage, Evidence, Provenance } from './research-status';
import {parseScenarios} from './scenario-validator';
import { RelationshipType } from './relationship-types';

const ID = (prefix: string, digits=4) => z.string().regex(new RegExp(`^${prefix}-\\d{${digits}}$`));
const LawID = z.string().regex(/^LAW-(0[1-9]|1[0-8])$/);
const strings = z.array(z.string().min(1));
const OptionalText=z.string().min(1).nullable();
/** Editorial taxonomy: levels can overlap, [] means not classified. */
export const ExplanationLevel=z.enum(['individual','interpersonal','group','historical_institutional']);
export type ExplanationLevelName=z.infer<typeof ExplanationLevel>;
export const LawRecord=z.object({
 id:LawID,chapterNumber:z.number().int().min(1).max(18),chapterTitle:z.string().min(1),chapterSubtitle:OptionalText,
 centralArgument:OptionalText,explanation:OptionalText,mechanisms:strings,distinctions:strings,behavioralPatterns:strings,
 misconceptions:strings,alternativeExplanations:strings,ethicalConsiderations:strings,limitations:strings,
 relatedConceptIds:z.array(ID('CON')),historicalCaseIds:z.array(ID('CAS')),claimIds:z.array(ID('CLM')),
 exerciseIds:z.array(ID('EXR')),sourceReferenceIds:z.array(ID('REF')),editorialStatus:Coverage
});
export const ConceptRecord=z.object({
 id:ID('CON'),name:z.string().min(1),definition:z.string().min(1),mechanism:OptionalText,observableIndicators:strings,
 alternativeExplanations:strings,commonMisinterpretations:strings,relatedLawIds:z.array(LawID),
 relatedConceptIds:z.array(ID('CON')),claimIds:z.array(ID('CLM')),sourceReferenceIds:z.array(ID('REF')),editorialStatus:Coverage,
 levelsOfExplanation:z.array(ExplanationLevel)
});
export const HistoricalCaseRecord=z.object({
 id:ID('CAS'),title:z.string().min(1),people:strings,historicalPeriod:OptionalText,context:z.string().min(1),
 chronology:z.array(z.object({event:z.string().min(1),dateLabel:z.string().min(1)})),documentedFacts:strings,
 greeneInterpretationClaimIds:z.array(ID('CLM')),alternativeInterpretations:strings,limitations:strings,
 relatedLawIds:z.array(LawID),relatedConceptIds:z.array(ID('CON')),sourceReferenceIds:z.array(ID('REF')),verificationStatus:Provenance,
 levelsOfExplanation:z.array(ExplanationLevel)
});
export const ClaimRecord=z.object({id:ID('CLM'),statement:z.string().min(1),attributedTo:z.string().min(1),
 claimType:z.enum(['author_argument','historical_claim','empirical_claim','editorial_inference']),relatedLawIds:z.array(LawID),
 sourceReferenceIds:z.array(ID('REF')),researchFindingIds:z.array(ID('RES')),qualifications:strings,evidenceStatus:Evidence});
export const SourceRecord=z.object({id:ID('SRC'),author:z.string().min(1),title:z.string().min(1),publicationYear:z.number().int().min(1400).max(2100).nullable(),
 edition:OptionalText,publisherOrJournal:OptionalText,isbnOrDoi:OptionalText,verifiedUrl:z.string().url().refine(value=>/^https?:\/\//.test(value),'Only HTTP(S) source links are allowed').nullable(),sourceType:z.enum(['book','journal_article','archival','web','other']),verificationStatus:Provenance});
export const SourceReferenceRecord=z.object({id:ID('REF'),sourceId:ID('SRC'),chapter:OptionalText,section:OptionalText,
 pdfPageIndex:z.number().int().min(0).nullable(),printedPage:z.string().nullable(),locatorNotes:z.string().min(1),verificationStatus:Provenance});
export const ResearchFindingRecord=z.object({id:ID('RES'),researchQuestion:z.string().min(1),method:OptionalText,populationOrContext:OptionalText,
 finding:z.string().min(1),limitations:strings,relatedClaimIds:z.array(ID('CLM')),sourceReferenceIds:z.array(ID('REF')),evidenceAssessment:Evidence});
export const EntityType=z.enum(['law','concept','historical_case','claim','source','source_reference','research_finding','exercise','learning_path']);
export const KnowledgeEdgeRecord=z.object({id:ID('EDG'),fromEntityType:EntityType,fromEntityId:z.string().min(1),toEntityType:EntityType,
 toEntityId:z.string().min(1),relationshipType:RelationshipType,explanation:z.string().min(1),provenanceType:Provenance,
 sourceReferenceIds:z.array(ID('REF')),verificationStatus:Provenance});
export const ExerciseRecord=z.object({id:ID('EXR'),exerciseType:z.enum(['multiple_choice','evidence_classification','multiple_interpretations']),prompt:z.string().min(1),
 choices:z.array(z.object({id:z.string().min(1),text:z.string().min(1)})).min(2),
 evaluationRules:z.object({correctChoiceIds:strings}),explanations:z.record(z.string().min(1)),
 relatedLawIds:z.array(LawID),relatedConceptIds:z.array(ID('CON')),difficulty:z.enum(['introductory','intermediate','advanced']),sourceReferenceIds:z.array(ID('REF')),revision:z.number().int().positive().optional(),relatedCaseIds:z.array(ID('CAS')).optional(),relatedResearchFindingIds:z.array(ID('RES')).optional()});
export const LessonRecord=z.object({id:ID('LES'),title:z.string().min(1),objective:z.string().min(1),introduction:z.string().min(1),illustration:z.string().min(1),lawIds:z.array(LawID).min(1),conceptIds:z.array(ID('CON')),caseIds:z.array(ID('CAS')),findingIds:z.array(ID('RES')),exerciseIds:z.array(ID('EXR')).min(1),scenarioIds:z.array(ID('SIM')),sourceReferenceIds:z.array(ID('REF')).min(1)});
export type Lesson=z.infer<typeof LessonRecord>;
export const LearningPathRecord=z.object({id:ID('PATH'),title:z.string().min(1),description:z.string().min(1),lawIds:z.array(LawID),
 conceptIds:z.array(ID('CON')),exerciseIds:z.array(ID('EXR')),editorialStatus:Coverage,lessons:z.array(LessonRecord).optional()});
export type LearningPath=z.infer<typeof LearningPathRecord>;
export const ConceptComparisonRecord=z.object({
 id:ID('CMP'),title:z.string().min(1),leftConceptId:ID('CON'),rightConceptId:ID('CON'),
 contrast:z.string().min(1),leftLens:z.string().min(1),rightLens:z.string().min(1),illustration:z.string().min(1),ethics:z.string().min(1),
 relatedLawIds:z.array(LawID).min(1),sourceReferenceIds:z.array(ID('REF')).min(1),editorialStatus:Coverage
}).refine(value=>value.leftConceptId!==value.rightConceptId,'A comparison requires two distinct concepts');
export const ConceptComparisonDataset=z.object({schemaVersion:z.literal(1),comparisons:z.array(ConceptComparisonRecord)});
export type ConceptComparison=z.infer<typeof ConceptComparisonRecord>;
export const ScenarioDataset=z.unknown().transform((input,ctx)=>{try{return parseScenarios(input);}catch(error){ctx.addIssue({code:z.ZodIssueCode.custom,message:error instanceof Error?error.message:"Invalid scenario dataset"});return z.NEVER;}});
export const ScenarioSessionRecord=z.object({scenarioId:ID('SIM'),history:z.array(z.object({stepId:z.string().min(1),choiceId:z.string().min(1)}))});
export const UserProgressRecord=z.object({schemaVersion:z.literal(2),bookmarks:z.array(z.string()),recentlyViewed:z.array(z.string()),
 completedExercises:z.array(ID('EXR')),learningProgress:z.record(z.boolean()),scenarioProgress:z.record(ScenarioSessionRecord),academyAttempts:z.record(z.object({exerciseId:ID('EXR'),revision:z.number().int().positive(),choiceIds:strings})).optional()});
export const DatasetManifest=z.object({schemaVersion:z.literal(3),editionKey:z.string().min(1),sourceSha256:z.string().length(64),stableIdPolicy:z.string().min(1)});
export type Law=z.infer<typeof LawRecord>;export type Concept=z.infer<typeof ConceptRecord>;
export type HistoricalCase=z.infer<typeof HistoricalCaseRecord>;export type Claim=z.infer<typeof ClaimRecord>;
export type SourceReference=z.infer<typeof SourceReferenceRecord>;export type Source=z.infer<typeof SourceRecord>;
export type Edge=z.infer<typeof KnowledgeEdgeRecord>;export type Exercise=z.infer<typeof ExerciseRecord>;
export type UserProgress=z.infer<typeof UserProgressRecord>;
