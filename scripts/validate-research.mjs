import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const json=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const m=json('research/PDF_SOURCE_MANIFEST.json'),cm=json('research/CHAPTER_MAP.json'),c=json('research/COVERAGE_MATRIX.json'),ledger=json('research/SOURCE_LEDGER.json'),log=json('research/STAGE_02_READING_LOG.json'),log3=json('research/STAGE_03_READING_LOG.json'),refs=json('src/data/source-references.json'),manifest=json('src/data/dataset-manifest.json'),laws=json('src/data/laws.json');
const log4=json('research/STAGE_04_READING_LOG.json');
const log5=json('research/STAGE_05_READING_LOG.json');
const log6=json('research/STAGE_06_READING_LOG.json');
const fullbook=json('research/STAGE_06_FULL_BOOK_AUDIT.json');
const backlog=json('research/STAGE_07_EVIDENCE_BACKLOG.json');
const claims=json('src/data/claims.json');
const err=[];const check=(ok,message)=>{if(!ok)err.push(message)};
check(m.sha256===log.pdfSha256 && m.sha256===manifest.sourceSha256,'The source fingerprints differ');
check(m.pageCount===log.pdfPages && m.pageCount===690,'PDF page count mismatch');
check(c.chapters.length===18 && cm.chapters.length===18,'Expected all 18 mapped chapters');
check(log.sections.length===14,'Stage 02 expects 14 major chapter section entries');
const idrefs=new Set(refs.map(r=>r.id));
for(const r of refs){if(r.sourceId==='SRC-0001')check(r.pdfPageIndex>=0 && r.pdfPageIndex<m.pageCount,`Invalid book reference ${r.id}`)}
for(const row of ledger.records){
 check(idrefs.has(row.referenceId),`Unknown research-ledger reference ${row.referenceId}`);
 const ref=refs.find(r=>r.id===row.referenceId);
 if(ref){check(ref.sourceId===row.sourceId,`Inconsistent ledger source ${row.referenceId}`);check(ref.pdfPageIndex===row.pdfPageIndexZeroBased,`Ledger index mismatch ${row.referenceId}`);check(ref.sourceId!=='SRC-0001'? row.pdfViewerPageOneBased===null : row.pdfViewerPageOneBased===ref.pdfPageIndex+1,`Viewer page mismatch ${row.referenceId}`)}
}
for(const record of log.sections){
 const cRow=c.chapters.find(x=>x.lawId===record.lawId);
 check(Boolean(cRow),`Unmapped chapter ${record.lawId}`);
 if(!cRow)continue;
 check(cRow.internalSectionsIdentified.some(s=>s.title===record.section&&s.pdfPageIndexZeroBased===record.startPdfPageIndex),`Section heading mismatch ${record.lawId}/${record.section}`);
 check(record.startPdfPageIndex<=record.endPdfPageIndex,`Invalid section bounds ${record.section}`);
 for(const spot of record.spotChecks)check(spot.textLayerPresent && spot.viewerPage===spot.pdfPageIndex+1 && spot.pdfPageIndex>=record.startPdfPageIndex && spot.pdfPageIndex<=record.endPdfPageIndex,`Invalid spot check ${record.section}`);
}
// Stage 03: source-fingerprint, 12 actual section headings, and chapter-specific zero-based locators.
check(log3.pdfSha256===m.sha256 && log3.pdfPages===m.pageCount,'Stage 03 PDF fingerprint or page count mismatch');
check(log3.sections.length===12,'Stage 03 must map three major sections for Laws 5–8');
for(const section of log3.sections){
 const chapter=c.chapters.find(ch=>ch.lawId===section.lawId);
 check(Boolean(chapter),`Stage 03 unmapped law ${section.lawId}`);
 if(!chapter)continue;
 check(section.headingVerified===true && chapter.internalSectionsIdentified.some(x=>x.title===section.section&&x.pdfPageIndexZeroBased===section.startPdfPageIndex),`Stage 03 section boundary mismatch ${section.section}`);
 check(section.startPdfPageIndex>=chapter.pdfStartIndex && section.endPdfPageIndex<=chapter.pdfEndIndex && section.startPdfPageIndex<=section.endPdfPageIndex,`Stage 03 range outside chapter ${section.section}`);
 for(const spot of section.spotChecks)check(spot.textLayerPresent===true && spot.viewerPage===spot.pdfPageIndex+1 && spot.pdfPageIndex>=section.startPdfPageIndex && spot.pdfPageIndex<=section.endPdfPageIndex,`Stage 03 invalid page spot check ${section.section}`);
}
for(const chapter of c.chapters.slice(4,8)){
 const law=laws.find(l=>l.id===chapter.lawId);
 check(law?.editorialStatus===chapter.editorialStatus,`Stage 03 law status mismatch ${chapter.lawId}`);
 check(chapter.editorialStatus==='partially_reviewed',`Stage 03 must not auto-upgrade partial law ${chapter.lawId}`);
 check(chapter.sectionsReviewed.length+chapter.sectionsRemaining.length===chapter.internalSectionsIdentified.length,`Stage 03 section accounting mismatch ${chapter.lawId}`);
 check(chapter.sectionHeadingVerification?.verifiedHeadings===3,`Stage 03 unverified major section ${chapter.lawId}`);
}
for(const page of log3.pageChecks){
 const ch=c.chapters.find(x=>x.lawId===page.lawId);
 check(ch&&page.pdfPageIndex>=ch.pdfStartIndex&&page.pdfPageIndex<=ch.pdfEndIndex&&page.pdfViewerPage===page.pdfPageIndex+1&&page.hasText===true,`Stage 03 page check mismatch ${page.lawId}/${page.pdfViewerPage}`);
}
for(const chapter of c.chapters.slice(0,4)){
 const law=laws.find(l=>l.id===chapter.lawId);
 check(law?.editorialStatus===chapter.editorialStatus,`Coverage status differs from canonical law ${chapter.lawId}`);
 check(chapter.editorialStatus==='partially_reviewed',`Chapter incorrectly marked complete ${chapter.lawId}`);
 const known=new Set(chapter.internalSectionsIdentified.map(s=>s.title));
 for(const title of [...chapter.sectionsReviewed,...chapter.sectionsRemaining])check(known.has(title),`Unknown section ${title}`);
 check(chapter.sectionsReviewed.length+chapter.sectionsRemaining.length===known.size,`Incomplete or duplicated section accounting ${chapter.lawId}`);
}
// Stage 04 contract: direct, same-hash text extraction with conservative section review credit.
check(log4.pdfSha256===m.sha256&&log4.pdfPages===m.pageCount,'Stage 04 PDF identity mismatch');
check(log4.sections.length===14,'Stage 04 expected 14 section headings across Laws 9–12');
for(const section of log4.sections){
 const chapter=c.chapters.find(ch=>ch.lawId===section.lawId);
 check(Boolean(chapter),'Stage 04 unmapped section '+section.lawId);
 if(!chapter)continue;
 check(section.headingVerified===true&&chapter.internalSectionsIdentified.some(p=>p.title===section.section&&p.pdfPageIndexZeroBased===section.startPdfPageIndex),'Stage 04 heading index mismatch '+section.section);
 check(section.startPdfPageIndex>=chapter.pdfStartIndex&&section.endPdfPageIndex<=chapter.pdfEndIndex&&section.startPdfPageIndex<=section.endPdfPageIndex,'Stage 04 range out of bounds '+section.section);
}
for(const ch of c.chapters.slice(8,12)){
 const law=laws.find(x=>x.id===ch.lawId);
 check(ch.editorialStatus===law?.editorialStatus&&ch.editorialStatus==='partially_reviewed','Stage 04 law coverage mismatch '+ch.lawId);
 check(ch.sectionHeadingVerification?.verifiedHeadings===ch.internalSectionsIdentified.length,'Stage 04 incomplete heading check '+ch.lawId);
 check(ch.sectionsReviewed.length+ch.sectionsRemaining.length===ch.internalSectionsIdentified.length,'Stage 04 inconsistent section accounting '+ch.lawId);
}
for(const page of log4.pageChecks){const ch=c.chapters.find(x=>x.lawId===page.lawId);check(ch&&page.hasText&&page.pdfPageIndex>=ch.pdfStartIndex&&page.pdfPageIndex<=ch.pdfEndIndex&&page.viewerPage===page.pdfPageIndex+1,'Stage 04 invalid spot page '+page.viewerPage)}
const practical=cm.chapters[10].internalSections.find(s=>s.title==='Practical Grandiosity');
check(practical?.pdfPageIndexZeroBased===347,'Law 11 Practical Grandiosity correction not applied');

// Stage 05: same physical PDF, source-aware section locators and transparency about partial review.
check(log5.pdfSha256===m.sha256&&log5.pdfPages===m.pageCount,'Stage 05 PDF source fingerprint mismatch');
check(log5.sections.length===9&&log5.pageChecks.length===30,'Stage 05 requires nine heading checks and thirty direct page checks');
for(const section of log5.sections){
 const chapter=c.chapters.find(x=>x.lawId===section.lawId);
 check(Boolean(chapter),'Stage 05 unmapped heading '+section.lawId);if(!chapter)continue;
 check(section.headingVerified===true&&chapter.internalSectionsIdentified.some(x=>x.title===section.section&&x.pdfPageIndexZeroBased===section.startPdfPageIndex),'Stage 05 wrong chapter heading '+section.section);
 check(section.startPdfPageIndex<=section.endPdfPageIndex&&section.startPdfPageIndex>=chapter.pdfStartIndex&&section.endPdfPageIndex<=chapter.pdfEndIndex,'Stage 05 section outside PDF chapter '+section.section);
}
for(const ch of c.chapters.slice(12,15)){
 const law=laws.find(x=>x.id===ch.lawId);
 check(ch.editorialStatus===law?.editorialStatus&&ch.editorialStatus==='partially_reviewed','Stage 05 law coverage not partial '+ch.lawId);
 check(ch.sectionHeadingVerification?.verifiedHeadings===3,'Stage 05 missing heading '+ch.lawId);
 check(ch.sectionsReviewed.length===1&&ch.sectionsRemaining.length===2,'Stage 05 partial section accounting broken '+ch.lawId);
}
for(const page of log5.pageChecks){const ch=c.chapters.find(x=>x.lawId===page.lawId);
 check(Boolean(ch)&&page.hasText&&page.pdfPageIndex>=ch.pdfStartIndex&&page.pdfPageIndex<=ch.pdfEndIndex&&page.viewerPage===page.pdfPageIndex+1,'Stage 05 incorrect page check '+page.viewerPage);
}
const reality=cm.chapters[13].internalSections.find(x=>x.title==='The Reality Group');
check(reality?.pdfPageIndexZeroBased===472&&reality?.pdfPageOneBased===473,'Law 14 Reality Group heading must begin at zero-based PDF index 472');
check(manifest.schemaVersion===3,'Stage 09B canonical dataset requires schema v3');

// Stage 06: source locators, all-18 synthesis and a claim-linked independent-research queue.
check(log6.pdfSha256===m.sha256&&log6.pdfPages===m.pageCount,'Stage 06 PDF identity mismatch');
check(log6.sections.length===11&&log6.pageChecks.length===30,'Stage 06 must directly check eleven headings and thirty page anchors');
for(const s of log6.sections){const ch=c.chapters.find(x=>x.lawId===s.lawId);
 check(Boolean(ch)&&s.headingVerified===true&&ch.internalSectionsIdentified.some(x=>x.title===s.section&&x.pdfPageIndexZeroBased===s.startPdfPageIndex),'Stage 06 section heading mismatch '+s.section);
 check(s.startPdfPageIndex<=s.endPdfPageIndex&&s.startPdfPageIndex>=ch?.pdfStartIndex&&s.endPdfPageIndex<=ch?.pdfEndIndex,'Stage 06 section out of chapter '+s.section);
}
for(const page of log6.pageChecks){const ch=c.chapters.find(x=>x.lawId===page.lawId);
 check(Boolean(ch)&&page.hasText&&page.charsExtracted>400&&page.viewerPage===page.pdfPageIndex+1&&page.pdfPageIndex>=ch.pdfStartIndex&&page.pdfPageIndex<=ch.pdfEndIndex,'Stage 06 invalid page '+page.viewerPage);
}
for(const ch of c.chapters){const law=laws.find(x=>x.id===ch.lawId);
 check(ch.editorialStatus===law?.editorialStatus&&ch.editorialStatus==='partially_reviewed','Stage 06 all-law partial-coverage contract broken '+ch.lawId);
 check(ch.sectionsReviewed.length+ch.sectionsRemaining.length===ch.internalSectionsIdentified.length,'Stage 06 section accounting broken '+ch.lawId);
}
const ctrl=cm.chapters[15].internalSections.find(x=>x.title==='Controlled Aggression');
const patterns=cm.chapters[16].internalSections.find(x=>x.title==='Generational Patterns');
check(ctrl?.pdfPageIndexZeroBased===560,'Stage 06 Controlled Aggression must begin at index 560');
check(patterns?.pdfPageIndexZeroBased===595,'Stage 06 Generational Patterns must begin at index 595');
check(fullbook.laws.length===18&&fullbook.sourceSha256===m.sha256,'Stage 06 full-book audit missing');
for(const row of fullbook.laws){const law=laws.find(x=>x.id===row.lawId);
 check(Boolean(law)&&row.uiRoute==='/laws/'+row.lawId&&row.editorialStatus===law.editorialStatus,'Stage 06 full-book route or status incorrect '+row.lawId);
}
check(backlog.items.length>=10&&backlog.items.length<=15,'Stage 07 backlog requires 10–15 research questions');
for(const item of backlog.items){const claim=claims.find(x=>x.id===item.claimId);
 check(Boolean(claim)&&claim.relatedLawIds.includes(item.lawId)&&item.bookReferenceIds.every(id=>idrefs.has(id))&&item.scientificEvidenceStatus===claim.evidenceStatus,
 'Stage 07 backlog claim/source invalid '+item.claimId);
}

if(err.length){for(const x of err)console.error('RESEARCH ERROR:',x);process.exitCode=1;}
else console.log(`HNI research integrity: PASS (${ledger.records.length} ledger links, ${log.sections.length+log3.sections.length+log4.sections.length+log5.sections.length+log6.sections.length} verified section headings, ${refs.length} reference records).`);
