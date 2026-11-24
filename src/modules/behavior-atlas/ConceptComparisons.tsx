import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftRight,ArrowUpRight,BookOpenText} from 'lucide-react';
import {conceptComparisons,findConcept} from '../../services/repository';
import {Heading,Status,ReferencePanel,ResearchNotice,EmptyState,RecordLink,Eyebrow} from '../../components/shared/UI';

/** Curated source-linked, reviewed comparisons, not on-demand model inference. */
export default function ConceptComparisons(){
 const [selected,setSelected]=useState(conceptComparisons[0]?.id??'');
 const comparison=conceptComparisons.find(x=>x.id===selected);
 if(!comparison)return <EmptyState title="No verified comparison available" body="Editorial comparisons appear only after their source material has been reviewed."/>;
 const a=findConcept(comparison.leftConceptId),b=findConcept(comparison.rightConceptId);
 if(!a||!b)return <EmptyState title="Comparison references unavailable" body="A linked concept is missing. No explanation has been substituted."/>;
 return <><Heading eyebrow="HUMAN BEHAVIOR ATLAS / COMPARATIVE REASONING" title="Concept Comparisons" sub="Compare meanings, mechanisms and ethical boundaries using canonical research records, not generated interpretations."/>
 <section className="module-panel comparison-picker"><label htmlFor="comparison-select"><ArrowLeftRight size={19}/> Choose a researched distinction</label><select id="comparison-select" value={selected} onChange={e=>setSelected(e.target.value)}>{conceptComparisons.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select><p>Only editor-reviewed pairs are available. Unsupported pairings are deliberately omitted.</p></section>
 <section aria-labelledby="comparison-heading" className="comparison-sheet"><div className="comparison-sheet-header"><div><Eyebrow>{comparison.id} / DOCUMENTED COMPARISON</Eyebrow><h2 id="comparison-heading">{comparison.title}</h2></div><Status status={comparison.editorialStatus}/></div>
 <p className="comparison-thesis">{comparison.contrast}</p><div className="comparison-columns"><article className="comparison-side"><span className="comparison-side-kicker">PERSPECTIVE A</span><h3><Link to={`/atlas/${a.id}`}>{a.name} <ArrowUpRight size={15}/></Link></h3><p>{a.definition}</p><h4>Critical question</h4><p>{comparison.leftLens}</p><h4>Proposed mechanism</h4><p>{a.mechanism??'Not yet researched.'}</p><small>{a.id}</small></article><article className="comparison-side"><span className="comparison-side-kicker">PERSPECTIVE B</span><h3><Link to={`/atlas/${b.id}`}>{b.name} <ArrowUpRight size={15}/></Link></h3><p>{b.definition}</p><h4>Critical question</h4><p>{comparison.rightLens}</p><h4>Proposed mechanism</h4><p>{b.mechanism??'Not yet researched.'}</p><small>{b.id}</small></article></div>
 <div className="comparison-extra"><section><h3>Fictional illustration</h3><p>{comparison.illustration}</p></section><section><h3>Ethics and limits</h3><p>{comparison.ethics}</p></section></div></section>
 <section className="module-panel comparison-related"><h3><BookOpenText size={19}/> Source-grounded context</h3><div className="comparison-law-links">{comparison.relatedLawIds.map(id=><RecordLink key={id} type="law" id={id}/>)}</div><ReferencePanel ids={comparison.sourceReferenceIds}/><p className="muted">Greene’s book establishes what he argues, not independently confirmed scientific efficacy.</p></section><ResearchNotice/></>;
}
