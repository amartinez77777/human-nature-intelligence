import {Link} from 'react-router-dom';
import {Bookmark,ArrowUpRight,BookOpen,CheckCircle2,AlertCircle} from 'lucide-react';
import type {ReactNode} from 'react';
import {useProgress} from '../../app/ProgressContext';
import {labelCoverage,type CoverageStatus} from '../../domain/research-status';
import {entityUrl,type EntityType} from '../../domain/entity-types';
import {findCase,findConcept,findLaw,findSource,findReference,claims,sourceReferences,researchFindings} from '../../services/repository';
import {sourceLabel,referenceLabel,locatorLabel} from '../../services/source-labels';
export function Eyebrow({children}:{children:ReactNode}){return <div className="eyebrow">{children}</div>;}
export function Heading({eyebrow,title,sub}:{eyebrow:string;title:string;sub?:string}){return <header className="page-heading"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{sub&&<p>{sub}</p>}</header>;}
export function Status({status}:{status:CoverageStatus}){return <span className={`status ${status}`}>{status==='fully_reviewed'?<CheckCircle2 size={12}/>:<span className="tiny-dot"/>}{labelCoverage[status]}</span>;}
export function BookmarkButton({id}:{id:string}){const {bookmark,progress}=useProgress();const active=progress.bookmarks.includes(id);return <button className={`bookmark-btn ${active?'active':''}`} aria-label={active?'Remove bookmark':'Add bookmark'} aria-pressed={active} onClick={()=>bookmark(id)} title={active?'Remove bookmark':'Bookmark'}><Bookmark size={18} fill={active?'currentColor':'none'}/><span>{active?'Saved':'Save'}</span></button>}
export function ReadingPanel({title,children}:{title:string;children:ReactNode}){return <section className="reading-panel"><h2>{title}</h2>{children}</section>}
export function EmptyState({title,body}:{title:string;body:string}){return <div className="empty-state"><AlertCircle size={19}/><h3>{title}</h3><p>{body}</p></div>}
export function RecordLink({type,id,label}:{type:EntityType;id:string;label?:string}){
 const title=label||(type==='law'?findLaw(id)?.chapterTitle:type==='concept'?findConcept(id)?.name:type==='historical_case'?findCase(id)?.title:type==='source'?findSource(id)?.title:type==='source_reference'?findReference(id)?.section:type==='claim'?claims.find(c=>c.id===id)?.statement:type==='research_finding'?researchFindings.find(f=>f.id===id)?.researchQuestion:undefined)||id;
 const to=type==='source_reference'?(findReference(id)?`/sources/${findReference(id)?.sourceId}`:'/sources'):entityUrl(type,id);
 return <Link className="record-link" to={to}><span>{title}</span><ArrowUpRight size={14}/></Link>;
}
export function ReferencePanel({ids}:{ids:string[]}){
 if(!ids.length)return <EmptyState title="No references yet" body="This record has not been reviewed and sourced."/>;
 return <div className="reference-stack">{ids.map(id=>{
  const ref=findReference(id);if(!ref)return <div className="reference" key={id} role="status">Source reference {id} is unavailable.</div>;
  const source=findSource(ref.sourceId);
  return <div className="reference" key={id}><div className="reference-head"><BookOpen size={16}/><span>{id}</span><span className="reference-direct">{referenceLabel(ref)}</span></div>
  <strong>{source?.title??`Missing source ${ref.sourceId}`}</strong>
  <p>{source?sourceLabel(source):'Source metadata unavailable'}</p>
  <p>{[ref.chapter,ref.section].filter(Boolean).join(' · ')||'Section unspecified'}</p>
  <p>{locatorLabel(ref)}</p><p className="muted">{ref.locatorNotes}</p>
  {source?<Link className="light-link" to={`/sources/${source.id}`}>View source record <ArrowUpRight size={13}/></Link>:<span className="muted">The linked source cannot be opened.</span>}</div>;
 })}</div>;
}
export function FactList({items,empty='Not yet researched'}:{items:string[];empty?:string}){return items.length?<ul className="fact-list">{items.map((x,i)=><li key={`${x}-${i}`}>{x}</li>)}</ul>:<p className="muted">{empty}</p>}
export function RouteCard({to,kicker,title,description,footer}:{to:string;kicker?:string;title:string;description:string;footer?:ReactNode}){return <Link className="route-card" to={to}><div className="route-kicker">{kicker}</div><h3>{title}</h3><p>{description}</p><footer>{footer||'Explore record'}<ArrowUpRight size={16}/></footer></Link>}
export function ResearchNotice(){return <div className="research-notice"><AlertCircle size={17}/><span><strong>Research distinction.</strong> Verified attribution to Greene is not independent historical or scientific verification. Unreviewed sections are intentionally unfilled.</span></div>}
export function EntityReferences({type,id}:{type:'claim'|'source',id:string}){
 if(type==='source'){
  const refs=sourceReferences.filter(r=>r.sourceId===id);
  return <ReadingPanel title="Located passages">{refs.length?<div className="inline-records">{refs.map(r=><div key={r.id}><strong>{r.id}</strong><p>{[r.chapter,r.section].filter(Boolean).join(' · ')||'Section not recorded'}</p><p className="muted">{locatorLabel(r)}</p><p className="muted">{referenceLabel(r)}</p></div>)}</div>:<p className="muted">No locators have been reviewed for this source yet.</p>}</ReadingPanel>;
 }
 return null;
}
