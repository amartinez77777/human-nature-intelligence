import {useEffect,useRef,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ChevronLeft,Download,Upload,ShieldCheck,BookOpenText,AlertTriangle} from 'lucide-react';
import {sources,findSource,sourceReferences,laws,concepts,historicalCases,claims,researchFindings} from '../../services/repository';
import {useProgress} from '../../app/ProgressContext';
import {downloadExport,downloadRawRecovery,importData} from '../../services/import-export';
import {sourceLabel,sourceTypeLabels,provenanceLabels} from '../../services/source-labels';
import {Heading,ReadingPanel,EntityReferences,EmptyState,Eyebrow,RecordLink} from '../../components/shared/UI';
import type {UserProgress} from '../../domain/schemas';

export function SourcesIndex(){return <><Heading eyebrow="RESEARCH INFRASTRUCTURE" title="Source Registry" sub="Sources are identified and classified individually. Bibliographic inclusion does not establish scientific validity."/><div className="module-panel">{sources.map(s=><Link className="record-link" key={s.id} to={`/sources/${s.id}`}><span>{s.author} · {s.title} ({s.publicationYear??'year unverified'}) · {sourceLabel(s)}</span></Link>)}</div></>}

export function SourceDetail(){const {id}=useParams();const source=findSource(id||'');if(!source)return <EmptyState title="Source not found" body="This source identifier does not exist."/>;
 return <><div className="backline"><Link to="/sources"><ChevronLeft size={16}/> Source registry</Link><span>{source.id}</span></div><div className="detail-hero short"><div><Eyebrow>SOURCE REGISTRY / {sourceTypeLabels[source.sourceType].toUpperCase()}</Eyebrow><h1>{source.title}</h1><p className="detail-subtitle">{source.author} · {source.publicationYear??'year unverified'}</p><span className="source-provenance">{sourceLabel(source)}</span></div><BookOpenText size={28}/></div>
 <ReadingPanel title="Bibliography & provenance"><dl className="source-metadata"><dt>Author</dt><dd>{source.author}</dd><dt>Title</dt><dd>{source.title}</dd><dt>Source type</dt><dd>{sourceTypeLabels[source.sourceType]}</dd><dt>Verification</dt><dd>{provenanceLabels[source.verificationStatus]}</dd><dt>Year</dt><dd>{source.publicationYear??'Not established'}</dd><dt>Publisher / journal</dt><dd>{source.publisherOrJournal??'Not established'}</dd><dt>Edition</dt><dd>{source.edition??'Not established'}</dd><dt>ISBN / DOI</dt><dd>{source.isbnOrDoi??'Not verified'}</dd><dt>Verified URL</dt><dd>{source.verifiedUrl?<a href={source.verifiedUrl} target="_blank" rel="noreferrer noopener">View original reference</a>:'Not provided'}</dd></dl>{source.id==='SRC-0001'&&<p className="muted">This particular uploaded PDF contains several format ISBNs on its copyright page. None uniquely identifies the PDF rendition. Physical PDF page indexes start at 0; printed-page mapping is not established.</p>}<p className="muted">Inspection of a source does not independently verify its historical assertions or demonstrate empirical support.</p></ReadingPanel>
 <Link className="secondary-button" to={`/network?entity=${source.id}`}>Explore network</Link><EntityReferences type="source" id={source.id}/>
 <ReadingPanel title="Research records using this source"><div className="link-rows">{(()=>{
  const ids=new Set(sourceReferences.filter(r=>r.sourceId===source.id).map(r=>r.id));
  const matching=[...laws.filter(r=>r.sourceReferenceIds.some(id=>ids.has(id))).map(r=>({type:'law' as const,id:r.id})),
   ...concepts.filter(r=>r.sourceReferenceIds.some(id=>ids.has(id))).map(r=>({type:'concept' as const,id:r.id})),
   ...historicalCases.filter(r=>r.sourceReferenceIds.some(id=>ids.has(id))).map(r=>({type:'historical_case' as const,id:r.id})),
   ...claims.filter(r=>r.sourceReferenceIds.some(id=>ids.has(id))).map(r=>({type:'claim' as const,id:r.id})),
   ...researchFindings.filter(r=>r.sourceReferenceIds.some(id=>ids.has(id))).map(r=>({type:'research_finding' as const,id:r.id}))];
  return matching.length?matching.map(m=><RecordLink key={m.id} type={m.type} id={m.id}/>):<p className="muted">No currently linked research records.</p>;
 })()}</div></ReadingPanel></>;
}

export function Settings(){
 const {progress,replace,storageCorrupt}=useProgress();const [msg,setMsg]=useState('');const [pending,setPending]=useState<UserProgress|null>(null);
 const input=useRef<HTMLInputElement>(null);const dialog=useRef<HTMLDialogElement>(null);const cancelButton=useRef<HTMLButtonElement>(null);const selection=useRef(0);
 useEffect(()=>{const node=dialog.current;if(!node)return;if(pending){if(!node.open)node.showModal();cancelButton.current?.focus();}else if(node.open)node.close();},[pending]);
 const restore=async(file:File|undefined)=>{
  const token=++selection.current;setMsg('');setPending(null);if(!file)return;
  try{
   if(file.size===0)throw Error('Backup is empty.');
   if(file.size>1_000_000)throw Error('Backup exceeds the 1 MB safety limit.');
   const next=importData(await file.text());
   if(token===selection.current)setPending(next);
  }catch(error){if(token===selection.current)setMsg(error instanceof Error?error.message:'Import failed. Existing progress was not changed.');}
  finally{if(token===selection.current&&input.current)input.current.value='';}
 };
 const cancel=()=>{selection.current++;setPending(null);setMsg('Import canceled. Your existing progress was not changed.');};
 const confirm=()=>{if(!pending)return;const ok=replace(pending);if(ok){selection.current++;setPending(null);setMsg('Backup imported and saved on this device.');}else setMsg('Import was not saved. Your previous progress remains unchanged. Check browser storage and try again.');};
 const exportCurrent=()=>{try{downloadExport(progress);setMsg('Backup download requested. Confirm it is saved in your device’s files.');}catch(error){setMsg(error instanceof Error?error.message:'Export failed.');}};
 return <><Heading eyebrow="LOCAL-FIRST / PERSONAL DATA" title="Data & backups" sub="Optional reading progress stays in this browser. There is no account or server-side sync."/>
 <div className="two-grid"><div className="module-panel settings-card"><Download size={24}/><h2>Export your personal progress</h2><p>Download a versioned JSON backup containing bookmarks, recently viewed records, completed learning exercises, saved Academy answers, learning-path progress and simulation sessions. Source research datasets are never included. {storageCorrupt&&'Use the raw recovery download below to preserve the unreadable original. It is not a validated backup.'}</p><button className="primary-button" disabled={storageCorrupt} onClick={exportCurrent}>Export progress JSON <Download size={17}/></button></div><div className="module-panel settings-card"><Upload size={24}/><h2>Import a prior backup</h2><p>Select a version 1 or 2 HNI backup. Valid version 1 backups are migrated automatically. The contents are checked before any replacement is offered.</p><label className="secondary-button file-select">Select JSON backup <input ref={input} type="file" accept="application/json,.json" onChange={e=>void restore(e.target.files?.[0])}/><Upload size={17}/></label></div></div>
 {storageCorrupt&&<div className="module-panel message" role="alert"><AlertTriangle size={20}/> Saved progress is corrupt and has been left untouched in browser storage. Download the untouched original payload before replacing it with a valid backup. <button className="secondary-button" onClick={()=>{try{downloadRawRecovery();setMsg('Raw recovery download requested. This file is not a validated import.');}catch(error){setMsg(error instanceof Error?error.message:'Recovery download failed.');}}}>Download original data</button></div>}
 {msg&&<div role="status" className="module-panel message">{msg}</div>}
 <div className="module-panel settings-disclaimer"><ShieldCheck size={23}/><div><h3>Data safety</h3><p>Progress belongs to this website origin and browser. GitHub Pages and Netlify do not share local data, nor do different devices. Export before changing hosts or clearing website data, then import and confirm on the new site. Keep backups somewhere safe.</p><p>Research datasets cannot be overwritten with the progress-import feature.</p></div></div>
 <dialog ref={dialog} className="import-dialog" aria-labelledby="import-title" aria-describedby="import-description" onCancel={e=>{e.preventDefault();cancel();}}>
 {pending&&<><h2 id="import-title">Replace saved progress?</h2><p id="import-description">This verified backup will <strong>replace</strong> all locally saved bookmarks, recent records, completed exercises, learning-path progress, saved Academy answers, and simulation sessions. This action cannot be undone without another backup.</p><dl className="import-summary"><dt>Bookmarks in backup</dt><dd>{pending.bookmarks.length}</dd><dt>Recently viewed</dt><dd>{pending.recentlyViewed.length}</dd><dt>Completed exercises</dt><dd>{pending.completedExercises.length}</dd><dt>Academy answers in backup</dt><dd>{Object.keys(pending.academyAttempts??{}).length}</dd><dt>Simulation sessions in backup</dt><dd>{Object.keys(pending.scenarioProgress).length}</dd><dt>Existing simulation sessions to replace</dt><dd>{Object.keys(progress.scenarioProgress).length}</dd><dt>Existing bookmarks to replace</dt><dd>{progress.bookmarks.length}</dd></dl><p className="muted">Bundled laws, sources, claims, and historical research will not change.</p><div className="dialog-actions"><button ref={cancelButton} className="secondary-button" type="button" onClick={cancel}>Cancel</button><button className="primary-button" type="button" onClick={confirm}>Confirm replacement</button></div>{msg&&<p role="alert">{msg}</p>}</>}
 </dialog>
 </>;
}
