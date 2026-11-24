/** Read-only research coverage derived from the canonical matrix; never user progress. */
import rawCoverage from '../../research/COVERAGE_MATRIX.json';
export const stage02Coverage=rawCoverage.chapters.slice(0,4);
export const stage03Coverage=rawCoverage.chapters.slice(4,8);
export const stage04Coverage=rawCoverage.chapters.slice(8,12);
export const stage05Coverage=rawCoverage.chapters.slice(12,15);
export const stage06Coverage=rawCoverage.chapters.slice(15,18);
export const researchedCoverage=rawCoverage.chapters.slice(0,18);
const count=(rows:typeof researchedCoverage)=>({
 headingsChecked:rows.reduce((n,c)=>n+(c.sectionHeadingVerification?.verifiedHeadings??0),0),
 headingsTotal:rows.reduce((n,c)=>n+c.internalSectionsIdentified.length,0),
 sectionsReviewed:rows.reduce((n,c)=>n+c.sectionsReviewed.length,0),
 sectionsTotal:rows.reduce((n,c)=>n+c.internalSectionsIdentified.length,0),
 fullyReviewedChapters:rows.filter(c=>c.editorialStatus==='fully_reviewed').length
});
export const stage02Counts=count(stage02Coverage);
export const stage03Counts=count(stage03Coverage);
export const researchedCounts=count(researchedCoverage);

export const stage04Counts=count(stage04Coverage);

export const stage05Counts=count(stage05Coverage);
export const stage06Counts=count(stage06Coverage);
