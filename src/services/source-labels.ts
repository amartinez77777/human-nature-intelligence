import type {Source,SourceReference} from '../domain/schemas';
export const sourceTypeLabels:Record<Source['sourceType'],string>={
 book:'Book',journal_article:'Journal article',archival:'Archival source',web:'Web reference',other:'Other reference'
};
export const provenanceLabels:Record<Source['verificationStatus'],string>={
 directly_inspected:'Directly inspected',independently_verified:'Independently verified',
 secondary_source_account:'Secondary-source account',editorial_synthesis:'Editorial synthesis',unverified:'Unverified'
};
export function sourceLabel(source:Source){return `${sourceTypeLabels[source.sourceType]} · ${provenanceLabels[source.verificationStatus]}`;}
export function referenceLabel(ref:SourceReference){return provenanceLabels[ref.verificationStatus];}
/** Page numbers are meaningful only when a PDF locator is supplied for this reference. */
export function locatorLabel(ref:SourceReference){
 const parts:string[]=[];
 if(ref.pdfPageIndex!==null)parts.push(`PDF index ${ref.pdfPageIndex} (zero-based); viewer page ${ref.pdfPageIndex+1} (one-based)`);
 if(ref.printedPage!==null)parts.push(`Printed page ${ref.printedPage}`);
 return parts.length?parts.join(' · '):'Locator format not established';
}
